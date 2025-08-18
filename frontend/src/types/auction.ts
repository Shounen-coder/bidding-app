export interface AuctionFilters {
  category?: string;
  subcategory?: string;
  status?: 'active' | 'ended' | 'scheduled';
  condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'newest' | 'ending_soon' | 'price_low' | 'price_high' | 'most_bids';
  page?: number;
  limit?: number;
  offset?: number;
}

// moved from index.ts to auction.ts
// Auction search result
export interface AuctionSearchResult {
  auctions: Auction[];
  total_count: number;
  current_page: number;
  total_pages: number;
  filters_applied: AuctionFilters;
}
//..........................................

export interface Auction {
  id: number;
  productId: number;
  startTime: string;
  endTime: string;
  currentPrice: number | null;
  currentWinnerId: number | null;
  totalBids: number;
  status: 'active' | 'ended' | 'scheduled';
  reserveMet: boolean;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    title: string;
    description: string;
    startingPrice: number;
    reservePrice: number | null;
    buyNowPrice: number | null;
    bidIncrement: number;
    condition: string;
    images: string[];
  };
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
  subcategory?: {
    id: number;
    name: string;
    slug: string;
  };
  seller: {
    username: string;
    firstName: string;
    lastName: string;
  };
  bids?: Array<{
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
  }>;

  timeRemaining?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };

  nextMinBid?: number;
}
