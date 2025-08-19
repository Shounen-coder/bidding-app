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
  currentUserId?: number; // for highlighting user's bids
  auctionStatus: string; // NEW! To handle auction status
//   userId?: number; // Optional prop to pass current user ID
}

const LiveBidHistory: React.FC<LiveBidHistoryProps> = ({ 
  auctionId, 
  initialBids,
  currentUserId,
  auctionStatus
}) => {
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString());
  const [isPolling, setIsPolling] = useState(auctionStatus === 'active'); // ✅ use auctionStatus directly

  const [newBidNotification, setNewBidNotification] = useState<string | null>(null);

  useEffect(() => {
    setIsPolling(auctionStatus === 'active'); // ✅ no props
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
        console.log('Polling for new bids...'); // Add this to see if polling works
        console.log(auctionId)
        const response = await fetch(`/api/auctions/${auctionId}/bids?since=${lastUpdate}`);

        // Check if response is ok
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return;
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', await response.text());
      return;
    }
        const data = await response.json();

         console.log('Poll response:', data); // Debug log
        
        if (data.success && data.data.bids.length > 0) {
  // Prepend new bids to existing list
  setBids(prevBids => [...data.data.bids, ...prevBids]);
  setLastUpdate(data.data.timestamp);
  
  // ✅ ADD THIS - Show notification for new bid
  const latestBid = data.data.bids[0];
  setNewBidNotification(`New bid: ${formatPrice(latestBid.amount)} by ${latestBid.bidder.firstName}`);
  
  // Clear notification after 3 seconds
  setTimeout(() => setNewBidNotification(null), 3000);
}

      } catch (error) {
        console.error('Error polling bids:', error);
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(pollBids, 3000);
    return () => clearInterval(interval);
  }, [auctionId, lastUpdate, isPolling]);

  // Stop polling when component unmounts or auction ends
  useEffect(() => {
    return () => setIsPolling(false);
  }, []);

  const isUserBid = (bid: Bid) => {
    
    return userId && bid.bidder.username === user?.username;

  };

  return (
    <div>
        {newBidNotification && (
      <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
        {newBidNotification}
      </div>
    )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Bid History</h2>
        <div className="flex items-center text-sm text-gray-500">
          <div className={`w-2 h-2 rounded-full mr-2 ${isPolling ? 'bg-green-500' : 'bg-gray-400'}`} />
          {isPolling ? 'Live Updates' : 'Updates Paused'}
        </div>
      </div>

      {bids && bids.length > 0 ? (
        <div className="max-h-80 overflow-y-auto space-y-3">
          {bids.map((bid, index) => (
            <div
              key={bid.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                isUserBid(bid)
                  ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                  : 'bg-gray-50 border-gray-200'
              } ${
                index === 0 ? 'ring-2 ring-green-200 bg-green-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className={`font-semibold ${isUserBid(bid) ? 'text-blue-700' : 'text-gray-900'}`}>
                    {bid.bidder.firstName} {bid.bidder.lastName}
                    {isUserBid(bid) && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">YOU</span>}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">({bid.bidder.username})</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {formatPrice(bid.amount)}
                  </div>
                  {index === 0 && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                      WINNING BID
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span>{new Date(bid.bidTime).toLocaleString()}</span>
                <div className="flex items-center space-x-2">
                  {bid.isAutoBid && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                      Auto-bid
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    bid.status === 'winning' ? 'bg-green-100 text-green-600' :
                    bid.status === 'outbid' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {bid.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No bids placed yet</div>
          <div className="text-sm">Be the first to bid on this auction!</div>
        </div>
      )}
    </div>
  );
};

export default LiveBidHistory;


// Add this test data at the top of your LiveBidHistory component (temporarily)
// const testBids = [
//   {
//     id: 1,
//     amount: 250,
//     bidTime: new Date().toISOString(),
//     status: 'winning',
//     isAutoBid: false,
//     bidder: { username: 'Testuser', firstName: 'You', lastName: 'User' }
//   },
//   {
//     id: 2,
//     amount: 240,
//     bidTime: new Date(Date.now() - 60000).toISOString(),
//     status: 'outbid',
//     isAutoBid: true,
//     bidder: { username: 'user2', firstName: 'Alice', lastName: 'Smith' }
//   },
//   {
//     id: 3,
//     amount: 230,
//     bidTime: new Date(Date.now() - 120000).toISOString(),
//     status: 'active',
//     isAutoBid: false,
//     bidder: { username: 'user3', firstName: 'Bob', lastName: 'Johnson' }
//   },
//   {
//     id: 4,
//     amount: 220,
//     bidTime: new Date(Date.now() - 180000).toISOString(),
//     status: 'cancelled',
//     isAutoBid: false,
//     bidder: { username: 'user4', firstName: 'Carol', lastName: 'Davis' }
//   }
// ];