import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { type Category } from '../../types'; //will use later
import { sampleCategories, sampleAuctions } from '../../data/sampleAuctions';

const CategoryIndex: React.FC = () => {
  const [sortBy, setSortBy] = useState<'alphabetical' | 'most_auctions' | 'popular'>('popular');

  // Calculate auction counts per category
  const categoriesWithCounts = sampleCategories.map(category => ({
    ...category,
    auction_count: sampleAuctions.filter(auction => 
      auction.product?.category?.slug === category.slug
    ).length,
    active_auction_count: sampleAuctions.filter(auction => 
      auction.product?.category?.slug === category.slug && auction.status === 'active'
    ).length
  }));

  // Sort categories based on selected option
  const sortedCategories = [...categoriesWithCounts].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'most_auctions':
        return b.auction_count - a.auction_count;
      case 'popular':
      default:
        return b.active_auction_count - a.active_auction_count;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">All Categories</span>
          </nav>

          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Browse All Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover auctions across all categories on BIDDEX. Find exactly what you're looking for.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <p className="text-gray-600">
              {sampleCategories.length} categories • {sampleAuctions.length} total auctions
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popular">Most Active</option>
              <option value="most_auctions">Most Auctions</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-6 border-2 border-transparent hover:border-blue-200 h-full">
                {/* Category Icon and Info */}
                <div className="text-center mb-4">
                  <div 
                    className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${category.color_code}20` }}
                  >
                    <span className="text-4xl">{category.icon_name}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.description}
                  </p>
                </div>

                {/* Statistics */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Active Auctions:</span>
                    <span className="font-semibold text-green-600">
                      {category.active_auction_count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Total Auctions:</span>
                    <span className="font-semibold text-gray-900">
                      {category.auction_count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Subcategories:</span>
                    <span className="font-semibold text-blue-600">
                      {category.subcategories?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Action Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center text-blue-600 text-sm font-medium">
                    <span>Browse Category</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/auctions"
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-medium transition-colors"
            >
              🔍 Browse All Auctions
            </Link>
            <Link
              to="/auctions?status=ending_soon"
              className="bg-orange-600 hover:bg-orange-700 text-white py-4 px-6 rounded-lg font-medium transition-colors"
            >
              ⏰ Ending Soon
            </Link>
            <Link
              to="/auctions?sort_by=newest"
              className="bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-medium transition-colors"
            >
              ✨ Latest Auctions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryIndex;
