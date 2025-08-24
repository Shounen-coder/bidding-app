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
    <div className="space-y-6">
      {newBidNotification && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-teal-400 text-teal-800 p-4 rounded-xl shadow-lg animate-pulse">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-teal-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 10.793a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{newBidNotification}</span>
          </div>
        </div>
      )}


      <div className="flex items-center justify-between mb-6">
        {/* <h3 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
          <svg className="w-6 h-6 text-teal-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Bid History
        </h3> */}
        <span className={`text-sm px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-200 ${
          isPolling 
            ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200' 
            : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-200'
        }`}>
          {isPolling ? (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              Live Updates
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
              Updates Paused
            </div>
          )}
        </span>
      </div>


      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {bids && bids.length > 0 ? (
          bids.map((bid, index) => {
            // ✅ FIXED: Get correct status using our function
            const displayStatus = getBidStatus(bid);
            const isCurrentUserBid = isUserBid(bid);


            return (
              <div
                key={bid.id}
                className={`bg-white rounded-xl shadow-lg border-l-4 transition-all duration-300 hover:shadow-xl hover:scale-102 ${
                  isCurrentUserBid 
                    ? 'border-teal-400 bg-gradient-to-r from-teal-50 to-cyan-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          isCurrentUserBid 
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500' 
                            : 'bg-gradient-to-r from-slate-500 to-slate-600'
                        }`}>
                          {bid.bidder.firstName.charAt(0)}{bid.bidder.lastName.charAt(0)}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">
                              {bid.bidder.firstName} {bid.bidder.lastName}
                            </span>
                            {isCurrentUserBid && (
                              <span className="text-xs bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-1 rounded-full font-bold shadow-md">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-slate-500 font-medium">
                            @{bid.bidder.username}
                          </span>
                        </div>
                      </div>


                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
                        {formatPrice(bid.amount)}
                      </div>


                      {/* ✅ FIXED: Only show winning bid badge for actual highest bidder */}
                      {displayStatus === 'Winning' && (
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-full mb-3 shadow-lg">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3v-8a1 1 0 011-1h4a1 1 0 011 1v8h3a1 1 0 001-1V7l-7-5zM9 17v-6h2v6H9z" clipRule="evenodd" />
                          </svg>
                          🏆 WINNING BID
                        </div>
                      )}


                      <div className="flex items-center text-sm text-slate-500 mb-3">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(bid.bidTime).toLocaleString()}
                      </div>


                      {bid.isAutoBid && (
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 text-xs font-semibold rounded-full border border-orange-200 shadow-md">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          Auto-bid
                        </span>
                      )}
                    </div>


                    <div className="flex flex-col items-end gap-2">
                      {/* ✅ FIXED: Show correct status tag */}
                      {displayStatus && (
                        <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                          displayStatus === 'Winning' 
                            ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-gradient-to-r from-red-100 to-red-100 text-red-800 border border-red-200'
                        }`}>
                          {displayStatus}
                        </span>
                      )}
                      
                      {index === 0 && (
                        <span className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-3 py-1 rounded-full font-semibold border border-blue-200">
                          Latest
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-300">
            <div className="mb-6">
              <svg className="w-20 h-20 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-xl font-bold text-slate-600 mb-2">No bids placed yet</p>
            <p className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg inline-block shadow-sm border border-slate-200">
              Be the first to bid on this auction!
            </p>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #0d9488, #06b6d4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0f766e, #0891b2);
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};


export default LiveBidHistory;
