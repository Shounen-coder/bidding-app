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
  
  // Notifications hook for watchlist feedback
  const { notifySuccess } = useNotifications();
  
  if (!product) {
    return null;
  }

  // ✅ ADD: Calculate if auction is ended based on endTime if isEnded prop not provided
  const auctionEnded = isEnded || new Date(endTime) <= new Date();

  // ✅ ADD: Helper function to get proper image URL (same as AuctionDetail)
  const getImageUrl = (image: string) => {
    if (!image) return '';
    
    // If already a full URL (starts with http/https), return as-is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // If starts with '/', it's an absolute path from root
    if (image.startsWith('/')) {
      return `${window.location.origin}${image}`;
    }
    
    // Otherwise, assume it's a relative path and prepend your API base URL
    return `http://localhost:5000/${image}`;
  };

  // ✅ ADD: Get valid images from product
  const validImages = product.images
    ?.filter(img => img && img.trim() !== '') // Remove empty/null images
    ?.map(img => getImageUrl(img)) || [];

  // ✅ ADD: Get primary image (first valid image)
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

  // Get condition badge color (updated with modern colors)
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'like-new': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'good': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'fair': return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'poor': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  // Get bid count text
  const getBidText = (count: number) => {
    return count === 1 ? '1 bid' : `${count} bids`;
  };

  // Get current bid amount
  const currentBidAmount = currentPrice || product.startingPrice;

  // Get next bid amount (current + increment)
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

  // ✅ ADD: Handle image load errors
  const handleImageError = () => {
    setImageError(true);
  };

  // ✅ UPDATED: Add opacity for ended auctions
  const cardVariants = {
    default: clsx(
      'bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1',
      auctionEnded && 'opacity-75'
    ),
    featured: clsx(
      'bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 border-[#2B5263] hover:border-[#1e3c47] transition-all duration-300 transform hover:-translate-y-2 ring-1 ring-[#2B5263]/20',
      auctionEnded && 'opacity-75 border-gray-300 hover:border-gray-400'
    ),
    compact: clsx(
      'bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 transform hover:-translate-y-0.5',
      auctionEnded && 'opacity-75'
    )
  };

  const imageVariants = {
    default: 'h-48',
    featured: 'h-56',
    compact: 'h-40'
  };

  return (
    <div 
      className={clsx(cardVariants[variant], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/auctions/${auction.id}`} className="block group">
        {/* ✅ UPDATED: Image Section with Real Image Support */}
        <div className={clsx('relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200', imageVariants[variant])}>
          {/* ✅ ADD: Ended overlay for visual indication */}
          {auctionEnded && (
            <div className="absolute inset-0 bg-black/20 z-20 flex items-center justify-center">
              <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold transform rotate-12 shadow-lg">
                AUCTION ENDED
              </div>
            </div>
          )}

          {/* ✅ UPDATED: Real Image or Placeholder */}
          {primaryImage ? (
            <>
              {/* Real Product Image */}
              <img
                src={primaryImage}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={handleImageError}
                loading="lazy"
              />
              
              {/* Image counter badge if multiple images */}
              {validImages.length > 1 && (
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-sm text-white border border-white/20">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    {validImages.length}
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              {/* ✅ PRESERVED: Original Placeholder Design */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-150">
                <div className="absolute inset-0 opacity-10">
                  {/* Modern geometric pattern */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>
                
                {/* Central icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </>
          )}
          
          {/* Modern overlay badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* Condition badge with modern styling */}
            <span className={clsx(
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm',
              getConditionColor(product.condition)
            )}>
              {product.condition.charAt(0).toUpperCase() + product.condition.slice(1).replace('-', ' ')}
            </span>
            
            {/* Featured badge with consistent color */}
            {variant === 'featured' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#2B5263] text-white shadow-lg">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            )}

            {/* ✅ UPDATED: Status badge to reflect ended status */}
            <span className={clsx(
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg',
              auctionEnded ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white' :
              status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200' :
              'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-200'
            )}>
              <div className={clsx(
                'w-2 h-2 rounded-full mr-2',
                auctionEnded ? 'bg-white/70' : 
                status === 'active' ? 'bg-white animate-pulse' : 'bg-white/70'
              )} />
              {auctionEnded ? 'Ended' : status === 'active' ? 'Live' : 'Scheduled'}
            </span>
          </div>

          {/* Reserve met indicator with modern design */}
          {reserveMet && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg backdrop-blur-sm">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Reserve Met
              </span>
            </div>
          )}

          {/* Buy Now price with modern styling */}
          {product.buyNowPrice && (
            <div className="absolute bottom-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-sm text-white border border-white/20">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                Buy Now: {formatPrice(product.buyNowPrice)}
              </span>
            </div>
          )}

          {/* Modern hover overlay */}
          <div className={clsx(
            'absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300',
            isHovered && primaryImage ? 'opacity-100' : 'opacity-0'
          )} />
        </div>

        {/* Rest of your existing content section remains exactly the same */}
        <div className="p-6">
          {/* Category and Seller with modern icons */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                {category?.name}
                {auction.subcategory && ` • ${auction.subcategory.name}`}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              {seller?.firstName} {seller?.lastName}
            </div>
          </div>

          {/* Title with improved typography */}
          <h3 className={clsx(
            'font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#2B5263] transition-colors duration-200',
            variant === 'featured' ? 'text-xl leading-tight' : 'text-lg leading-tight'
          )}>
            {product.title}
          </h3>

          {/* Description for featured variant */}
          {variant === 'featured' && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Enhanced Price Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl p-4 mb-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                  {auctionEnded ? 'Final Bid' : 'Current Bid'}
                </div>
                <div className={clsx(
                  'font-bold',
                  auctionEnded ? 'text-gray-600' : 'text-green-600',
                  variant === 'featured' ? 'text-2xl' : 'text-xl'
                )}>
                  {formatPrice(currentBidAmount)}
                </div>
                {currentPrice && currentPrice > product.startingPrice && (
                  <div className="text-xs text-gray-400 flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Started: {formatPrice(product.startingPrice)}
                  </div>
                )}
              </div>
              
              {/* ✅ UPDATED: Hide "Next Bid" for ended auctions */}
              {!auctionEnded && (
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                    {getBidText(totalBids)}
                  </div>
                  <div className="text-lg text-[#2B5263] font-bold">
                    {formatPrice(nextBidAmount)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Next Bid</div>
                </div>
              )}

              {/* ✅ ADD: Show total bids for ended auctions */}
              {auctionEnded && (
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                    Total Bids
                  </div>
                  <div className="text-lg text-gray-600 font-bold">
                    {totalBids}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Final Count</div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ UPDATED: Only show countdown for active, non-ended auctions */}
          {status === 'active' && !auctionEnded && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time Remaining</div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                <CountdownTimer 
                  endTime={endTime} 
                  variant="compact"
                  showLabels={false}
                />
              </div>
            </div>
          )}

          {/* ✅ UPDATED: Status Messages with Enhanced Design */}
          {(status === 'ended' || auctionEnded) && (
            <div className="mb-4">
              <div className="text-center py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <span className="text-sm font-semibold text-gray-700 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Auction Ended
                </span>
                {totalBids > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Final bid: {formatPrice(currentBidAmount)} ({totalBids} {totalBids === 1 ? 'bid' : 'bids'})
                  </div>
                )}
              </div>
            </div>
          )}

          {status === 'scheduled' && (
            <div className="mb-4">
              <div className="text-center py-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <span className="text-sm font-semibold text-amber-700 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Auction Starting Soon
                </span>
                <div className="text-xs text-amber-600 mt-1">
                  Starting bid: {formatPrice(product.startingPrice)}
                </div>
              </div>
            </div>
          )}

          {/* ✅ UPDATED: Only show WatchlistButton for active, non-ended auctions */}
          {status === 'active' && !auctionEnded && (
            <div 
              className="relative"
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
                className="w-full"
                customWatchedBg="bg-[#1e3c47]"
                customWatchedText="text-white"
                customUnwatchedBg="bg-[#2B5263]"
                customUnwatchedText="text-white"
                customHoverBg="hover:bg-[#1e3c47]"
              />
            </div>
          )}

          {/* ✅ UPDATED: Show "View Details" button for ended or non-active auctions */}
          {(status !== 'active' || auctionEnded) && (
            <Link 
              to={`/auctions/${auction.id}`}
              className="block w-full bg-[#2B5263] hover:bg-[#1e3c47] text-white py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
            >
              View Details
            </Link>
          )}
        </div>
      </Link>
    </div>
  );
};

export default AuctionCard;
