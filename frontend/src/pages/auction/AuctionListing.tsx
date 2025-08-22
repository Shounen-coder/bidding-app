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
import { useNotifications } from '../../hooks/useNotifications';
import NotificationToast from '../../components/auction/NotificationToast';

const AuctionListing: React.FC = () => {
  // Redux state
  const dispatch = useDispatch<AppDispatch>();
  const { auctions, isLoading, error, pagination, filters: reduxFilters } = useSelector((state: RootState) => state.auctions);
  
  // URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  
  // ADD: Notifications hook for watchlist feedback
  const { notifications, removeNotification } = useNotifications();
  
  // Local component state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  const [filters, setLocalFilters] = useState<AuctionFilters>({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    status: (searchParams.get('status') as any) || 'active',
    search: searchParams.get('search') || '',
    sortBy: (searchParams.get('sortBy') as any) || 'ending_soon',
    page: 1,
    limit: 12,
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
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
      sortBy: filters.sortBy || 'ending_soon',
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
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
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());

    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Handle filter changes
  const handleFilterChange = (key: keyof AuctionFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setLocalFilters({
      category: '',
      subcategory: '',
      status: 'active',
      search: '',
      sortBy: 'ending_soon',
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
    filters.minPrice,
    filters.maxPrice
  ].filter(Boolean).length;

  // Function to check if auction has ended
  const isAuctionEnded = (endTime: string) => {
    return new Date(endTime) <= new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
      {/* Header - WIDENED CONTAINER */}
      <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
        <div className="max-w-[1700px] mx-auto px-12 sm:px-16 lg:px-20 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Auctions</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse thousands of unique items across all categories on BIDDEX
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER - SIGNIFICANTLY WIDENED */}
      <div className="max-w-[1700px] mx-auto px-12 sm:px-16 lg:px-20 py-12">
        <div className="flex flex-col xl:flex-row gap-12">
          
          {/* Enhanced Sidebar Filters - WIDENED SIDEBAR */}
          <div className="xl:w-[420px] min-w-[420px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 sticky top-4">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>

              {/* Search */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-base"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-base"
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
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Subcategory
                  </label>
                  <select
                    value={filters.subcategory || ''}
                    onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-base"
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
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Status
                </label>
                <select
                  value={filters.status || 'active'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-base"
                >
                  <option value="active">Active Auctions</option>
                  <option value="scheduled">Upcoming</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-base"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-base"
                  />
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Active Filters:</h4>
                  <div className="flex flex-wrap gap-3">
                    {filters.category && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300">
                        {selectedCategory?.name}
                        <button
                          onClick={() => handleFilterChange('category', '')}
                          className="ml-2 text-blue-600 hover:text-blue-800 transition-colors text-lg"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.subcategory && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300">
                        {availableSubcategories.find(sub => sub.slug === filters.subcategory)?.name}
                        <button
                          onClick={() => handleFilterChange('subcategory', '')}
                          className="ml-2 text-green-600 hover:text-green-800 transition-colors text-lg"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.search && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300">
                        Search: "{filters.search}"
                        <button
                          onClick={() => handleFilterChange('search', '')}
                          className="ml-2 text-purple-600 hover:text-purple-800 transition-colors text-lg"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.minPrice && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300">
                        Min: ${filters.minPrice}
                        <button
                          onClick={() => handleFilterChange('minPrice', undefined)}
                          className="ml-2 text-yellow-600 hover:text-yellow-800 transition-colors text-lg"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.maxPrice && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300">
                        Max: ${filters.maxPrice}
                        <button
                          onClick={() => handleFilterChange('maxPrice', undefined)}
                          className="ml-2 text-yellow-600 hover:text-yellow-800 transition-colors text-lg"
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
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer text-base"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content - EXPANDED WIDTH */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="mb-4 sm:mb-0">
                <p className="text-lg font-medium text-gray-700">
                  Showing <span className="font-bold text-teal-600">{auctions.length}</span> of <span className="font-bold">{pagination.total}</span> auctions
                  {filters.category && ` in ${selectedCategory?.name}`}
                  {filters.subcategory && ` > ${availableSubcategories.find(sub => sub.slug === filters.subcategory)?.name}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <label className="text-sm font-semibold text-gray-700">Sort by:</label>
                <select
                  value={filters.sortBy || 'ending_soon'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-base"
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
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 mb-8">
                <div className="flex">
                  <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && auctions.length === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                {[...Array(9)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse border border-gray-200">
                    <div className="h-56 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                      <div className="h-6 bg-gray-300 rounded w-full mb-3"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Auction Grid - PROPER 3-COLUMN LAYOUT FOR BETTER SPACING */}
            {(!isLoading || auctions.length > 0) && (
              auctions.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                  {auctions.map((auction, index) => (
                    <AuctionCard
                      key={auction.id}
                      auction={auction}
                      variant={index < 2 ? 'featured' : 'default'}
                      className="w-full"
                      isEnded={isAuctionEnded(auction.endTime)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-xl border border-gray-200">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-8">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No auctions found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We couldn't find any auctions matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              )
            )}

            {/* Load More Button */}
            {!isLoading && auctions.length > 0 && pagination.hasMore && (
              <div className="text-center mt-12">
                <LoadingButton
                  onClick={handleLoadMore}
                  loading={isLoading}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 px-10 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Loading More...' : 'Load More Auctions'}
                </LoadingButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Toasts */}
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={removeNotification}
          position="top-right"
        />
      ))}
    </div>
  );
};

export default AuctionListing;
