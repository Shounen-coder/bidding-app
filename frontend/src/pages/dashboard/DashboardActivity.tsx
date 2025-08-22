import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { fetchBids } from '../../store/slices/profileSlice';
import { Link } from 'react-router-dom';

interface BidActivity {
  id: number;
  auctionId: number;
  auctionTitle: string;
  auctionImage: string;
  bidAmount: number;
  maxBid: number;
  currentPrice: number;
  status: 'winning' | 'outbid' | 'won' | 'lost' | 'active';
  bidTime: string;
  auctionEndTime: string;
  category: string;
  auctionStatus: 'active' | 'ending_soon' | 'ended' | 'not_started';
}

interface ActivityStats {
  totalBids: number;
  auctionsWon: number;
  totalSpent: number;
  averageBid: number;
  winRate: number;
  activeBids: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatTimeLeft = (endTime: string) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();
  if (diff < 0) return 'Ended';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};


function deriveStatus(activity: BidActivity): typeof activity.status {
  const now = new Date();
  const endTime = new Date(activity.auctionEndTime);
  const hasEnded = now > endTime;
  
  if (hasEnded) {
    // If auction has ended, check if we won
    if (activity.status === 'winning' || activity.status === 'won') return 'won';
    return 'lost';
  }
  
  // If auction is still active, return current status
  return activity.status;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    winning: { bg: 'bg-green-100', text: 'text-green-800', label: 'Winning' },
    outbid: { bg: 'bg-red-100', text: 'text-red-800', label: 'Outbid' },
    won: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Won' },
    lost: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Lost' },
    active: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Active' }
  };
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['active'];
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Add these after your existing formatCurrency and formatTimeLeft functions

const getAuctionStatus = (endTime: string, startTime?: string) => {
const now = new Date();
const end = new Date(endTime);
const start = startTime ? new Date(startTime) : null;

if (start && now < start) {
  return 'not_started';
} else if (now > end) {
  return 'ended';
} else {
  // Check if ending soon (less than 1 hour)
  const timeLeft = end.getTime() - now.getTime();
  const oneHour = 60 * 60 * 1000;
  
  if (timeLeft <= oneHour) {
    return 'ending_soon';
  }
  return 'active';
}
};




const getAuctionStatusDisplay = (status: string) => {
const statusConfig = {
  active: { 
    label: 'Active', 
    color: 'bg-green-100 text-green-800', 
    icon: '🟢' 
  },
  ending_soon: { 
    label: 'Ending Soon', 
    color: 'bg-orange-100 text-orange-800', 
    icon: '⚠️' 
  },
  ended: { 
    label: 'Ended', 
    color: 'bg-gray-100 text-gray-800', 
    icon: '🔴' 
  },
  not_started: { 
    label: 'Not Started', 
    color: 'bg-blue-100 text-blue-800', 
    icon: '🔵' 
  }
};

return statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
};

const DashboardActivity: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { bids: reduxBids, isLoading, error } = useSelector((state: RootState) => state.profile);

  // Debug logs
  console.log('🔍 Redux bids:', reduxBids);
  console.log('🔍 Redux error:', error);
  console.log('🔍 Is loading:', isLoading);

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'won' | 'lost'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');

 useEffect(() => {
  dispatch(fetchBids({ page: 1, limit: 50 }))
    .unwrap()
    .then(data => {
      console.log('✅ Full API response:', data);
      console.log('✅ First bid item:', data.bids?.[0]);
    })
    .catch(err => {
      console.error('❌ Error fetching bids:', err);
    });
}, [dispatch]);


  // Transform backend bids data for UI - CORRECTED VERSION
  const activities: BidActivity[] = reduxBids && reduxBids.length > 0 
    ? reduxBids.map((item: any) => {
        // Get the real-time status from backend
        const currentStatus = item.bidStatus
        
        console.log('🔍 Processing bid item:', item); // Debug log

        // Calculate auction status
        const auctionStatus = getAuctionStatus(
          item.auctionEndTime || item.auction?.endTime,
          item.auction?.startTime // if you have start time
        );

        return {
          id: item.id,
          auctionId: item.auctionId,
          auctionTitle: item.auction?.title,
          auctionImage: item.auction?.images?.[0],
          bidAmount: item.amount || 0,
          maxBid: item.amount || 0,
          currentPrice: item.currentPrice || 0,
          status: currentStatus, // Use the status directly from backend
          bidTime: item.bidTime,
          auctionEndTime: item.auctionEndTime || item.auction?.endTime,
          category: item.auction?.category,
          auctionStatus: auctionStatus
        };
      })
    : [
        // fallback mock data
       
      ];

  // Enhanced status calculation - handles auction end time dynamically

  // Stats calculation with corrected logic
  const stats: ActivityStats = {
    totalBids: activities.length,
    auctionsWon: activities.filter(a => deriveStatus(a) === 'won').length,
    totalSpent: activities.filter(a => deriveStatus(a) === 'won').reduce((sum, a) => sum + a.bidAmount, 0),
    averageBid: activities.length > 0 ? activities.reduce((sum, a) => sum + a.bidAmount, 0) / activities.length : 0,
    winRate: activities.length > 0 ? (activities.filter(a => deriveStatus(a) === 'won').length / activities.length) * 100 : 0,
    activeBids: activities.filter(a => {
      const s = deriveStatus(a);
      return s === 'winning' || s === 'outbid';
    }).length
  };

  const tabs = [
    { id: 'all', name: 'All Bids', count: activities.length },
    { id: 'active', name: 'Active', count: activities.filter(a => {
      const s = deriveStatus(a);
      return s === 'winning' || s === 'outbid';
    }).length },
    { id: 'won', name: 'Won', count: activities.filter(a => deriveStatus(a) === 'won').length },
    { id: 'lost', name: 'Lost', count: activities.filter(a => deriveStatus(a) === 'lost').length },
  ];

  const filteredActivities = activities.filter(activity => {
    const s = deriveStatus(activity);
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return s === 'winning' || s === 'outbid';
    return s === activeTab;
  });


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Track your auction participation and bidding history</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor your bids, track your wins, and stay updated on auction activity.
        </p>
      </div>

      {/* Stats Overview - Your existing stats cards */}
      
      {/* Stats Overview - Your existing stats cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center">
      <div className="text-2xl font-bold text-gray-900">{stats.totalBids}</div>
      <div className="ml-2 text-sm text-gray-500">Total Bids</div>
    </div>
  </div>
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center">
      <div className="text-2xl font-bold text-gray-900">{stats.auctionsWon}</div>
      <div className="ml-2 text-sm text-gray-500">Won</div>
    </div>
  </div>
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center">
      <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</div>
      <div className="ml-2 text-sm text-gray-500">Total Spent</div>
    </div>
  </div>
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center">
      <div className="text-2xl font-bold text-gray-900">{stats.activeBids}</div>
      <div className="ml-2 text-sm text-gray-500">Active Bids</div>
    </div>
  </div>
</div>

{/* Tabs - Your existing tab navigation */}
<div className="border-b border-gray-200 mb-6">
  <nav className="-mb-px flex space-x-8">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id as any)}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${
          activeTab === tab.id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        {tab.name}
        {tab.count > 0 && (
          <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </nav>
</div>



      {/* Tabs - Your existing tab navigation */}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="text-red-800 text-sm">
            Error loading bidding activity<br />{error}
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
           <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Nothing found</h3>
                          <p className="text-gray-500 mb-6">
                            {activeTab === 'all'
                              ? "You haven't won any auctions yet. Start bidding to see your bids here!"
                              : `No ${activeTab} bids found.`
                            }
                          </p>
                          <Link
                            to="/auctions"
                            className="inline-flex items-center px-6 py-3 bg-[#294c5b] text-white font-medium rounded-lg hover:bg-[#1e3a48] transition-colors"
                          >
                            Browse Auctions
                          </Link>
                        </div>
        ) : (
          filteredActivities.map(activity => {
  const effectiveStatus = deriveStatus(activity);
  const hasEnded = new Date() > new Date(activity.auctionEndTime);
  const auctionStatusInfo = getAuctionStatusDisplay(activity.auctionStatus || 'active');

  return (
    <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={activity.auctionImage} 
            alt={activity.auctionTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.jpg';
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {activity.auctionTitle}
            </h3>
            <div className="flex gap-2">
              {/* Bid Status Badge */}
              {getStatusBadge(effectiveStatus)}
              
              {/* NEW: Auction Status Badge */}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${auctionStatusInfo.color}`}>
                <span className="mr-1">{auctionStatusInfo.icon}</span>
                {auctionStatusInfo.label}
              </span>
            </div>
          </div>
          
          {/* NEW: Auction Status Information */}
          {activity.auctionStatus === 'ending_soon' && !hasEnded && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3">
              <p className="text-xs text-orange-800 font-medium">
                ⏰ This auction is ending soon! Only {formatTimeLeft(activity.auctionEndTime)} left
              </p>
            </div>
          )}
          
          {activity.auctionStatus === 'ended' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 mb-3">
              <p className="text-xs text-gray-600">
                🔴 This auction has ended
              </p>
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-3">
            Your bid: <span className="font-semibold">{formatCurrency(activity.bidAmount)}</span>
          </p>
          
          <p className="text-xs text-gray-500 mb-3">
            Bid placed: {new Date(activity.bidTime).toLocaleDateString()} at {new Date(activity.bidTime).toLocaleTimeString()}
          </p>
          
          {/* Existing status messages for bid status */}
          {!hasEnded && effectiveStatus === 'winning' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-green-800 font-medium">
                🎉 You're currently winning this auction! Ends in{' '}
                <span className="font-bold">{formatTimeLeft(activity.auctionEndTime)}</span>
              </p>
            </div>
          )}
          
          {!hasEnded && effectiveStatus === 'outbid' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-red-800">
                ❌ You've been outbid!
                {activity.currentPrice && ` Current price is ${formatCurrency(activity.currentPrice)}`}
              </p>
            </div>
          )}
          
          {hasEnded && effectiveStatus === 'won' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-blue-800 font-medium">
                🏆 Congratulations! <span className="font-bold">You won this auction!</span>
              </p>
            </div>
          )}
          
          {hasEnded && effectiveStatus !== 'won' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-600">
                This auction has ended. <span className="font-medium">You did not win this auction.</span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Link
          to={`/auctions/${activity.auctionId}`}
          className="text-sm text-black hover:text-teal-600 font-medium"
        >
          View Auction Details →
        </Link>
      </div>
    </div>
  );
})
        )}
      </div>
    </div>
  );
};

export default DashboardActivity;
