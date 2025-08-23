// src/components/seller/SellerSidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState} from '../../store';
import TierBadge from './TierBadge';

interface SellerSidebarProps {
  onBackToBuyer: () => void;
}

const SellerSidebar: React.FC<SellerSidebarProps> = ({ onBackToBuyer }) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile: sellerProfile } = useSelector((state: RootState) => state.seller || { 
    profile: { tier: 'basic', stats: { totalAuctions: 0, completedAuctions: 0, completionRate: 0, averageRating: 0 } } 
  });

  const menuItems = [
    {
      name: 'Overview',
      href: '/dashboard/sell',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: 'Create Auction',
      href: '/dashboard/sell/create',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      name: 'My Auctions',
      href: '/dashboard/sell/auctions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      href: '/dashboard/sell/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      badge: sellerProfile?.tier === 'basic' ? 'Pro' : null
    },
    {
      name: 'Orders',
      href: '/dashboard/sell/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      name: 'Seller Academy',
      href: '/dashboard/sell/academy',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1f3c4a] via-[#2c5364] to-[#0f2027]">
      {/* Back Button */}
      <div className="p-4 border-b border-gray-600">
        <button
          onClick={onBackToBuyer}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 group"
        >
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Buyer Dashboard
        </button>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-gray-600">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
            {user?.firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-gray-300 text-sm">Seller</p>
              <TierBadge tier={sellerProfile?.tier || 'basic'} size="xs" />
            </div>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
            <span>Progress to {sellerProfile?.tier === 'basic' ? 'Verified' : 'Trusted'}</span>
            <span>{sellerProfile?.stats?.completedAuctions || 0}/{sellerProfile?.tier === 'basic' ? '5' : '20'}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, ((sellerProfile?.stats?.completedAuctions || 0) / (sellerProfile?.tier === 'basic' ? 5 : 20)) * 100)}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
              ${isActiveLink(item.href)
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center">
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </div>
            {item.badge && (
              <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-600">
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            BidHub
          </div>
          <p className="text-gray-400 text-xs mt-1">Seller Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default SellerSidebar;
