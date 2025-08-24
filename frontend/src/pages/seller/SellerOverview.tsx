// src/pages/seller/SellerOverview.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { type RootState, type AppDispatch } from '../../store';
import { fetchSellerProfile, fetchSellerAuctions, fetchAnalytics } from '../../store/slices/sellerSlice';
import TierBadge from '../../components/seller/TierBadge';

const SellerOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    profile,
    currentTier,
    nextTier,
    progress,
    auctions,
    analytics,
    isLoading,
    error
  } = useSelector((state: RootState) => state.seller);

  useEffect(() => {
    dispatch(fetchSellerProfile());
    dispatch(fetchSellerAuctions({ limit: 5, status: 'active' }));
    dispatch(fetchAnalytics(7)); // Last 7 days
  }, [dispatch]);

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'from-gray-400 to-gray-600';
      case 'verified': return 'from-teal-400 to-teal-600';
      case 'trusted': return 'from-teal-400 to-cyan-400';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome to your Seller Dashboard</h1>
            <p className="text-gray-300 mt-1">Manage your auctions and track your performance</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-gray-300">Current Tier:</span>
              <TierBadge tier={profile?.tier || 'basic'} size="md" />
            </div>
            {nextTier && (
              <p className="text-sm text-gray-400">
                {progress?.completedAuctions && `${profile?.stats.completedAuctions}/${nextTier.requirements?.completedAuctions} auctions to ${nextTier.name}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Auctions</p>
              <p className="text-2xl font-bold text-gray-900">{profile?.stats.totalAuctions || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{profile?.stats.completedAuctions || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile?.stats.averageRating ? profile.stats.averageRating.toFixed(1) : '0.0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">
                ${profile?.stats.totalSales ? profile.stats.totalSales.toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Progress Card */}
      {nextTier && progress && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Progress to {nextTier.name}
            </h3>
            <TierBadge tier={nextTier.name.toLowerCase() as 'basic' | 'verified' | 'trusted'} size="sm" />
          </div>
          
          <div className="space-y-4">
            {progress.completedAuctions && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Completed Auctions</span>
                  <span>{progress.completedAuctions.current}/{progress.completedAuctions.required}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.completedAuctions.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {progress.averageRating && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Average Rating</span>
                  <span>{progress.averageRating.current.toFixed(1)}/{progress.averageRating.required}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.averageRating.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {progress.monthsActive && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Months Active</span>
                  <span>{progress.monthsActive.current}/{progress.monthsActive.required}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.monthsActive.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Unlock with {nextTier.name}:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {nextTier.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-4 h-4 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/dashboard/sell/create"
          className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-teal-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Auction</h3>
              <p className="text-gray-600 text-sm">List a new item for auction</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/sell/auctions"
          className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-teal-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">My Auctions</h3>
              <p className="text-gray-600 text-sm">Manage your listings</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/sell/analytics"
          className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-teal-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-gray-600 text-sm">Track your performance</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Active Auctions */}
      {auctions && auctions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Active Auctions</h3>
            <Link 
              to="/dashboard/sell/auctions"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {auctions.slice(0, 5).map((auction) => (
              <div key={auction.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{auction.product.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Current: ${auction.currentPrice || auction.startingPrice} • 
                      Bids: {auction.totalBids} • 
                      Views: {auction.viewCount}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      auction.status === 'active' ? 'bg-green-100 text-green-800' :
                      auction.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {auction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started Guide for New Sellers */}
      {(!auctions || auctions.length === 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to start selling?</h3>
            <p className="text-gray-600 mb-6">
              Create your first auction and start earning. As a {currentTier?.name}, you can list items up to ${currentTier?.maxValue} and have up to {currentTier?.maxActive} active auctions.
            </p>
            <Link
              to="/dashboard/sell/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Auction
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOverview;
