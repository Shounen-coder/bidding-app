import React, { useState, useEffect } from 'react';
import { type AuctionFilters, type Auction, type Category, type Subcategory } from '../../types';
import { sampleAuctions, sampleCategories } from '../../data/sampleAuctions';
import AuctionCard from '../../components/auction/AuctionCard';

const AuctionListing: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  const [filters, setFilters] = useState<AuctionFilters>({
    category: '',
    subcategory: '',
    status: 'active',
    search: '',
    sort_by: 'ending_soon',
    page: 1,
    limit: 12
  });

  // Load auctions (simulate API call)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAuctions(sampleAuctions);
      setLoading(false);
    }, 1000);
  }, []);

  // Update available subcategories when category changes
  useEffect(() => {
    if (filters.category) {
      const category = sampleCategories.find(cat => cat.slug === filters.category);
      setSelectedCategory(category || null);
      setAvailableSubcategories(category?.subcategories || []);
      
      // Reset subcategory when category changes
      if (filters.subcategory) {
        setFilters(prev => ({
          ...prev,
          subcategory: ''
        }));
      }
    } else {
      setSelectedCategory(null);
      setAvailableSubcategories([]);
    }
  }, [filters.category]);

  // Filter and sort auctions
  useEffect(() => {
    let filtered = [...auctions];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(auction => 
        auction.product?.category?.slug === filters.category
      );
    }

    // Filter by subcategory
    if (filters.subcategory) {
      filtered = filtered.filter(auction => 
        auction.product?.subcategory?.slug === filters.subcategory
      );
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(auction => auction.status === filters.status);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(auction =>
        auction.product?.title.toLowerCase().includes(searchTerm) ||
        auction.product?.description.toLowerCase().includes(searchTerm) ||
        auction.product?.category?.name.toLowerCase().includes(searchTerm) ||
        auction.product?.subcategory?.name.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by price range
    if (filters.price_min !== undefined) {
      filtered = filtered.filter(auction => 
        (auction.current_price || auction.product?.starting_price || 0) >= filters.price_min!
      );
    }

    if (filters.price_max !== undefined) {
      filtered = filtered.filter(auction => 
        (auction.current_price || auction.product?.starting_price || 0) <= filters.price_max!
      );
    }

    // Sort auctions
    filtered.sort((a, b) => {
      switch (filters.sort_by) {
        case 'ending_soon':
          return new Date(a.end_time).getTime() - new Date(b.end_time).getTime();
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'price_low':
          const priceA = a.current_price || a.product?.starting_price || 0;
          const priceB = b.current_price || b.product?.starting_price || 0;
          return priceA - priceB;
        case 'price_high':
          const priceA2 = a.current_price || a.product?.starting_price || 0;
          const priceB2 = b.current_price || b.product?.starting_price || 0;
          return priceB2 - priceA2;
        case 'most_bids':
          return b.total_bids - a.total_bids;
        default:
          return 0;
      }
    });

    setFilteredAuctions(filtered);
  }, [auctions, filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof AuctionFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

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
                    value={filters.price_min || ''}
                    onChange={(e) => handleFilterChange('price_min', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.price_max || ''}
                    onChange={(e) => handleFilterChange('price_max', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Active Filters Display */}
              {(filters.category || filters.subcategory || filters.search) && (
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
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({
                  category: '',
                  subcategory: '',
                  status: 'active',
                  search: '',
                  sort_by: 'ending_soon',
                  page: 1,
                  limit: 12
                })}
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
                  Showing {filteredAuctions.length} auctions
                  {filters.category && ` in ${selectedCategory?.name}`}
                  {filters.subcategory && ` > ${availableSubcategories.find(sub => sub.slug === filters.subcategory)?.name}`}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={filters.sort_by || 'ending_soon'}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
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

            {/* Loading State */}
            {loading && (
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
            {!loading && (
              <>
                {filteredAuctions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAuctions.map((auction, index) => (
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
                      onClick={() => setFilters({
                        category: '',
                        subcategory: '',
                        status: 'active',
                        search: '',
                        sort_by: 'ending_soon',
                        page: 1,
                        limit: 12
                      })}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Load More Button */}
            {!loading && filteredAuctions.length > 0 && (
              <div className="text-center mt-8">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors duration-200">
                  Load More Auctions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionListing;
