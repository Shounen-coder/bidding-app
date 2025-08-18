import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { type Category, type Subcategory } from '../../types';
import { type Auction, type AuctionFilters } from '../../types/auction';
import { sampleCategories } from '../../data/sampleAuctions';
import { type RootState, type AppDispatch } from '../../store';
import { fetchAuctions, setFilters, clearError } from '../../store/slices/auctionSlice';
import AuctionCard from '../../components/auction/AuctionCard';
import LoadingButton from '../../components/ui/LoadingButton';

const AuctionListing: React.FC = () => {
  // Redux state
  const dispatch = useDispatch<AppDispatch>();
  const { auctions, isLoading, error, pagination, filters: reduxFilters } = useSelector((state: RootState) => state.auctions);
  
  // URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local component state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  const [filters, setLocalFilters] = useState<AuctionFilters>({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    status: (searchParams.get('status') as any) || 'active',
    search: searchParams.get('search') || '',
    sortBy: (searchParams.get('sortBy') as any) || 'ending_soon', // CHANGED: sort_by → sortBy
    page: 1,
    limit: 12,
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined, // CHANGED: price_min → minPrice
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined  // CHANGED: price_max → maxPrice
  });

  // Update available subcategories when category changes
  useEffect(() => {
    if (filters.category) {
      const category = sampleCategories.find(cat => cat.slug === filters.category);
      setSelectedCategory(category || null);
      setAvailableSubcategories(category?.subcategories || []);
      
      // Reset subcategory when category changes
      if (filters.subcategory && category && !(category.subcategories || []).find(sub => sub.slug === filters.subcategory)) {
        setLocalFilters(prev => ({
          ...prev,
          subcategory: ''
        }));
      }
    } else {
      setSelectedCategory(null);
      setAvailableSubcategories([]);
    }
  }, [filters.category]);

  // Load auctions from backend when filters change
  useEffect(() => {
    const backendFilters = {
      category: filters.category || undefined,
      subcategory: filters.subcategory || undefined,
      status: filters.status || 'active',
      search: filters.search || undefined,
      sortBy: filters.sortBy || 'ending_soon', // CHANGED: sort_by → sortBy
      minPrice: filters.minPrice, // CHANGED: price_min → minPrice
      maxPrice: filters.maxPrice, // CHANGED: price_max → maxPrice
      limit: filters.limit || 12,
      offset: ((filters.page || 1) - 1) * (filters.limit || 12)
    };

    dispatch(setFilters(backendFilters));
    dispatch(fetchAuctions(backendFilters));
  }, [dispatch, filters]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.subcategory) params.set('subcategory', filters.subcategory);
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy); // CHANGED: sort_by → sortBy
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString()); // CHANGED: price_min → minPrice
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString()); // CHANGED: price_max → maxPrice

    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Handle filter changes
  const handleFilterChange = (key: keyof AuctionFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset pagination when filters change
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setLocalFilters({
      category: '',
      subcategory: '',
      status: 'active',
      search: '',
      sortBy: 'ending_soon', // CHANGED: sort_by → sortBy
      page: 1,
      limit: 12
    });
  };

  // Load more auctions (pagination)
  const handleLoadMore = () => {
    setLocalFilters(prev => ({
      ...prev,
      page: (prev.page || 1) + 1
    }));
  };

  // Count active filters
  const activeFiltersCount = [
    filters.category,
    filters.subcategory,
    filters.search,
    filters.minPrice, // CHANGED: price_min → minPrice
    filters.maxPrice  // CHANGED: price_max → maxPrice
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Auctions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse thousands of unique items across all categories on BIDDEX
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="text-sm text-gray-500">
                    ({activeFiltersCount} active)
                  </span>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {sampleCategories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter */}
              {availableSubcategories.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={filters.subcategory || ''}
                    onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All {selectedCategory?.name}</option>
                    {availableSubcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.slug}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status || 'active'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active Auctions</option>
                  <option value="scheduled">Upcoming</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''} // CHANGED: price_min → minPrice
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)} // CHANGED: price_min → minPrice
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''} // CHANGED: price_max → maxPrice
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)} // CHANGED: price_max → maxPrice
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.category && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedCategory?.name}
                        <button
                          onClick={() => handleFilterChange('category', '')}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.subcategory && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {availableSubcategories.find(sub => sub.slug === filters.subcategory)?.name}
                        <button
                          onClick={() => handleFilterChange('subcategory', '')}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.search && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Search: "{filters.search}"
                        <button
                          onClick={() => handleFilterChange('search', '')}
                          className="ml-1 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.minPrice && ( // CHANGED: price_min → minPrice
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Min: ${filters.minPrice}
                        <button
                          onClick={() => handleFilterChange('minPrice', undefined)} // CHANGED: price_min → minPrice
                          className="ml-1 text-yellow-600 hover:text-yellow-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.maxPrice && ( // CHANGED: price_max → maxPrice
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Max: ${filters.maxPrice}
                        <button
                          onClick={() => handleFilterChange('maxPrice', undefined)} // CHANGED: price_max → maxPrice
                          className="ml-1 text-yellow-600 hover:text-yellow-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              <button
                onClick={clearAllFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-600">
                  Showing {auctions.length} of {pagination.total} auctions
                  {filters.category && ` in ${selectedCategory?.name}`}
                  {filters.subcategory && ` > ${availableSubcategories.find(sub => sub.slug === filters.subcategory)?.name}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={filters.sortBy || 'ending_soon'} // CHANGED: sort_by → sortBy
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)} // CHANGED: sort_by → sortBy
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ending_soon">Ending Soon</option>
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="most_bids">Most Bids</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && auctions.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Auction Grid */}
            {(!isLoading || auctions.length > 0) && (
              auctions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {auctions.map((auction, index) => (
                    <AuctionCard
                      key={auction.id}
                      auction={auction}
                      variant={index < 2 ? 'featured' : 'default'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No auctions found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              )
            )}

            {/* Load More Button */}
            {!isLoading && auctions.length > 0 && pagination.hasMore && (
              <div className="text-center mt-8">
                <LoadingButton
                  onClick={handleLoadMore}
                  loading={isLoading}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                >
                  {isLoading ? 'Loading More...' : 'Load More Auctions'}
                </LoadingButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionListing;
