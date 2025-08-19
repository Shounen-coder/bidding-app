import React from 'react';

interface AuctionStatusDisplayProps {
  status: 'active' | 'ended' | 'scheduled' | 'cancelled';
  timeRemaining?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs?: number;
  } | null;
  isWinningBidder?: boolean | null;
  isOutbid?: boolean;
  endTime: string;
  className?: string;
}

const AuctionStatusDisplay: React.FC<AuctionStatusDisplayProps> = ({
  status,
  timeRemaining,
  isWinningBidder,
  isOutbid,
  endTime,
  className = ''
}) => {
  const getStatusConfig = () => {
    // Determine urgency level
    const isEndingSoon = timeRemaining && 
      timeRemaining.days === 0 && 
      timeRemaining.hours < 2 && 
      status === 'active';
    
    const isCritical = timeRemaining && 
      timeRemaining.days === 0 && 
      timeRemaining.hours === 0 && 
      timeRemaining.minutes < 30 && 
      status === 'active';

    switch (status) {
      case 'active':
        if (isCritical) {
          return {
            text: 'ENDING VERY SOON',
            bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
            textColor: 'text-white',
            icon: '🔥',
            pulse: true,
            borderColor: 'border-red-300'
          };
        }
        if (isEndingSoon) {
          return {
            text: 'ENDING SOON',
            bgColor: 'bg-gradient-to-r from-orange-400 to-red-400',
            textColor: 'text-white',
            icon: '⏰',
            pulse: true,
            borderColor: 'border-orange-300'
          };
        }
        return {
          text: 'LIVE AUCTION',
          bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
          textColor: 'text-white',
          icon: '🟢',
          pulse: false,
          borderColor: 'border-green-300'
        };
      
      case 'ended':
        return {
          text: 'AUCTION ENDED',
          bgColor: 'bg-gradient-to-r from-gray-400 to-gray-500',
          textColor: 'text-white',
          icon: '⏹️',
          pulse: false,
          borderColor: 'border-gray-300'
        };
      
      case 'scheduled':
        return {
          text: 'UPCOMING AUCTION',
          bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
          textColor: 'text-white',
          icon: '📅',
          pulse: false,
          borderColor: 'border-blue-300'
        };
      
      case 'cancelled':
        return {
          text: 'CANCELLED',
          bgColor: 'bg-gradient-to-r from-red-600 to-red-700',
          textColor: 'text-white',
          icon: '❌',
          pulse: false,
          borderColor: 'border-red-400'
        };
      
      default:
        return {
          text: 'UNKNOWN STATUS',
          bgColor: 'bg-gray-400',
          textColor: 'text-white',
          icon: '❓',
          pulse: false,
          borderColor: 'border-gray-300'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`relative ${className}`}>
      {/* Main Status Badge */}
      <div className={`
        inline-flex items-center px-6 py-3 rounded-xl font-bold text-lg shadow-lg border-2
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${config.pulse ? 'animate-pulse' : ''}
        transition-all duration-300
      `}>
        <span className="mr-2 text-xl">{config.icon}</span>
        {config.text}
        
        {/* Live indicator for active auctions */}
        {status === 'active' && (
          <div className="ml-3 flex items-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-white rounded-full absolute animate-pulse"></div>
          </div>
        )}
      </div>

      {/* User Status Badges */}
      {(isWinningBidder || isOutbid) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {isWinningBidder && (
            <div className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold shadow-md">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              You're Winning! 🏆
            </div>
          )}
          
          {isOutbid && (
            <div className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold shadow-md animate-bounce">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              You've Been Outbid! ⚠️
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuctionStatusDisplay;
