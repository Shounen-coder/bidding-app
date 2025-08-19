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
      {/* Header - UPDATED: Wider container */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-8"> {/* WIDER CONTAINER */}
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

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-8"> {/* WIDER CONTAINER */}
        <div className="flex flex-col xl:flex-row gap-10"> {/* CHANGED: lg to xl, increased gap */}
          
          {/* Enhanced Sidebar Filters - UPDATED: Wider and modern styling */}
          <div className="xl:w-1/4 min-w-[340px]"> {/* WIDER SIDEBAR */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 sticky top-4"> {/* ENHANCED STYLING */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3> {/* LARGER HEADING */}
                {activeFiltersCount > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#2B5263] text-white">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>

              {/* Search - UPDATED: Modern styling */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5263] focus:border-[#2B5263] transition-all duration-200"
                />
              </div>

              {/* Category Filter - UPDATED: Modern styling */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5263] focus:border-[#2B5263] transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {sampleCategories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter - UPDATED: Modern styling */}
              {availableSubcategories.length > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Subcategory
                  </label>
                  <select
                    value={filters.subcategory || ''}
                    onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5263] focus:border-[#2B5263] transition-all duration-200"
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

              {/* Status Filter - UPDATED: Modern styling */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Status
                </label>
                <select
                  value={filters.status || 'active'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5263] focus:border-[#2B5263] transition-all duration-200"
                >
                  <option value="active">Active Auctions</option>
                  <option value="scheduled">Upcoming</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              {/* Price Range - UPDATED: Modern styling and better spacing */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5263] focus:border-[#2B5263] transition-all duration-200"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5263] focus:border-[#2B5263] transition-all duration-200"
                  />
                </div>
              </div>

              {/* Active Filters Display - UPDATED: Modern badges */}
              {activeFiltersCount > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        {selectedCategory?.name}
                        <button
                          onClick={() => handleFilterChange('category', '')}
                          className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.subcategory && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        {availableSubcategories.find(sub => sub.slug === filters.subcategory)?.name}
                        <button
                          onClick={() => handleFilterChange('subcategory', '')}
                          className="ml-2 text-green-600 hover:text-green-800 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.search && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                        Search: "{filters.search}"
                        <button
                          onClick={() => handleFilterChange('search', '')}
                          className="ml-2 text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.minPrice && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Min: ${filters.minPrice}
                        <button
                          onClick={() => handleFilterChange('minPrice', undefined)}
                          className="ml-2 text-yellow-600 hover:text-yellow-800 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.maxPrice && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Max: ${filters.maxPrice}
                        <button
                          onClick={() => handleFilterChange('maxPrice', undefined)}
                          className="ml-2 text-yellow-600 hover:text-yellow-800 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Clear Filters - UPDATED: Use brand color */}
              <button
                onClick={clearAllFilters}
                className="w-full bg-[#2B5263] hover:bg-[#1e3c47] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content - UPDATED: Wider */}
          <div className="xl:w-3/4">
            {/* Sort and Results Count - UPDATED: Modern card with better spacing */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="mb-4 sm:mb-0">
                <p className="text-lg font-medium text-gray-700"> {/* ENHANCED TYPOGRAPHY */}
                  Showing <span className="font-bold text-[#2B5263]">{auctions.length}</span> of <span className="font-bold">{pagination.total}</span> auctions
                  {filters.category && ` in ${selectedCategory?.name}`}
                  {filters.subcategory && ` > ${availableSubcategories.find(sub => sub.slug === filters.subcategory)?.name}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="text-sm font-semibold text-gray-700">Sort by:</label>
                <select
                  value={filters.sortBy || 'ending_soon'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5263] focus:border-[#2B5263] transition-all duration-200"
                >
                  <option value="ending_soon">Ending Soon</option>
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="most_bids">Most Bids</option>
                </select>
              </div>
            </div>

            {/* Error Message - UPDATED: Modern styling */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
                <div className="flex">
                  <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State - UPDATED: Better grid spacing */}
            {isLoading && auctions.length === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8"> {/* IMPROVED GRID */}
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse border border-gray-100">
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

            {/* Auction Grid - UPDATED: Better spacing and responsive grid */}
            {(!isLoading || auctions.length > 0) && (
              auctions.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8"> {/* IMPROVED GRID WITH BETTER SPACING */}
                  {auctions.map((auction, index) => (
                    <AuctionCard
                      key={auction.id}
                      auction={auction}
                      variant={index < 2 ? 'featured' : 'default'}
                      className="w-full"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100"> {/* ENHANCED EMPTY STATE */}
                  <svg className="w-32 h-32 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No auctions found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We couldn't find any auctions matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-[#2B5263] hover:bg-[#1e3c47] text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              )
            )}

            {/* Load More Button - UPDATED: Brand color and modern styling */}
            {!isLoading && auctions.length > 0 && pagination.hasMore && (
              <div className="text-center mt-12">
                <LoadingButton
                  onClick={handleLoadMore}
                  loading={isLoading}
                  className="bg-[#2B5263] hover:bg-[#1e3c47] text-white py-4 px-8 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Loading More...' : 'Load More Auctions'}
                </LoadingButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD: Notification Toasts */}
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
