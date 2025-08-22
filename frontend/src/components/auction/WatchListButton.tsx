import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

interface WatchlistButtonProps {
  auctionId: number;
  auctionTitle: string;
  variant?: 'default' | 'large' | 'icon-only';
  className?: string;
  onStatusChange?: (isWatched: boolean) => void;
  
  // Color customization props
  customWatchedBg?: string;
  customWatchedText?: string;
  customUnwatchedBg?: string;
  customUnwatchedText?: string;
  customHoverBg?: string;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  auctionId,
  auctionTitle,
  variant = 'default',
  className = '',
  onStatusChange,
  customWatchedBg,
  customWatchedText,
  customUnwatchedBg,
  customUnwatchedText,
  customHoverBg
}) => {
  const [isWatched, setIsWatched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth || {});

  // Prevent duplicate API calls
  const hasFetchedRef = useRef(false);

  // Check watchlist status on component mount
  useEffect(() => {
    if (user && auctionId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      checkWatchlistStatus();
    }
  }, [user, auctionId]);

  // ✅ FIXED - With Authorization header
  const checkWatchlistStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.log('No token available');
        hasFetchedRef.current = false;
        return;
      }

      const response = await fetch(`/api/auctions/${auctionId}/watchlist/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.warn('Unauthorized - token may be expired');
        hasFetchedRef.current = false;
        return;
      }

      if (response.status === 429) {
        console.warn('Rate limited - too many requests');
        hasFetchedRef.current = false;
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setIsWatched(data.data.isInWatchlist);
      }
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    } finally {
      hasFetchedRef.current = false;
    }
  };

  // ✅ FIXED - Added Authorization header
  const handleToggleWatchlist = async () => {
    if (!user) {
      alert('Please log in to add items to your watchlist');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        alert('No access token available, please login again');
        setIsLoading(false);
        return;
      }

      const method = isWatched ? 'DELETE' : 'POST';
      const response = await fetch(`/api/auctions/${auctionId}/watchlist`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ ADDED THIS LINE
        }
      });

      const data = await response.json();

      if (data.success) {
        const newStatus = !isWatched;
        setIsWatched(newStatus);
        
        if (onStatusChange) {
          onStatusChange(newStatus);
        }

        const message = newStatus 
          ? `"${auctionTitle}" added to watchlist` 
          : `"${auctionTitle}" removed from watchlist`;
        
        showToast(message, newStatus ? 'success' : 'info');
      } else {
        showToast('Failed to update watchlist', 'error');
      }

    } catch (error) {
      console.error('Error toggling watchlist:', error);
      showToast('Failed to update watchlist', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const getButtonStyles = () => {
    const base = "inline-flex items-center justify-center transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const watchedBg = customWatchedBg || 'bg-red-50';
    const watchedText = customWatchedText || 'text-red-600';
    const watchedHover = customHoverBg || 'hover:bg-red-100';
    
    const unwatchedBg = customUnwatchedBg || 'bg-blue-50';
    const unwatchedText = customUnwatchedText || 'text-blue-600';
    const unwatchedHover = customHoverBg || 'hover:bg-blue-100';
    
    switch (variant) {
      case 'large':
        return `${base} px-6 py-3 text-lg rounded-xl ${
          isWatched 
            ? `${watchedBg} ${watchedText} border-2 border-current ${watchedHover} focus:ring-red-500` 
            : `${unwatchedBg} ${unwatchedText} border-2 border-current ${unwatchedHover} focus:ring-blue-500`
        }`;
      
      case 'icon-only':
        return `${base} p-3 rounded-full ${
          isWatched 
            ? `${watchedBg} ${watchedText} ${watchedHover}` 
            : `bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600`
        }`;
      
      default:
        return `${base} px-4 py-2 text-sm rounded-lg ${
          isWatched 
            ? `${watchedBg} ${watchedText} border border-current ${watchedHover} focus:ring-red-500` 
            : `bg-gray-50 text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 focus:ring-blue-500`
        }`;
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return (
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }

    if (isWatched) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      );
    }

    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    );
  };

  const getButtonText = () => {
    if (variant === 'icon-only') return null;
    
    if (isLoading) return 'Updating...';
    if (isWatched && isHovered) return 'Remove from Watchlist';
    if (isWatched) return 'Watching';
    return 'Watch this Auction';
  };

  return (
    <button
      type="button"
      onClick={handleToggleWatchlist}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${getButtonStyles()} ${className} cursor-pointer`}
      title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {getIcon()}
      {getButtonText() && (
        <span className="ml-2">{getButtonText()}</span>
      )}
    </button>
  );
};

export default WatchlistButton;
