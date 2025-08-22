import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { type RootState, type AppDispatch } from '../../store';
import { fetchUserProfile } from '../../store/slices/profileSlice';

const DashboardOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get profile data from Redux store instead of local state
  const { user, statistics, recentActivity, isLoading, error } = useSelector((state: RootState) => state.profile);

  // Fetch profile data on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Keep your existing quickActions array unchanged
  const quickActions = [
    { name: 'Browse Auctions', icon: '🔍', link: '/auctions', color: 'from-blue-500 to-blue-600', description: 'Discover new items' },
    { name: 'View Watchlist', icon: '⭐', link: '/dashboard/watchlist', color: 'from-yellow-500 to-yellow-600', description: 'Check saved items' },
    { name: 'Check Messages', icon: '💬', link: '/dashboard/messages', color: 'from-green-500 to-green-600', description: 'View communications' },
    { name: 'Account Settings', icon: '⚙️', link: '/dashboard/settings', color: 'from-purple-500 to-purple-600', description: 'Manage preferences' },
  ];

  // Use statistics from Redux with fallback to your original values
  const stats = statistics ? {
    activeBids: statistics.totalBids || 0,
    watchlistItems: statistics.totalWatchlistItems || 0,
    wonAuctions: statistics.totalAuctionsWon || 0,
    totalSpent: statistics.totalAmountSpent || 0,
    profileCompletion: user?.profileCompletionScore || 85
  } : {
    activeBids: 5,
    watchlistItems: 12,
    wonAuctions: 3,
    totalSpent: 2450.50,
    profileCompletion: 85
  };

  // Use recentActivity from Redux with fallback to your original data
  const displayActivity = recentActivity && recentActivity.length > 0 ? recentActivity : [
    { id: 1, action: 'Placed bid on Vintage Watch', time: '2 hours ago', type: 'bid', amount: '$250' },
    { id: 2, action: 'Added Antique Vase to watchlist', time: '5 hours ago', type: 'watchlist' },
    { id: 3, action: 'Won auction for Digital Camera', time: '1 day ago', type: 'won', amount: '$180' },
    { id: 4, action: 'Updated profile information', time: '2 days ago', type: 'profile' },
    { id: 5, action: 'Placed bid on Art Collection', time: '3 days ago', type: 'bid', amount: '$450' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-600">Manage your auction activities and explore new opportunities</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            to={action.link}
            className={`group relative overflow-hidden rounded-xl p-6 bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl mb-2">{action.icon}</div>
                <h3 className="font-semibold text-lg">{action.name}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bids</p>
              <p className="text-3xl font-bold text-[#294c5b]">{stats.activeBids}</p>
              <p className="text-sm text-green-600">+2 this week</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Watchlist Items</p>
              <p className="text-3xl font-bold text-[#294c5b]">{stats.watchlistItems}</p>
              <p className="text-sm text-yellow-600">3 ending soon</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Won Auctions</p>
              <p className="text-3xl font-bold text-[#294c5b]">{stats.wonAuctions}</p>
              <p className="text-sm text-gray-500">All time</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🏆</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-3xl font-bold text-[#294c5b]">${stats.totalSpent.toLocaleString()}</p>
              <p className="text-sm text-gray-500">This year</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Complete your profile to improve your bidding success rate</h3>
            <div className="flex items-center">
              <div className="w-48 bg-gray-200 rounded-full h-2 mr-4">
                <div 
                  className="bg-[#294c5b] h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${stats.profileCompletion}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-[#294c5b]">{stats.profileCompletion}%</span>
            </div>
          </div>
          <Link
            to="/dashboard/profile"
            className="bg-[#294c5b] text-white px-6 py-3 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium"
          >
            Complete Profile
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
<div className="bg-white rounded-xl shadow-sm border border-gray-200">
  <div className="p-6 border-b border-gray-200">
    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
  </div>
  <div className="divide-y divide-gray-200">
    {displayActivity.map((activity, index) => (
      <div 
        key={activity.id || `activity-${index}-${activity.action}`} 
        className="p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm">
                {activity.type === 'bid' && '📊'}
                {activity.type === 'watchlist' && '⭐'}
                {activity.type === 'won' && '🏆'}
                {activity.type === 'profile' && '👤'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          </div>
          {activity.amount && (
            <span className="font-semibold text-[#294c5b]">{activity.amount}</span>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#294c5b] mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading dashboard data</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
