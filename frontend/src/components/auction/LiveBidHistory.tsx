import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

interface Bid {
  id: number;
  amount: number;
  bidTime: string;
  status: string;
  isAutoBid?: boolean;
  bidder: {
    username: string;
    firstName: string;
    lastName: string;
  };
}

interface LiveBidHistoryProps {
  auctionId: number;
  initialBids: Bid[];
  currentUserId?: number; 
  auctionStatus: string;
  currentPrice?: number; // ✅ ADD this prop
}

const LiveBidHistory: React.FC<LiveBidHistoryProps> = ({
  auctionId,
  initialBids,
  currentUserId,
  auctionStatus,
  currentPrice // ✅ ADD this
}) => {
  const [bids, setBids] = useState(initialBids);
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString());
  const [isPolling, setIsPolling] = useState(auctionStatus === 'active');
  const [newBidNotification, setNewBidNotification] = useState<string | null>(null);

  useEffect(() => {
    setIsPolling(auctionStatus === 'active');
  }, [auctionStatus]);

  // Get current user from auth state (if available)
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = currentUserId || user?.id;

  const formatPrice = (price: number) =>
    price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  // Poll for new bids
  useEffect(() => {
    if (!isPolling) return;

    const pollBids = async () => {
      try {
        console.log('Polling for new bids...');
        console.log(auctionId);
        const response = await fetch(`/api/auctions/${auctionId}/bids?since=${lastUpdate}`);

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          return;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Response is not JSON:', await response.text());
          return;
        }

        const data = await response.json();
        console.log('Poll response:', data);

        if (data.success && data.data.bids.length > 0) {
          setBids(prevBids => [...data.data.bids, ...prevBids]);
          setLastUpdate(data.data.timestamp);

          const latestBid = data.data.bids[0];
          setNewBidNotification(`New bid: ${formatPrice(latestBid.amount)} by ${latestBid.bidder.firstName}`);
          setTimeout(() => setNewBidNotification(null), 3000);
        }
      } catch (error) {
        console.error('Error polling bids:', error);
      }
    };

    const interval = setInterval(pollBids, 3000);
    return () => clearInterval(interval);
  }, [auctionId, lastUpdate, isPolling]);

  useEffect(() => {
    return () => setIsPolling(false);
  }, []);

  const isUserBid = (bid: Bid) => {
    return userId && bid.bidder.username === user?.username;
  };

  // ✅ FIX: Function to determine correct bid status
  const getBidStatus = (bid: Bid) => {
    // Calculate highest bid amount
    const highestBidAmount = currentPrice || Math.max(...bids.map(b => b.amount));
    
    const isWinningBid = bid.amount === highestBidAmount;
    const isCurrentUserBid = isUserBid(bid);

    if (isWinningBid) {
      return 'Winning';
    } else if (isCurrentUserBid) {
      return 'Outbid';
    }
    return '';
  };

  return (
    <div className="space-y-4">
      {newBidNotification && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          {newBidNotification}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Bid History</h3>
        <span className={`text-sm px-3 py-1 rounded-full ${isPolling ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
          {isPolling ? 'Live Updates' : 'Updates Paused'}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {bids && bids.length > 0 ? (
          bids.map((bid, index) => {
            // ✅ FIXED: Get correct status using our function
            const displayStatus = getBidStatus(bid);
            const isCurrentUserBid = isUserBid(bid);

            return (
              <div
                key={bid.id}
                className={`bg-white p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md ${
                  isCurrentUserBid ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {bid.bidder.firstName} {bid.bidder.lastName}
                      </span>
                      {isCurrentUserBid && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                          YOU
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        ({bid.bidder.username})
                      </span>
                    </div>

                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {formatPrice(bid.amount)}
                    </div>

                    {/* ✅ FIXED: Only show winning bid badge for actual highest bidder */}
                    {displayStatus === 'Winning' && (
                      <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-full mb-2">
                        🏆 WINNING BID
                      </span>
                    )}

                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(bid.bidTime).toLocaleString()}
                    </div>

                    {bid.isAutoBid && (
                      <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        Auto-bid
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* ✅ FIXED: Show correct status tag */}
                    {displayStatus && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        displayStatus === 'Winning' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {displayStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg font-medium">No bids placed yet</p>
            <p className="text-sm">Be the first to bid on this auction!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveBidHistory;
