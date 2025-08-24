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
  status: 'active' | 'ended' | 'scheduled'| string; // Added 'scheduled' status
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


  const getStatusConfig = () => {
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
      case 'ended':
        return {
          text: 'AUCTION ENDED',
          bgGradient: 'bg-gradient-to-r from-slate-500 to-slate-600',
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
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-bold bg-black bg-clip-text text-transparent flex items-center"> {/* CHANGED: text-xl to text-lg */}
          <svg className="w-5 h-5 text-teal-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* CHANGED: w-6 h-6 to w-5 h-5 */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Bidding Status
        </h3>
      </div>


      <div className="p-6 space-y-5">
        {/* Status Badge Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Status</span> {/* CHANGED: text-sm to text-xs */}
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.bgGradient} ${statusConfig.textColor} ${statusConfig.pulseColor} shadow-lg`}> {/* CHANGED: px-4 py-2 to px-3 py-1.5, text-sm to text-xs */}
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 opacity-75 animate-pulse"></div>
              {statusConfig.text}
            </div>
          </div>
        </div>


        {/* Current Price Row */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-l-4 border-emerald-500 shadow-md">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Current Bid</span> {/* CHANGED: text-sm to text-xs */}
            <div className="flex items-center mt-1">
              <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20"> {/* CHANGED: w-5 h-5 to w-4 h-4 */}
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-emerald-600 font-semibold">{totalBids} bid{totalBids !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-800"> {/* CHANGED: text-3xl to text-2xl */}
            {formatPrice(currentPrice)}
          </div>
        </div>


        {/* Next Minimum Bid Row */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500 shadow-md">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Minimum Bid</span> {/* CHANGED: text-sm to text-xs */}
            <div className="flex items-center mt-1">
              <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20"> {/* CHANGED: w-5 h-5 to w-4 h-4 */}
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-blue-600 font-semibold">+{formatPrice(nextMinBid - currentPrice)} min</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-800"> {/* CHANGED: text-3xl to text-2xl */}
            {formatPrice(nextMinBid)}
          </div>
        </div>


        {/* Reserve Price Row */}
        {reservePrice !== null && reservePrice !== undefined && (
          <div className={`flex items-center justify-between p-4 rounded-xl border-l-4 shadow-md transition-all duration-300 ${
            reserveMet 
              ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-500' 
              : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-500'
          }`}>
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Reserve Price</span> {/* CHANGED: text-sm to text-xs */}
              <div className="flex items-center mt-1">
                {reserveMet ? (
                  <div className="flex items-center text-emerald-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"> {/* CHANGED: w-5 h-5 to w-4 h-4 */}
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold">RESERVE MET</span>
                  </div>
                ) : (
                  <div className="flex items-center text-orange-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"> {/* CHANGED: w-5 h-5 to w-4 h-4 */}
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold">{formatPrice(reservePrice - currentPrice)} TO GO</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-slate-900">{formatPrice(reservePrice)}</div> {/* CHANGED: text-2xl to text-xl */}
              {!reserveMet && (
                <div className="text-xs text-orange-600 font-semibold"> {/* CHANGED: text-sm to text-xs */}
                  {Math.round((currentPrice / reservePrice) * 100)}% reached
                </div>
              )}
            </div>
          </div>
        )}


        {/* Progress Bar (only if reserve exists) */}
        {reservePrice && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700"> {/* CHANGED: text-sm to text-xs */}
              <span>Reserve Progress</span>
              <span>{Math.min(100, Math.round((currentPrice / reservePrice) * 100))}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
              <div 
                className={`h-3 rounded-full transition-all duration-700 ease-out shadow-sm ${
                  reserveMet 
                    ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                    : 'bg-gradient-to-r from-orange-400 to-amber-500'
                }`}
                style={{ width: `${Math.min(100, (currentPrice / reservePrice) * 100)}%` }}
              />
            </div>
          </div>
        )}


        {/* Auction Statistics Row - FIXED OVERFLOW */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-inner"> {/* CHANGED: gap-3 to gap-2, p-4 to p-3 */}
          <div className="text-center p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-all duration-200"> {/* CHANGED: p-3 to p-2 */}
            <div className="text-lg font-bold text-[#1f3c4a]">{totalBids}</div> {/* CHANGED: text-2xl to text-lg */}
            <div className="text-xs text-slate-600 font-bold uppercase tracking-wide">Bids</div> {/* CHANGED: text-xs remains same */}
          </div>
          
          <div className="text-center p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-all duration-200"> {/* CHANGED: p-3 to p-2 */}
            <div className="text-lg font-bold text-teal-600 truncate"> {/* CHANGED: text-2xl to text-sm, ADDED: truncate to prevent overflow */}
              {formatPrice(currentPrice - startingPrice)}
            </div>
            <div className="text-xs text-slate-600 font-bold uppercase tracking-wide">Increase</div>
          </div>
          
          <div className="text-center p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-all duration-200"> {/* CHANGED: p-3 to p-2 */}
            <div className="text-lg font-bold text-cyan-600"> {/* CHANGED: text-2xl to text-lg */}
              {reservePrice ? Math.round(((currentPrice - startingPrice) / (reservePrice - startingPrice)) * 100) : Math.round((currentPrice / startingPrice) * 100)}%
            </div>
            <div className="text-xs text-slate-600 font-bold uppercase tracking-wide">Growth</div>
          </div>
        </div>


        {/* Live Activity Indicator (if active) */}
        {status === 'active' && (
          <div className="flex items-center justify-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 shadow-md">
            <div className="flex items-center text-emerald-700">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse shadow-lg"></div>
              <span className="text-xs font-bold uppercase tracking-wide">Live Bidding Active</span> {/* CHANGED: text-sm to text-xs */}
              <svg className="w-4 h-4 ml-2 animate-bounce text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default BidStatusIndicators;
