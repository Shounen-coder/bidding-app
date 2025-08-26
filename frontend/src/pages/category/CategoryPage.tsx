import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { fetchAuctionsByCategory } from '../../store/slices/auctionSlice';
import AuctionCard from '../../components/auction/AuctionCard';
import { sampleCategories } from '../../data/sampleAuctions';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

const CategoryPage: React.FC = () => {
  const { categorySlug, subcategorySlug } = useParams<{
    categorySlug: string;
    subcategorySlug?: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get real auctions from Redux store
  const { auctions, isLoading: auctionsLoading } = useSelector((state: RootState) => state.auctions || { auctions: [], isLoading: false });

  // Load category data
  useEffect(() => {
    const foundCategory = sampleCategories.find(cat => cat.slug === categorySlug);
    setCategory(foundCategory || null);
    
    if (foundCategory && subcategorySlug) {
      const foundSubcategory = foundCategory.subcategories?.find(sub => sub.slug === subcategorySlug);
      setSelectedSubcategory(foundSubcategory || null);
    } else {
      setSelectedSubcategory(null);
    }
    
    setLoading(false);
  }, [categorySlug, subcategorySlug]);

  // ✅ Fetch real auctions when category changes
  useEffect(() => {
    if (category) {
      dispatch(fetchAuctionsByCategory({
        categorySlug: category.slug,
        subcategorySlug: selectedSubcategory?.slug,
        status: 'active'
      }));
    }
  }, [category, selectedSubcategory, dispatch]);

  // ✅ Filter auctions based on category/subcategory
  const filteredAuctions = auctions.filter(auction => {
    if (!category) return false;
    
    if (selectedSubcategory) {
      return auction.subcategory?.slug === selectedSubcategory.slug;
    } else {
      return auction.category?.slug === category.slug;
    }
  });

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    navigate(`/category/${categorySlug}/${subcategory.slug}`);
  };

  const handleViewAllCategory = () => {
    navigate(`/category/${categorySlug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <Link to="/" className="text-teal-600 hover:text-teal-700">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/categories" className="hover:text-gray-700">All Categories</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{category.name}</span>
          {selectedSubcategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{selectedSubcategory.name}</span>
            </>
          )}
        </nav>

        {/* Category Header */}
        <div className="flex items-center mb-4">
          <span className="text-4xl mr-4">{category.icon_name}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedSubcategory ? selectedSubcategory.name : category.name}
            </h1>
            <p className="text-gray-600 mt-2">
              {selectedSubcategory ? selectedSubcategory.description : category.description}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {filteredAuctions.length} auction{filteredAuctions.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">{category.name} Categories</h3>
            
            {/* View All Option */}
            <button
              onClick={handleViewAllCategory}
              className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition-colors ${
                !selectedSubcategory
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">View All {category.name}</div>
              <div className="text-xs text-gray-500">
                {auctions.filter(a => a.category?.slug === category.slug).length} auctions
              </div>
            </button>

            {/* Subcategories */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Subcategories
                </h4>
                {category.subcategories.map((subcategory) => {
                  const subcategoryAuctionCount = auctions.filter(
                    a => a.subcategory?.slug === subcategory.slug
                  ).length;

                  return (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${
                        selectedSubcategory?.slug === subcategory.slug
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{subcategory.name}</div>
                      <div className="text-xs text-gray-500">
                        {subcategoryAuctionCount} auction{subcategoryAuctionCount !== 1 ? 's' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link
                to="/auctions"
                className="block w-full text-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
              >
                Browse All Auctions
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Category Switch Tabs (for mobile) */}
          <div className="block sm:hidden mb-6">
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={categorySlug}
              onChange={(e) => navigate(`/category/${e.target.value}`)}
            >
              {sampleCategories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.icon_name} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Results */}
          {auctionsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : filteredAuctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAuctions.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  variant="default"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">{category.icon_name}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No auctions found</h3>
              <p className="text-gray-600 mb-6">
                There are currently no active auctions in{' '}
                {selectedSubcategory ? selectedSubcategory.name : category.name}.
              </p>
              <Link
                to="/auctions"
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                Browse All Auctions
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
