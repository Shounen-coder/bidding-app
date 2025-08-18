// src/components/auction/AuctionCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { type Auction } from '../../types/auction';
import CountdownTimer from './CountdownTimer';

interface AuctionCardProps {
  auction: Auction;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
}

const AuctionCard: React.FC<AuctionCardProps> = ({ 
  auction, 
  className = '',
  variant = 'default'
}) => {
  const { product, category, seller, currentPrice, totalBids, endTime, status, reserveMet } = auction;
  
  if (!product) {
    return null;
  }

  // Format price with commas
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get condition badge color
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like-new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  // Get primary image with fallback
  const primaryImage = product.images && product.images.length > 0 
    ? `/images/products/${product.images[0]}` 
    : 'https://via.placeholder.com/400x300?text=No+Image';

  // Card variants
  const cardVariants = {
    default: 'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200',
    featured: 'bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-blue-200',
    compact: 'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'
  };

  const imageVariants = {
    default: 'h-48',
    featured: 'h-56',
    compact: 'h-40'
  };

  return (
    <div className={clsx(cardVariants[variant], className)}>
      <Link to={`/auctions/${auction.id}`} className="block group">
        {/* Image Section */}
        <div className={clsx('relative overflow-hidden rounded-t-lg', imageVariants[variant])}>
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              // Fallback to placeholder if image doesn't exist
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {/* Condition badge */}
            <span className={clsx(
              'inline-block px-2 py-1 rounded-full text-xs font-medium',
              getConditionColor(product.condition)
            )}>
              {product.condition.charAt(0).toUpperCase() + product.condition.slice(1).replace('-', ' ')}
            </span>
            
            {/* Featured badge for featured variant */}
            {variant === 'featured' && (
              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                ⭐ Featured
              </span>
            )}

            {/* Status badge */}
            <span className={clsx(
              'inline-block px-2 py-1 rounded-full text-xs font-medium',
              status === 'active' ? 'bg-green-600 text-white' :
              status === 'ended' ? 'bg-red-600 text-white' :
              'bg-yellow-600 text-white'
            )}>
              {status === 'active' ? 'Live' : status === 'ended' ? 'Ended' : 'Scheduled'}
            </span>
          </div>

          {/* Reserve met indicator */}
          {reserveMet && (
            <div className="absolute top-3 right-3">
              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                ✓ Reserve Met
              </span>
            </div>
          )}

          {/* Buy Now price (if available) */}
          {product.buyNowPrice && (
            <div className="absolute bottom-3 right-3">
              <span className="inline-block px-2 py-1 rounded bg-black bg-opacity-70 text-white text-xs font-medium">
                Buy Now: {formatPrice(product.buyNowPrice)}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Category */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              {category?.name}
              {auction.subcategory && ` • ${auction.subcategory.name}`}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {seller?.firstName} {seller?.lastName}
            </div>
          </div>

          {/* Title */}
          <h3 className={clsx(
            'font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors',
            variant === 'featured' ? 'text-lg' : 'text-base'
          )}>
            {product.title}
          </h3>

          {/* Description (only for featured) */}
          {variant === 'featured' && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price and Bid Info */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Current Bid</div>
              <div className={clsx(
                'font-bold text-green-600',
                variant === 'featured' ? 'text-xl' : 'text-lg'
              )}>
                {formatPrice(currentBidAmount)}
              </div>
              {/* Starting price for reference */}
              {currentPrice && currentPrice > product.startingPrice && (
                <div className="text-xs text-gray-400">
                  Started: {formatPrice(product.startingPrice)}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">
                {getBidText(totalBids)}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                Next: {formatPrice(nextBidAmount)}
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          {status === 'active' && (
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 mb-1">Time Remaining</div>
              </div>
              <CountdownTimer 
                endTime={endTime} 
                variant="compact"
                showLabels={false}
              />
            </div>
          )}

          {/* Auction ended message */}
          {status === 'ended' && (
            <div className="border-t pt-3">
              <div className="text-center py-2">
                <span className="text-sm font-medium text-red-600">
                  Auction Ended
                </span>
                {totalBids > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Final bid: {formatPrice(currentBidAmount)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scheduled auction message */}
          {status === 'scheduled' && (
            <div className="border-t pt-3">
              <div className="text-center py-2">
                <span className="text-sm font-medium text-yellow-600">
                  Auction Starting Soon
                </span>
                <div className="text-xs text-gray-500 mt-1">
                  Starting bid: {formatPrice(product.startingPrice)}
                </div>
              </div>
            </div>
          )}

          {/* Watch button - only for active auctions */}
          {status === 'active' && (
            <div className="mt-3 pt-3 border-t">
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Add to watchlist:', auction.id);
                  // TODO: Implement watchlist functionality
                }}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Watch This Auction
              </button>
            </div>
          )}

          {/* View Details button for ended/scheduled auctions */}
          {status !== 'active' && (
            <div className="mt-3 pt-3 border-t">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                View Details
              </button>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default AuctionCard;
