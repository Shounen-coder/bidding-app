// src/components/seller/SellerSidebar.tsx

import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { fetchAnalytics } from '../../store/slices/sellerSlice'; // ✅ Import fetchAnalytics
import TierBadge from './TierBadge';

interface SellerSidebarProps {
  onBackToBuyer: () => void;
}

const SellerSidebar: React.FC<SellerSidebarProps> = ({ onBackToBuyer }) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // ✅ FIXED: Use analytics data which has the correct structure
  const { analytics, profile: sellerProfile } = useSelector((state: RootState) => state.seller || {
    analytics: null,
    profile: { 
      tier: 'basic', 
      stats: { 
        totalAuctions: 0, 
        completedAuctions: 0, 
        completionRate: 0, 
        averageRating: 0 
      } 
    }
  });

  // ✅ FETCH: Analytics on component mount to ensure data is available
  useEffect(() => {
    dispatch(fetchAnalytics(30));
  }, [dispatch]);

  // ✅ FIXED: Use analytics data as primary source, fallback to profile
  const currentTier = analytics?.tier || sellerProfile?.tier || 'basic';
  const completedAuctions = analytics?.totalSales || sellerProfile?.stats?.completedAuctions || 0;

  // ✅ DEBUG: Keep logging to verify the fix
  console.log('🔍 SellerSidebar Debug:');
  console.log('Analytics data:', analytics);
  console.log('Profile data:', sellerProfile);
  console.log('Resolved tier:', currentTier);
  console.log('Resolved completed auctions:', completedAuctions);

  // ✅ FIXED: Determine next tier and requirements
  const getProgressInfo = () => {
    if (currentTier === 'basic') {
      return {
        nextTier: 'Verified',
        required: 5,
        current: completedAuctions
      };
    } else if (currentTier === 'verified') {
      return {
        nextTier: 'Trusted',
        required: 20,
        current: completedAuctions
      };
    } else {
      return {
        nextTier: 'Max Tier Reached',
        required: 20,
        current: completedAuctions
      };
    }
  };

  const progressInfo = getProgressInfo();

  const menuItems = [
    {
      name: 'Overview',
      href: '/dashboard/sell',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: 'Create Auction',
      href: '/dashboard/sell/create',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      name: 'My Auctions',
      href: '/dashboard/sell/auctions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      href: '/dashboard/sell/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      badge: currentTier === 'basic' ? 'Pro' : null
    },
    {
      name: 'Orders',
      href: '/dashboard/sell/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      name: 'Seller Academy',
      href: '/dashboard/sell/academy',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  const isActiveLink = (href: string) => {
    if (href === '/dashboard/sell') {
      return location.pathname === '/dashboard/sell';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex flex-col">
      {/* Back Button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onBackToBuyer}
          className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Buyer Dashboard
        </button>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-white font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-gray-400 text-sm">Seller</p>
          </div>
        </div>
        <div className="mt-3">
          <TierBadge tier={currentTier as 'basic' | 'verified' | 'trusted'} />
        </div>
      </div>

      {/* ✅ FIXED: Tier Progress with correct data source */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="text-xs text-gray-400 mb-1">
          Progress to {progressInfo.nextTier}
        </div>
        <div className="text-sm font-semibold text-gray-300">
          {progressInfo.current}/{progressInfo.required}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min((progressInfo.current / progressInfo.required) * 100, 100)}%`
            }}
          ></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActiveLink(item.href)
                ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-gray-400 text-sm">BidHub</p>
          <p className="text-gray-500 text-xs">Seller Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default SellerSidebar;
