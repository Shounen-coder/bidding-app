import React from 'react';

interface BidStatusIndicatorsProps {
  currentPrice: number;
  startingPrice: number;
  nextMinBid: number;
  reservePrice?: number | null;
  reserveMet: boolean;
  totalBids: number;
  timeRemaining?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null;
  status: 'active' | 'ended' | 'scheduled' | string;
}

const BidStatusIndicators: React.FC<BidStatusIndicatorsProps> = ({
  currentPrice,
  startingPrice,
  nextMinBid,
  reservePrice,
  reserveMet,
  totalBids,
  timeRemaining,
  status
}) => {
  const formatPrice = (price: number) =>
    price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  // ✅ FIXED: More robust auction end detection
  const isAuctionEnded = 
    status === 'ended' || 
    status === 'complete' || 
    status === 'finished' ||
    !timeRemaining || 
    (timeRemaining && 
     timeRemaining.days <= 0 && 
     timeRemaining.hours <= 0 && 
     timeRemaining.minutes <= 0 && 
     timeRemaining.seconds <= 0);

  // 🐛 DEBUG: Add console logs to see what's happening
  console.log('🔍 BidStatusIndicators Debug:', {
    status,
    timeRemaining,
    isAuctionEnded,
    totalBids,
    currentPrice
  });

  const getStatusConfig = () => {
    // ✅ FIXED: Force ended state check first
    if (isAuctionEnded) {
      return {
        text: 'AUCTION ENDED',
        bgGradient: 'bg-gradient-to-r from-slate-500 to-slate-600',
        textColor: 'text-white',
        pulseColor: ''
      };
    }

    switch (status) {
      case 'active':
        if (timeRemaining && timeRemaining.days === 0 && timeRemaining.hours < 1) {
          return {
            text: 'ENDING SOON',
            bgGradient: 'bg-gradient-to-r from-red-500 to-orange-500',
            textColor: 'text-white',
            pulseColor: 'animate-pulse'
          };
        }
        return {
          text: 'LIVE AUCTION',
          bgGradient: 'bg-gradient-to-r from-emerald-500 to-green-500',
          textColor: 'text-white',
          pulseColor: ''
        };
      case 'scheduled':
        return {
          text: 'UPCOMING',
          bgGradient: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          textColor: 'text-white',
          pulseColor: ''
        };
      default:
        return {
          text: status.toUpperCase(),
          bgGradient: 'bg-gradient-to-r from-slate-500 to-slate-600',
          textColor: 'text-white',
          pulseColor: ''
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-800">
            {isAuctionEnded ? 'Final Results' : 'Bidding Status'}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Badge Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 font-medium">Status</span>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.bgGradient} ${statusConfig.textColor} ${statusConfig.pulseColor}`}>
            {statusConfig.text}
          </span>
        </div>

        {/* ✅ CRITICAL FIX: Force ended state content */}
        {isAuctionEnded ? (
          /* === ENDED AUCTION CONTENT === */
          <div className="space-y-4">
            {totalBids > 0 ? (
              /* WINNING BID SECTION */
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-emerald-700 font-medium">🏆 Winning Bid</span>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs">{totalBids} bid{totalBids !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-emerald-800">
                  {formatPrice(currentPrice)}
                </div>
                {reservePrice && (
                  <div className="mt-2 text-sm">
                    {reserveMet ? (
                      <span className="text-emerald-600">✅ Reserve price met</span>
                    ) : (
                      <span className="text-red-600">❌ Reserve price not met ({formatPrice(reservePrice)})</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* NO BIDS SECTION */
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-600 font-medium">📋 Final Status</span>
                  <div className="flex items-center gap-1 text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <span className="text-xs">No bids received</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-600">
                  Item Unsold
                </div>
                <div className="text-sm text-slate-500 mt-2">
                  Starting price was: {formatPrice(startingPrice)}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* === ACTIVE AUCTION CONTENT === */
          <div className="space-y-4">
            {/* Current Price Row */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-blue-700 font-medium">Current Bid</span>
                <div className="flex items-center gap-1 text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-xs">{totalBids} bid{totalBids !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-800">
                {formatPrice(currentPrice)}
              </div>
            </div>

            {/* Next Minimum Bid Row */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-amber-700 font-medium">Minimum Bid</span>
                <div className="flex items-center gap-1 text-amber-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-xs">+{formatPrice(nextMinBid - currentPrice)} min</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-800">
                {formatPrice(nextMinBid)}
              </div>
            </div>
          </div>
        )}

        {/* Reserve Price Section (shows in both states) */}
        {reservePrice && (
          <div className={`p-4 rounded-lg border ${reserveMet ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${reserveMet ? 'text-green-700' : 'text-red-700'}`}>Reserve Price</span>
              <span className={`text-xs ${reserveMet ? 'text-green-600' : 'text-red-600'}`}>
                {reserveMet ? '✅ RESERVE MET' : (isAuctionEnded ? '❌ NOT MET' : `${formatPrice(reservePrice - currentPrice)} TO GO`)}
              </span>
            </div>
            <div className={`text-xl font-bold ${reserveMet ? 'text-green-800' : 'text-red-800'}`}>
              {formatPrice(reservePrice)}
            </div>
          </div>
        )}

        {/* Auction Statistics (always show) */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-3">
          <div className="text-center p-2 bg-white rounded-lg">
            <div className="text-lg font-bold text-slate-800">{totalBids}</div>
            <div className="text-xs text-slate-600">Bids</div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg">
            <div className="text-sm font-bold text-slate-800 truncate">
              {formatPrice(Math.max(0, currentPrice - startingPrice))}
            </div>
            <div className="text-xs text-slate-600">Increase</div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg">
            <div className="text-lg font-bold text-slate-800">
              {totalBids === 0 ? 0 : Math.round((currentPrice / startingPrice) * 100)}%
            </div>
            <div className="text-xs text-slate-600">Growth</div>
          </div>
        </div>

        {/* Live Activity Indicator (only when active) */}
        {!isAuctionEnded && status === 'active' && (
          <div className="flex items-center justify-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">Live Bidding Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidStatusIndicators;
