// src/pages/seller/CreateAuction.tsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type RootState, type AppDispatch } from '../../store';
import { fetchCategories, createAuction, clearError, fetchSellerProfile } from '../../store/slices/sellerSlice';
import TierBadge from '../../components/seller/TierBadge';

interface FormData {
  title: string;
  description: string;
  category_id: number | '';
  subcategory_id: number | '';
  starting_price: string;
  reserve_price: string;
  buy_now_price: string;
  bid_increment: string;
  condition: string;
  images: string[];
  start_time: string;
  end_time: string;
}

interface FormErrors {
  [key: string]: string;
}

const CreateAuction: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const {
    categories =[],
    currentTier,
    profile,
    isLoading,
    error
  } = useSelector((state: RootState) => state.seller);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category_id: '',
    subcategory_id: '',
    starting_price: '',
    reserve_price: '',
    buy_now_price: '',
    bid_increment: '1',
    condition: '',
    images: [],
    start_time: '',
    end_time: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imageInput, setImageInput] = useState('');


// FIXED: ENSURE CATEGORIES ARE FETCHED WHEN COMPONENT MOUNTS
  useEffect(() => {
    console.log('createAuction mounted, fetching data...')
    dispatch(fetchCategories());
    dispatch(fetchSellerProfile());
  }, [dispatch]);

//debug for check
useEffect(() => {
    console.log('Categories updated:', categories);
  }, [categories]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Add this useEffect after your existing useEffects:
useEffect(() => {
  // Reset subcategory when category changes and subcategory doesn't belong to new category
  if (formData.category_id && formData.subcategory_id) {
    const category = categories?.find(c => c.id === formData.category_id);
    if (category && !category.subcategories?.some(sc => sc.id === formData.subcategory_id)) {
      setFormData(prev => ({ ...prev, subcategory_id: '' }));
    }
  }
}, [formData.category_id, categories]);


  const selectedCategory = categories?.find(c => c.id === formData.category_id);



  

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim() || formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim() || formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    const startingPrice = parseFloat(formData.starting_price);
    if (!formData.starting_price || isNaN(startingPrice) || startingPrice <= 0) {
      newErrors.starting_price = 'Valid starting price is required';
    }

    // Tier-based validation
    if (currentTier && startingPrice > currentTier.maxValue) {
      newErrors.starting_price = `${currentTier.name} sellers can only list items up to $${currentTier.maxValue}`;
    }

    if (formData.reserve_price) {
      const reservePrice = parseFloat(formData.reserve_price);
      if (isNaN(reservePrice) || reservePrice <= 0) {
        newErrors.reserve_price = 'Valid reserve price is required';
      } else if (reservePrice <= startingPrice) {
        newErrors.reserve_price = 'Reserve price must be higher than starting price';
      }
      
      // Feature restriction validation
      if (currentTier && !currentTier.features.includes('Reserve prices')) {
        newErrors.reserve_price = 'Reserve price requires Trusted tier';
      }
    }

    if (formData.buy_now_price) {
      const buyNowPrice = parseFloat(formData.buy_now_price);
      if (isNaN(buyNowPrice) || buyNowPrice <= 0) {
        newErrors.buy_now_price = 'Valid buy now price is required';
      } else if (buyNowPrice <= startingPrice) {
        newErrors.buy_now_price = 'Buy now price must be higher than starting price';
      }
      
      // Feature restriction validation
      if (currentTier && !currentTier.features.includes('Buy Now option')) {
        newErrors.buy_now_price = 'Buy Now option requires Verified tier or higher';
      }
    }

    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    } else {
      const endTime = new Date(formData.end_time);
      const now = new Date();
      if (endTime <= now) {
        newErrors.end_time = 'End time must be in the future';
      }
    }

    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    } else if (!['new', 'like_new', 'good', 'fair', 'poor'].includes(formData.condition)) {
    newErrors.condition = 'Invalid condition selected';
  }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;


    // NEW: Map display values to database values
  const conditionMapping = {
    'new': 'new',
    'like_new': 'like-new',  // This is the key fix!
    'good': 'good',
    'fair': 'fair',
    'poor': 'poor'
  };

    const submitData = {
      ...formData,
      category_id: Number(formData.category_id),
      subcategory_id: formData.subcategory_id ? Number(formData.subcategory_id) : undefined,
      starting_price: parseFloat(formData.starting_price),
      reserve_price: formData.reserve_price ? parseFloat(formData.reserve_price) : undefined,
      buy_now_price: formData.buy_now_price ? parseFloat(formData.buy_now_price) : undefined,
      bid_increment: parseFloat(formData.bid_increment),
      condition: conditionMapping[formData.condition as keyof typeof conditionMapping] || formData.condition  // Transform the condition
    };

  // DEBUG: Check the condition value specifically
  console.log('📝 Form condition value:', formData.condition);
  console.log('📤 Submit condition value:', submitData.condition);
  console.log('📋 Full submit data:', JSON.stringify(submitData, null, 2));

  try {
    await dispatch(createAuction(submitData)).unwrap();
    navigate('/dashboard/sell/auctions?created=true');
  } catch (error: any) {
    console.error('📋 Submission error:', error);
  }
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()]
      });
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

 // Debug logs - ADD THESE
console.log('Current formData.category_id:', formData.category_id);
console.log('Selected category:', selectedCategory);
console.log('Categories:', categories);

const handleInputChange = (field: keyof FormData, value: string | number) => {
  console.log('handleInputChange called:', field, value); // Debug log
  setFormData({ ...formData, [field]: value });
  if (errors[field]) {
    setErrors({ ...errors, [field]: '' });
  }
};


  const getDefaultEndTime = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Default to 7 days from now
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Auction</h1>
            <p className="text-gray-600 mt-1">List your item for auction</p>
          </div>
          {currentTier && (
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm text-gray-600">Your tier:</span>
                <TierBadge tier={profile?.tier || 'basic'} size="sm" />
              </div>
              <p className="text-xs text-gray-500">
                Max value: ${currentTier.maxValue} • Max active: {currentTier.maxActive}
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-red-800">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter auction title (5-255 characters)"
                maxLength={255}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your item (minimum 20 characters)"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

{/* Category & Subcategory Section */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Category */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Category *
    </label>
    <select
      value={formData.category_id || ''}
      onChange={(e) => {
        const selectedValue = e.target.value;
        const categoryId = selectedValue ? parseInt(selectedValue) : '';
        
        setFormData(prev => ({
          ...prev,
          category_id: categoryId,
          subcategory_id: '' // Reset subcategory when category changes
        }));
        
        // Clear validation error
        if (errors.category_id) {
          setErrors(prev => ({ ...prev, category_id: '' }));
        }
      }}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
        errors.category_id ? 'border-red-300' : 'border-gray-300'
      }`}
    >
      <option value="">Select a category</option>
      {categories && categories.length > 0 ? (
        categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))
      ) : (
        <option value="">Loading categories...</option>
      )}
    </select>
    {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
  </div>

  {/* Subcategory - Only show if category has subcategories */}
  {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Subcategory
      </label>
      <select
        value={formData.subcategory_id || ''}
        onChange={(e) => {
          const selectedValue = e.target.value;
          const subcategoryId = selectedValue ? parseInt(selectedValue) : '';
          
          setFormData(prev => ({
            ...prev,
            subcategory_id: subcategoryId
          }));
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      >
        <option value="">Select a subcategory</option>
        {selectedCategory.subcategories.map((subcategory) => (
          <option key={subcategory.id} value={subcategory.id}>
            {subcategory.name}
          </option>
        ))}
      </select>
    </div>
  )}
</div>


            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Condition *
  </label>
  <select
    value={formData.condition}
    onChange={(e) => handleInputChange('condition', e.target.value)}
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
      errors.condition ? 'border-red-300' : 'border-gray-300'
    }`}
  >
    <option value="">Select condition</option>
    <option value="new">New</option>
    <option value="like_new">Like New</option>
    <option value="good">Good</option>
    <option value="fair">Fair</option>
    <option value="poor">Poor</option>
  </select>
  {errors.condition && <p className="mt-1 text-sm text-red-600">{errors.condition}</p>}
</div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price * ${currentTier && `(Max: $${currentTier.maxValue})`}
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.starting_price}
                onChange={(e) => handleInputChange('starting_price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.starting_price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.starting_price && <p className="mt-1 text-sm text-red-600">{errors.starting_price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bid Increment
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.bid_increment}
                onChange={(e) => handleInputChange('bid_increment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="1.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buy Now Price
                {currentTier && !currentTier.features.includes('Buy Now option') && (
                  <span className="ml-1 text-xs text-orange-600">(Requires Verified+)</span>
                )}
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.buy_now_price}
                onChange={(e) => handleInputChange('buy_now_price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.buy_now_price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                disabled={!currentTier?.features?.includes('Buy Now option')}
              />
              {errors.buy_now_price && <p className="mt-1 text-sm text-red-600">{errors.buy_now_price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reserve Price
                {currentTier && !currentTier.features.includes('Reserve prices') && (
                  <span className="ml-1 text-xs text-orange-600">(Requires Trusted)</span>
                )}
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.reserve_price}
                onChange={(e) => handleInputChange('reserve_price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.reserve_price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                disabled={!currentTier?.features?.includes('Reserve prices')}
              />
              {errors.reserve_price && <p className="mt-1 text-sm text-red-600">{errors.reserve_price}</p>}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Images {currentTier && `(Max: ${currentTier.features.includes('Up to 6 photos') ? '6' : '3'} photos)`}
          </h3>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter image URL"
              />
              <button
                type="button"
                onClick={addImage}
                disabled={!imageInput.trim() || formData.images.includes(imageInput.trim())}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Invalid+Image';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timing */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Auction Timing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="mt-1 text-xs text-gray-500">Leave empty to start immediately</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                value={formData.end_time || getDefaultEndTime()}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.end_time ? 'border-red-300' : 'border-gray-300'
                }`}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.end_time && <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/sell')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              'Create Auction'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAuction;
