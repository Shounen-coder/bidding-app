import React, { useState, useEffect, useRef } from 'react';
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


  // Add these new states for animations
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const listingRef = useRef<HTMLDivElement>(null);

   // Add intersection observer for staggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-20px' }
    );

    const auctionCards = listingRef.current?.querySelectorAll('.auction-card-item');
    auctionCards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [auctions]);

  // Add header visibility effect
  useEffect(() => {
    setIsHeaderVisible(true);
  }, []);

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
      {/* Enhanced Header with animations */}
      <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] text-white relative overflow-hidden ">
        {/* Add floating particles for visual enhancement */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            >
              <div className={`w-2 h-2 rounded-full ${
                i % 3 === 0 ? 'bg-teal-400' : 
                i % 3 === 1 ? 'bg-cyan-400' : 'bg-white'
              }`} />
            </div>
          ))}
        </div>
        
        <div className="mt-4 max-w-[1700px] mx-auto px-12 sm:px-16 lg:px-20 py-16 relative z-10">
          <div className={`text-center transform transition-all duration-1000 ${
            isHeaderVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Discover Amazing <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-text">Auctions</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-delay">
              Browse thousands of unique items across all categories on BIDDEX
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Main Container */}
      <div className="max-w-[1700px] mx-auto px-12 sm:px-16 lg:px-20 py-12">
        <div className="flex flex-col xl:flex-row gap-12">
          
          {/* Enhanced Sidebar Filters with better animations */}
          <div className="xl:w-[420px] min-w-[420px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 sticky top-4 transform transition-all duration-500 hover:shadow-2xl animate-slide-in-left">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg animate-pulse-gentle">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>

              {/* Enhanced Search with icon animation */}
              <div className="mb-8 group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-base hover:border-teal-300 focus:shadow-lg transform focus:scale-[1.02]"
                />
              </div>

              {/* Enhanced Category Filter with animations */}
              <div className="mb-8 group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-base hover:border-teal-300 focus:shadow-lg transform focus:scale-[1.02]"
                >
                  <option value="">All Categories</option>
                  {sampleCategories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enhanced Subcategory Filter */}
              {availableSubcategories.length > 0 && (
                <div className="mb-8 group animate-slide-down">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-teal-600 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Subcategory
                  </label>
                  <select
                    value={filters.subcategory || ''}
                    onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-base hover:border-teal-300 focus:shadow-lg transform focus:scale-[1.02]"
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

              {/* Enhanced Status Filter */}
              <div className="mb-8 group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status
                </label>
                <select
                  value={filters.status || 'active'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-base hover:border-teal-300 focus:shadow-lg transform focus:scale-[1.02]"
                >
                  <option value="active">Active Auctions</option>
                  <option value="scheduled">Upcoming</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              {/* Enhanced Price Range */}
              <div className="mb-8 group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-base hover:border-teal-300 focus:shadow-lg transform focus:scale-[1.02]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-base hover:border-teal-300 focus:shadow-lg transform focus:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Enhanced Active Filters Display with better animations */}
              {activeFiltersCount > 0 && (
                <div className="mb-8 animate-fade-in">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 00-1-1H4a1 1 0 00-1 1v2M7 4h10M7 4v16M17 4v16M5 8h2m0 0h2M5 8v8h2M15 8h2m0 0h2M15 8v8h2" />
                    </svg>
                    Active Filters:
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {filters.category && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 animate-scale-in hover:scale-110 transition-transform duration-200">
                        {selectedCategory?.name}
                        <button
                          onClick={() => handleFilterChange('category', '')}
                          className="ml-2 text-blue-600 hover:text-blue-800 transition-colors text-lg hover:rotate-90 transform duration-200"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.subcategory && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 animate-scale-in hover:scale-110 transition-transform duration-200">
                        {availableSubcategories.find(sub => sub.slug === filters.subcategory)?.name}
                        <button
                          onClick={() => handleFilterChange('subcategory', '')}
                          className="ml-2 text-green-600 hover:text-green-800 transition-colors text-lg hover:rotate-90 transform duration-200"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.search && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300 animate-scale-in hover:scale-110 transition-transform duration-200">
                        Search: "{filters.search}"
                        <button
                          onClick={() => handleFilterChange('search', '')}
                          className="ml-2 text-purple-600 hover:text-purple-800 transition-colors text-lg hover:rotate-90 transform duration-200"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.minPrice && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300 animate-scale-in hover:scale-110 transition-transform duration-200">
                        Min: ${filters.minPrice}
                        <button
                          onClick={() => handleFilterChange('minPrice', undefined)}
                          className="ml-2 text-yellow-600 hover:text-yellow-800 transition-colors text-lg hover:rotate-90 transform duration-200"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.maxPrice && (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300 animate-scale-in hover:scale-110 transition-transform duration-200">
                        Max: ${filters.maxPrice}
                        <button
                          onClick={() => handleFilterChange('maxPrice', undefined)}
                          className="ml-2 text-yellow-600 hover:text-yellow-800 transition-colors text-lg hover:rotate-90 transform duration-200"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Clear Filters Button */}
              <button
                onClick={clearAllFilters}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer text-base flex items-center justify-center space-x-2 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="flex-1">
            {/* Enhanced Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 bg-white rounded-2xl p-8 shadow-xl border border-gray-200 transform transition-all duration-300 hover:shadow-2xl animate-slide-in-right">
              <div className="mb-4 sm:mb-0">
                <p className="text-lg font-medium text-gray-700 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2V7a2 2 0 00-2-2H11m0 14l4-4m0 0l4-4m-4 4v10" />
                  </svg>
                  Showing <span className="font-bold text-teal-600 animate-pulse-gentle">{auctions.length}</span> of <span className="font-bold">{pagination.total}</span> auctions
                  {filters.category && ` in ${selectedCategory?.name}`}
                  {filters.subcategory && ` > ${availableSubcategories.find(sub => sub.slug === filters.subcategory)?.name}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Sort by:
                </label>
                <select
                  value={filters.sortBy || 'ending_soon'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-base hover:border-teal-300 focus:shadow-lg transform focus:scale-[1.02]"
                >
                  <option value="ending_soon">Ending Soon</option>
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="most_bids">Most Bids</option>
                </select>
              </div>
            </div>

            {/* Enhanced Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 mb-8 animate-shake">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-500 mr-3 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Enhanced Loading State */}
            {isLoading && auctions.length === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                {[...Array(9)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse border border-gray-200 transform transition-all duration-500 hover:scale-105">
                    <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 animate-shimmer"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3 animate-pulse"></div>
                      <div className="h-6 bg-gray-300 rounded w-full mb-3 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Auction Grid with staggered animations */}
            {(!isLoading || auctions.length > 0) && (
              auctions.length > 0 ? (
                <div ref={listingRef} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                  {auctions.map((auction, index) => (
                    <div
                      key={auction.id}
                      data-index={index}
                      className={`auction-card-item transform transition-all duration-700 ${
                        visibleItems.has(index) 
                          ? 'animate-fade-in-up opacity-100 hover:-translate-y-3' 
                          : 'opacity-0 translate-y-8'
                      }`}
                      style={{ 
                        animationDelay: `${(index % 9) * 100}ms`,
                        transitionDelay: `${(index % 9) * 50}ms`
                      }}
                    >
                      <AuctionCard
                        auction={auction}
                        variant={index < 2 ? 'featured' : 'default'}
                        className="w-full h-full hover:shadow-2xl transition-shadow duration-500"
                        isEnded={isAuctionEnded(auction.endTime)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-xl border border-gray-200 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-8 animate-bounce-gentle">
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
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer flex items-center mx-auto space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Clear All Filters</span>
                  </button>
                </div>
              )
            )}

            {/* Enhanced Page Navigation with better animations */}
            {auctions.length > 0 && (
              <div className="flex flex-col lg:flex-row items-center justify-between mt-12 mb-8 gap-6 bg-white rounded-2xl p-8 shadow-xl border border-gray-200 animate-slide-up transform transition-all duration-300 hover:shadow-2xl">
                {/* Enhanced Previous Button */}
                <button
                  onClick={() => {
                    const newOffset = Math.max(0, pagination.offset - pagination.limit);
                    const newFilters = { ...filters, offset: newOffset, limit: pagination.limit };
                    dispatch(setFilters(newFilters));
                    dispatch(fetchAuctions(newFilters));
                  }}
                  disabled={pagination.offset === 0 || isLoading}
                  className={`flex items-center px-6 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-300 ${
                    pagination.offset === 0 || isLoading
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-teal-200 hover:from-teal-100 hover:to-cyan-100 hover:border-teal-300 transform hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {/* Enhanced Page Info & Numbers */}
                <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
                  {/* Page Info */}
                  <div className="text-sm text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-lg">
                    Showing {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
                  </div>
                  
                  {/* Enhanced Page Numbers */}
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
                      const totalPages = Math.ceil(pagination.total / pagination.limit);
                      const pages = [];
                      
                      const startPage = Math.max(1, currentPage - 2);
                      const endPage = Math.min(totalPages, startPage + 4);
                      
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => {
                              const newOffset = (i - 1) * pagination.limit;
                              const newFilters = { ...filters, offset: newOffset, limit: pagination.limit };
                              dispatch(setFilters(newFilters));
                              dispatch(fetchAuctions(newFilters));
                            }}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-300 transform hover:scale-110 ${
                              i === currentPage
                                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-teal-600 shadow-lg animate-pulse-gentle'
                                : 'bg-white text-teal-700 border-teal-200 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:border-teal-300 hover:shadow-md'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }
                      
                      return pages;
                    })()}
                  </div>
                </div>

                {/* Enhanced Next Button */}
                <button
                  onClick={() => {
                    const newOffset = pagination.offset + pagination.limit;
                    const newFilters = { ...filters, offset: newOffset, limit: pagination.limit };
                    dispatch(setFilters(newFilters));
                    dispatch(fetchAuctions(newFilters));
                  }}
                  disabled={!pagination.hasMore || isLoading}
                  className={`flex items-center px-6 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-300 group ${
                    !pagination.hasMore || isLoading
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-teal-200 hover:from-teal-100 hover:to-cyan-100 hover:border-teal-300 transform hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  Next
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Toasts - Enhanced */}
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={removeNotification}
          position="top-right"
        />
      ))}

      {/* Enhanced CSS Animations */}
      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 3s ease infinite;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease forwards;
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease forwards;
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-down {
          animation: slide-down 0.5s ease forwards;
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease forwards;
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease forwards;
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease forwards;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s infinite;
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s infinite;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AuctionListing;
