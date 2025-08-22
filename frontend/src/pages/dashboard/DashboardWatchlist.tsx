import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { type RootState, type AppDispatch } from '../../store';
import { fetchWatchlist, removeFromWatchlist } from '../../store/slices/profileSlice';

// MOVE ALL HELPER FUNCTIONS TO THE TOP
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Helper function to calculate time left - FIXED VERSION
const calculateTimeLeft = (endTime: string) => {
  if (!endTime) return 'N/A';
  
  const end = new Date(endTime).getTime();
  const now = new Date().getTime();
  const difference = end - now;
  if (difference <= 0) return 'Ended';
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const getAuctionStatus = (endTime: string, startTime?: string) => {
  const now = new Date();
  const end = new Date(endTime);
  const start = startTime ? new Date(startTime) : null;
  
  if (start && now < start) {
    return 'not-started';
  } else if (now > end) {
    return 'ended';
  } else {
    // Check if ending soon (less than 1 hour)
    const timeLeft = end.getTime() - now.getTime();
    const oneHour = 60 * 60 * 1000;
    
    if (timeLeft <= oneHour) {
      return 'ending-soon';
    }
    return 'active';
  }
};

// INTERFACES
interface WatchlistItem {
  id: number;
  auction_id: number;
  title: string;
  currentBid: number;
  timeLeft: string;
  image: string;
  category: string;
  status: 'active' | 'ending-soon' | 'ended';
  myMaxBid?: number;
  starting_price: number;
}

// COMPONENT
const DashboardWatchlist: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { watchlist: reduxWatchlist, isLoadingWatchlist, watchlistError } = useSelector((state: RootState) => state.profile);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'ending-soon' | 'price-low' | 'price-high' | 'recently-added'>('ending-soon');

  // Fetch watchlist on component mount
  useEffect(() => {
    dispatch(fetchWatchlist({ page: 1, limit: 50 }));
  }, [dispatch]);

  // FIXED: Transform backend watchlist data for UI - NO MORE FALLBACKS
  const watchlistItems: WatchlistItem[] = reduxWatchlist && reduxWatchlist.length > 0
    ? reduxWatchlist.map((item: any) => {
        console.log('🔍 Processing watchlist item:', item);
        
        // Calculate dynamic time left and status
        const endTime = item.auction?.endTime || item.auction?.end_time;
        const dynamicTimeLeft = calculateTimeLeft(endTime);
        const dynamicStatus = getAuctionStatus(endTime, item.auction?.startTime);
        
        return {
          id: item.id,
          auction_id: item.auctionId,
          title: item.auction?.title, // REAL PRODUCT TITLE from backend join
          currentBid: item.auction?.currentPrice || 0,
          timeLeft: dynamicTimeLeft, // CALCULATED dynamically
          image: item.auction?.images?.[0],
          category: item.auction?.category, // REAL CATEGORY from backend join
          status: dynamicStatus as 'active' | 'ending-soon' | 'ended',
          myMaxBid: item.my_max_bid,
          starting_price: item.auction?.startingPrice || 0
        };
      })
    : [];

  console.log('🔍 Processed watchlist items:', watchlistItems);

  // Remove item from watchlist with API call
  const handleRemoveFromWatchlist = async (auctionId: number) => {
    try {
      await dispatch(removeFromWatchlist(auctionId)).unwrap();
      console.log('✅ Item removed from watchlist');
      // Refresh watchlist after removal
      dispatch(fetchWatchlist({ page: 1, limit: 50 }));
    } catch (error) {
      console.error('❌ Failed to remove from watchlist:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ending-soon':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            ⚠️ Ending Soon
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            🟢 Active
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            🔴 Ended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Watchlist</h1>
        <p className="mt-1 text-sm text-gray-500">
          {watchlistItems.length} items you're following
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
        >
          <option value="ending-soon">Ending Soon</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="recently-added">Recently Added</option>
        </select>

        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white text-[#294c5b] shadow-sm' : 'text-gray-500'
            }`}
            title="Grid view"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white text-[#294c5b] shadow-sm' : 'text-gray-500'
            }`}
            title="List view"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Show error state */}
      {watchlistError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="text-red-800 text-sm">
            Error loading watchlist<br />{watchlistError}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoadingWatchlist ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading watchlist...</p>
        </div>
      ) : (
        /* Watchlist Items */
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {watchlistItems.length > 0 ? (
            watchlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative">
                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  {getStatusBadge(item.status)}
                </div>

                {/* Professional Remove Button */}
                <button
                  onClick={() => handleRemoveFromWatchlist(item.auction_id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-red-50 rounded-full shadow-sm border border-gray-200 hover:border-red-200 transition-all duration-200 group"
                  title="Remove from watchlist"
                  aria-label="Remove from watchlist"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Item Image */}
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                </div>

                {/* Item Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {item.category}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current bid</span>
                      <span className="font-semibold">{formatCurrency(item.currentBid)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time left</span>
                      <span className="font-medium">{item.timeLeft}</span>
                    </div>
                    
                    {item.myMaxBid && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your max bid</span>
                        <span className="font-medium text-blue-600">{formatCurrency(item.myMaxBid)}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/auctions/${item.auction_id}`}
                      className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      View Auction
                    </Link>
                    <Link
                      to={`/auctions/${item.auction_id}?action=bid`}
                      className="flex-1 bg-[#294c5b] text-white justify-center text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-[#1e3a48] transition-colors"
                    >
                      Place Bid
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="col-span-full text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Your watchlist is empty</h3>
                <p className="text-gray-500 max-w-xs">
                  Start exploring auctions and add items to your watchlist to keep track of them here.
                </p>
                <Link
                  to="/auctions"
                  className="mt-4 bg-[#294c5b] text-white px-6 py-3 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium"
                >
                  Browse Auctions
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardWatchlist;
