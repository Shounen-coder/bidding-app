export type SellerTier = 'basic' | 'verified' | 'trusted';

export interface SellerAnalytics {
  tier: SellerTier;
  totalAuctions: number;
  totalViews: number;
  totalBids: number;
  totalSales: number;
  avgSalePrice: number;
  conversionRate: number;
  analytics: Array<{
    date: string;
    views: number;
    bids: number;
    sales: number;
    unique_viewers: number;
  }>;
}
