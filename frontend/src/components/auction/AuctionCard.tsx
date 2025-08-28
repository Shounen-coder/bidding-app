// src/components/auction/AuctionCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { type Auction } from '../../types/auction';
import CountdownTimer from './CountdownTimer';
import WatchlistButton from './WatchListButton';
import { useNotifications } from '../../hooks/useNotifications';

interface AuctionCardProps {
  auction: Auction;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
  isEnded?: boolean;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ 
  auction, 
  className = '',
  variant = 'default',
  isEnded = false 
}) => {
  const { product, category, seller, currentPrice, totalBids, endTime, status, reserveMet } = auction;
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Notifications hook for watchlist feedback
  const { notifySuccess } = useNotifications();
  
  if (!product) {
    return null;
  }

  // Calculate if auction is ended
  const auctionEnded = isEnded || new Date(endTime) <= new Date();
  
  // Helper function to get proper image URL
  const getImageUrl = (image: string) => {
    if (!image) return '';
    
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    if (image.startsWith('/')) {
      return `${window.location.origin}${image}`;
    }
    
    return `http://localhost:5000/${image}`;
  };

  // Get valid images from product
  const validImages = product.images
    ?.filter(img => img && img.trim() !== '')
    ?.map(img => getImageUrl(img)) || [];
    
  // Get primary image
  const primaryImage = validImages.length > 0 && !imageError ? validImages[0] : null;

  // Format price with commas
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get bid count text
  const getBidText = (count: number) => {
    return count === 1 ? '1 bid' : `${count} bids`;
  };

  // Get current bid amount
  const currentBidAmount = currentPrice || product.startingPrice;
  
  // Get next bid amount
  const nextBidAmount = currentBidAmount + (product.bidIncrement || 1);

  // Watchlist change handler
  const handleWatchlistChange = (isWatched: boolean) => {
    const message = isWatched 
      ? `"${product.title}" added to your watchlist!`
      : `"${product.title}" removed from watchlist`;
    
    notifySuccess(
      isWatched ? 'Added to Watchlist' : 'Removed from Watchlist', 
      message
    );
  };

  // Handle image load errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Card variants with professional styling
  const cardVariants = {
    default: clsx(
      'group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-teal-200 transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] overflow-hidden',
      auctionEnded && 'opacity-80'
    ),
    featured: clsx(
      'group bg-white rounded-xl shadow-lg hover:shadow-2xl border-2 border-teal-500/20 hover:border-teal-500/40 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] overflow-hidden ring-1 ring-teal-500/10',
      auctionEnded && 'opacity-80 border-gray-300'
    ),
    compact: clsx(
      'group bg-white rounded-lg shadow-sm hover:shadow-lg border border-gray-100 hover:border-teal-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden',
      auctionEnded && 'opacity-80'
    )
  };

  const imageVariants = {
    default: 'h-56',
    featured: 'h-64',
    compact: 'h-44'
  };

  return (
    <div 
      className={clsx(cardVariants[variant], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/auctions/${auction.id}`} className="block h-full flex flex-col">
        {/* Enhanced Image Section */}
        <div className={clsx('relative overflow-hidden bg-gray-50', imageVariants[variant])}>
          
          {/* Auction Ended Overlay */}
          {auctionEnded && (
            <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center text-white">
                <div className="text-lg font-bold mb-1">Auction Ended</div>
                <div className="text-sm opacity-90">View final results</div>
              </div>
            </div>
          )}

          {/* Image or Placeholder */}
          {primaryImage ? (
            <div className="relative h-full w-full overflow-hidden">
              {/* Loading skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Actual Image */}
              <img
                src={primaryImage}
                alt={product.title}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-teal-50 group-hover:to-cyan-50 transition-all duration-500">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-2 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-xs text-gray-400 font-medium">No image available</div>
              </div>
            </div>
          )}

          {/* Minimal Status Indicators */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* Status Badge */}
            <div className={clsx(
              'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium backdrop-blur-md border',
              auctionEnded 
                ? 'bg-gray-900/80 text-white border-gray-700' 
                : status === 'active' 
                  ? 'bg-green-600/90 text-white border-green-500' 
                  : 'bg-blue-600/90 text-white border-blue-500'
            )}>
              <div className={clsx(
                'w-1.5 h-1.5 rounded-full mr-2',
                auctionEnded ? 'bg-gray-400' : 
                status === 'active' ? 'bg-white animate-pulse' : 'bg-white'
              )} />
              {auctionEnded ? 'Ended' : status === 'active' ? 'Live' : 'Scheduled'}
            </div>

            {/* Featured Badge */}
            {variant === 'featured' && !auctionEnded && (
              <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-teal-600/90 text-white border border-teal-500 backdrop-blur-md">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </div>
            )}
          </div>

          {/* Top Right Indicators */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            {/* Multiple Images Indicator */}
            {validImages.length > 1 && (
              <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black/60 text-white backdrop-blur-md">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                {validImages.length}
              </div>
            )}

            {/* Reserve Met */}
            {reserveMet && !auctionEnded && (
              <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-600/90 text-white backdrop-blur-md border border-green-500">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Reserve Met
              </div>
            )}
          </div>
        </div>

        {/* Content Section - Clean & Minimal */}
        <div className="flex-1 p-5 flex flex-col">
          
          {/* Category & Seller Info */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-teal-600 uppercase tracking-wider">
              {category?.name}
            </span>
            <div className="text-xs text-gray-500 flex items-center">
              <svg className="w-3 h-3 mr-1 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              {seller?.firstName} {seller?.lastName}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300 leading-tight">
            {product.title}
          </h3>

          {/* Description for featured variant */}
          {variant === 'featured' && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed opacity-80">
              {product.description}
            </p>
          )}

          {/* Price Section - Clean Design */}
          <div className="mb-4 flex-1">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  {auctionEnded ? 'Final Bid' : 'Current Bid'}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(currentBidAmount)}
                </div>
                {currentPrice && currentPrice > product.startingPrice && (
                  <div className="text-xs text-gray-400 mt-1">
                    Started at {formatPrice(product.startingPrice)}
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  {auctionEnded ? 'Total Bids' : getBidText(totalBids)}
                </div>
                <div className="text-lg font-semibold text-teal-600">
                  {auctionEnded ? totalBids : formatPrice(nextBidAmount)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {auctionEnded ? 'Final Count' : 'Next Bid'}
                </div>
              </div>
            </div>
          </div>

          {/* Time Remaining - Minimal Design */}
          {status === 'active' && !auctionEnded && (
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Time Remaining</div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <CountdownTimer 
                  endTime={endTime} 
                  variant="compact"
                  showLabels={false}
                />
              </div>
            </div>
          )}

          {/* Status Messages - Clean Design */}
          {(status === 'ended' || auctionEnded) && (
            <div className="mb-4">
              <div className="text-center py-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-700 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Auction Ended
                </div>
                {totalBids > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Final: {formatPrice(currentBidAmount)} • {totalBids} {totalBids === 1 ? 'bid' : 'bids'}
                  </div>
                )}
              </div>
            </div>
          )}

          {status === 'scheduled' && (
            <div className="mb-4">
              <div className="text-center py-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-700 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Starting Soon
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Starting bid: {formatPrice(product.startingPrice)}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Clean Design */}
          <div className="mt-auto">
            {status === 'active' && !auctionEnded && (
              <div 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <WatchlistButton
                  auctionId={auction.id}
                  auctionTitle={product.title}
                  variant="large"
                  onStatusChange={handleWatchlistChange}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                />
              </div>
            )}

            {(status !== 'active' || auctionEnded) && (
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-sm hover:shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>View Details</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AuctionCard;
