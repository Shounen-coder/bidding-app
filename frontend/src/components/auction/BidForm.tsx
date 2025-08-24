import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import LoadingButton from '../ui/LoadingButton';
import BidConfirmationModal from './BidConfirmationModal';
import { set } from 'react-hook-form';


interface BidFormProps {
  auctionId: number;
  auctionTitle: string;
  currentPrice: number;
  nextMinBid: number;
  bidIncrement: number;
  isActive: boolean;
  reservePrice?: number | null;
  reserveMet: boolean;
  onBidPlaced?: (bidData: any) => void;
  className?: string;
}


// Enhanced Success Notification with Smooth Animation
interface SuccessNotificationProps {
  isVisible: boolean;
  bidAmount: number;
  onClose: () => void;
  onAnimationComplete?: () => void;
  duration?: number;
}


const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  isVisible,
  bidAmount,
  onClose,
  onAnimationComplete,
  duration = 4000
}) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);


  const formatPrice = (price: number) => 
    price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });


  useEffect(() => {
    if (isVisible) {
      setAnimationKey(prev => prev + 1); // Reset animation
      setIsAnimating(true);
      
      // Auto-close timer
      const closeTimer = setTimeout(() => {
        setIsAnimating(false);
        onClose();
      }, duration);


      // Animation complete callback (earlier than close)
      const animationTimer = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, duration - 1000); // 1 second before close


      return () => {
        clearTimeout(closeTimer);
        clearTimeout(animationTimer);
      };
    }
  }, [isVisible, duration, onClose, onAnimationComplete]);


  if (!isVisible) return null;


  return (
    <div 
      key={animationKey}
      className={`fixed top-4 right-4 z-50 ${isAnimating ? 'animate-slide-in' : ''}`}
      style={{ zIndex: 9999 }}
    >
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-2xl p-6 max-w-sm w-full border-2 border-emerald-400 transform transition-all duration-300">
        <div className="flex items-start space-x-3">
          {/* Success Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>


          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold">🎉 Bid Placed!</h4>
              <button 
                onClick={() => {
                  setIsAnimating(false);
                  onClose();
                }}
                className="text-white hover:text-gray-200 transition-colors ml-2"
                aria-label="Close notification"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm opacity-90 mt-1">
              You're now the highest bidder at {formatPrice(bidAmount)}!
            </p>
            
            <div className="mt-3 flex items-center text-sm opacity-90">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Updating auction data...
            </div>
          </div>
        </div>


        {/* Smooth Progress Bar */}
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-1 overflow-hidden">
          <div 
            key={`progress-${animationKey}`}
            className="bg-white h-full rounded-full animate-progress-shrink"
            style={{
              animation: `progress-shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
};


const BidForm: React.FC<BidFormProps> = ({
  auctionId,
  auctionTitle,
  currentPrice,
  nextMinBid,
  bidIncrement,
  isActive,
  reservePrice,
  reserveMet,
  onBidPlaced,
  className = ''
}) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [lastBidAmount, setLastBidAmount] = useState<number>(0);
  const [buttonState, setButtonState] = useState<'default' | 'success' | 'error'>('default');
  const [lastNotificationAmount, setLastNotificationAmount] = useState<number>(0);


  const { user } = useSelector((state: RootState) => state.auth || {});


  //  const { user, accessToken } = useSelector((state: RootState) => state.auth || {});


  const formatPrice = (price: number) => 
    price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });


  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);


  // Reset button state after success/error
  useEffect(() => {
    if (buttonState !== 'default') {
      const timer = setTimeout(() => setButtonState('default'), 3000);
      return () => clearTimeout(timer);
    }
  }, [buttonState]);


  const getQuickBidAmounts = () => {
    return [
      nextMinBid,
      nextMinBid + bidIncrement,
      nextMinBid + (bidIncrement * 2),
      nextMinBid + (bidIncrement * 5)
    ];
  };


  const handleQuickBid = (amount: number) => {
    setBidAmount(amount.toString());
  };


  const validateBidAmount = (amount: number): string | null => {
    if (amount < nextMinBid) {
      return `Minimum bid is ${formatPrice(nextMinBid)}`;
    }
    if (amount > 1000000) {
      return 'Maximum bid is $1,000,000';
    }
    return null;
  };


  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);


    const amount = parseFloat(bidAmount);
    const validationError = validateBidAmount(amount);
    
    if (validationError) {
      setError(validationError);
      setButtonState('error');
      return;
    }


    setIsConfirmationOpen(true);
  };


const handleConfirmBid = async () => {
  setIsLoading(true);
  setError(null);


  try {
    const amount = parseFloat(bidAmount);
    
    // ✅ CHECK: User authentication
    if (!user) {
      setError('Please log in to place bids');
      setIsConfirmationOpen(false);
      setIsLoading(false);
      return;
    }


    // ✅ CHECK: Get access token
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setError('Authentication token missing. Please login again.');
      setIsConfirmationOpen(false);
      setIsLoading(false);
      return;
    }
    
    // ✅ FIXED: API call with Authorization header
    const response = await fetch(`/api/auctions/${auctionId}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` // ✅ ADDED THIS LINE
      },
      body: JSON.stringify({ amount })
    });


    // ✅ HANDLE: 401 Unauthorized
    if (response.status === 401) {
      setIsConfirmationOpen(false);
      setError('Session expired or unauthorized. Please login again.');
      setIsLoading(false);
      return;
    }


    const data = await response.json();


    if (data.success) {
      // Success flow
      if(amount !== lastNotificationAmount) {
        setLastNotificationAmount(amount);
        setIsConfirmationOpen(false);
        setBidAmount('');
        setLastBidAmount(amount);
        setShowSuccessNotification(true);
        setButtonState('success');
      }
      
      // Callback for instant data refresh
      if (onBidPlaced) {
        onBidPlaced(data.data);
      }
      
    } else {
      // Error flow
      setIsConfirmationOpen(false);
      setError(data.message || 'Failed to place bid');
      setButtonState('error');
    }


  } catch (error) {
    setIsConfirmationOpen(false);
    setError('Network error. Please check your connection and try again.');
    setButtonState('error');
    console.error('Bid placement error:', error);
  } finally {
    setIsLoading(false);
  }
};



  const handleCancelBid = () => {
    setIsConfirmationOpen(false);
    setIsLoading(false);
  };


  // Button styling based on state
  const getButtonStyles = () => {
    const base = "w-full py-4 px-6 rounded-xl text-lg font-bold transition-all duration-300 transform shadow-lg";
    
    switch (buttonState) {
      case 'success':
        return `${base} bg-gradient-to-r from-emerald-500 to-green-600 text-white scale-105 shadow-xl hover:shadow-2xl`;
      case 'error':
        return `${base} bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700`;
      default:
        return `${base} bg-[#1f3c4a] hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-500 disabled:bg-slate-400 text-white hover:scale-105 hover:shadow-xl`;
    }
  };


  const getButtonText = () => {
    if (isLoading) return 'Placing Bid...';
    if (buttonState === 'success') return '✓ Bid Placed Successfully!';
    if (buttonState === 'error') return '✗ Try Again';
    if (bidAmount) return `Place Bid ${formatPrice(parseFloat(bidAmount))}`;
    return 'Enter Bid Amount';
  };


  if (!isActive) {
    return (
      <div className={`bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300 rounded-xl p-8 text-center shadow-lg ${className}`}>
        <div className="mb-4">
          <svg className="w-16 h-16 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-slate-700 text-xl font-bold mb-2">Auction Has Ended</div>
        <div className="text-slate-600 text-lg">Final winning bid: {formatPrice(currentPrice)}</div>
      </div>
    );
  }


  return (
    <>
      <div className={`bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
              <svg className="w-7 h-7 text-teal-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Place Your Bid
            </h3>
          </div>
        </div>
        
        <div className="p-6">
          {/* Bid Info Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200 shadow-md">
              <div className="text-sm text-emerald-700 font-semibold mb-1">Current Bid</div>
              <div className="text-xl font-bold text-emerald-800">{formatPrice(currentPrice)}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200 shadow-md">
              <div className="text-sm text-blue-700 font-semibold mb-1">Minimum Bid</div>
              <div className="text-xl font-bold text-blue-800">{formatPrice(nextMinBid)}</div>
            </div>
          </div>


          {/* Reserve Price Status */}
          {reservePrice !== null && reservePrice !== undefined && (
            <div className={`mb-6 p-4 rounded-xl border-2 shadow-md ${
              reserveMet 
                ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' 
                : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-700">Reserve Price</div>
                  <div className="text-lg font-bold text-slate-800">{formatPrice(reservePrice)}</div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                  reserveMet 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
                    : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                }`}>
                  {reserveMet ? '✓ MET' : '⏳ NOT MET'}
                </div>
              </div>
            </div>
          )}


          {/* Quick Bid Buttons */}
          <div className="mb-6">
            <div className="text-sm font-bold text-slate-700 mb-3">Quick Bid Options:</div>
            <div className="grid grid-cols-2 gap-3">
              {getQuickBidAmounts().map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleQuickBid(amount)}
                  className="px-4 py-3 text-sm border-2 border-teal-200 text-teal-700 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl hover:bg-gradient-to-r hover:from-teal-100 hover:to-cyan-100 hover:border-teal-300 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  {formatPrice(amount)}
                </button>
              ))}
            </div>
          </div>


          {/* Bid Form */}
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <div>
              <label htmlFor="bidAmount" className="block text-sm font-bold text-slate-700 mb-3">
                Your Bid Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-600 text-xl font-bold">$</span>
                <input
                  type="number"
                  id="bidAmount"
                  step="0.01"
                  min={nextMinBid}
                  max="1000000"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-xl font-bold border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-gradient-to-r from-slate-50 to-white shadow-inner"
                  placeholder={nextMinBid.toString()}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>


            {/* Real-time Validation */}
            {bidAmount && !isLoading && (
              <div className="text-sm">
                {parseFloat(bidAmount) >= nextMinBid ? (
                  <div className="text-emerald-700 flex items-center bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200 shadow-md">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Valid bid amount - Ready to place!</span>
                  </div>
                ) : (
                  <div className="text-red-700 flex items-center bg-gradient-to-r from-red-50 to-red-50 p-4 rounded-xl border border-red-200 shadow-md">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Minimum bid is {formatPrice(nextMinBid)}</span>
                  </div>
                )}
              </div>
            )}


            {/* Error Messages */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-200 rounded-xl p-4 shadow-md">
                <div className="flex">
                  <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              </div>
            )}


            {/* Submit Button */}
            <button
              type="submit"
              disabled={!bidAmount || parseFloat(bidAmount) < nextMinBid || isLoading}
              className={getButtonStyles()}
            >
              {getButtonText()}
            </button>
          </form>


          {/* Terms */}
          <div className="mt-6 text-xs text-slate-600 text-center bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
            <p className="flex items-center justify-center font-medium">
              <svg className="w-4 h-4 mr-2 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              By placing a bid, you agree to purchase this item if you win. All bids are final.
            </p>
          </div>
        </div>
      </div>


      {/* Confirmation Modal */}
      <BidConfirmationModal
        isOpen={isConfirmationOpen}
        bidAmount={parseFloat(bidAmount) || 0}
        currentPrice={currentPrice}
        auctionTitle={auctionTitle}
        onConfirm={handleConfirmBid}
        onCancel={handleCancelBid}
        isLoading={isLoading}
      />


      {/* Enhanced Success Notification */}
      <SuccessNotification
        isVisible={showSuccessNotification}
        bidAmount={lastBidAmount}
        onClose={() => setShowSuccessNotification(false)}
        duration={4000}
      />


      {/* Enhanced CSS for smooth animations */}
      <style>{`
        @keyframes progress-shrink {
          from { 
            width: 100%; 
            opacity: 1;
          }
          to { 
            width: 0%; 
            opacity: 0.8;
          }
        }
        
        @keyframes slide-in {
          from {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }


        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }


        .animate-progress-shrink {
          animation: progress-shrink var(--duration, 4000ms) linear forwards;
        }
      `}</style>
    </>
  );
};


export default BidForm;
