// backend/src/models/SellerProfile.js
const { pool } = require('../config/database');

class SellerProfile {
  constructor(profileData) {
    this.id = profileData.id;
    this.userId = profileData.user_id;
    this.tier = profileData.tier;
    this.tierUpdatedAt = profileData.tier_updated_at;
    this.totalAuctions = profileData.total_auctions;
    this.completedAuctions = profileData.completed_auctions;
    this.completionRate = parseFloat(profileData.completion_rate) || 0;
    this.averageRating = parseFloat(profileData.average_rating) || 0;
    this.totalSales = parseFloat(profileData.total_sales) || 0;
    this.createdAt = profileData.created_at;
    this.updatedAt = profileData.updated_at;
  }

  // Get or create seller profile
  static async getOrCreateProfile(userId) {
    try {
      // Try to get existing profile
      let profileQuery = await pool.query(
        'SELECT * FROM seller_profiles WHERE user_id = $1',
        [userId]
      );

      // If no profile exists, create one
      if (profileQuery.rows.length === 0) {
        const createQuery = await pool.query(`
          INSERT INTO seller_profiles (user_id) 
          VALUES ($1) 
          RETURNING *
        `, [userId]);
        return new SellerProfile(createQuery.rows[0]);
      }

      return new SellerProfile(profileQuery.rows[0]);
    } catch (error) {
      throw new Error('Error getting seller profile: ' + error.message);
    }
  }

  // Update seller statistics
  static async updateStats(userId, stats) {
    try {
      const { totalAuctions, completedAuctions, averageRating, totalSales } = stats;
      const completionRate = totalAuctions > 0 ? (completedAuctions / totalAuctions) * 100 : 0;

      const result = await pool.query(`
        UPDATE seller_profiles 
        SET total_auctions = $1, 
            completed_auctions = $2, 
            completion_rate = $3, 
            average_rating = $4, 
            total_sales = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $6 
        RETURNING *
      `, [totalAuctions, completedAuctions, completionRate, averageRating, totalSales, userId]);

      if (result.rows.length === 0) {
        throw new Error('Seller profile not found');
      }

      // Check for tier upgrade
      await this.checkTierUpgrade(userId);
      
      return new SellerProfile(result.rows[0]);
    } catch (error) {
      throw new Error('Error updating seller stats: ' + error.message);
    }
  }

  // Check and upgrade seller tier
  static async checkTierUpgrade(userId) {
    try {
      const profileQuery = await pool.query(
        'SELECT * FROM seller_profiles WHERE user_id = $1',
        [userId]
      );

      if (profileQuery.rows.length === 0) return;

      const profile = profileQuery.rows[0];
      const { tier, completed_auctions, average_rating, created_at } = profile;
      const monthsActive = Math.floor((Date.now() - new Date(created_at)) / (1000 * 60 * 60 * 24 * 30));

      let newTier = tier;

      // Basic -> Verified: 5 completed auctions, 100% completion rate
      if (tier === 'basic' && completed_auctions >= 5 && profile.completion_rate >= 100) {
        newTier = 'verified';
      }

      // Verified -> Trusted: 20+ auctions, 4.8+ rating, 3+ months active
      if (tier === 'verified' && completed_auctions >= 20 && average_rating >= 4.8 && monthsActive >= 3) {
        newTier = 'trusted';
      }

      // Update tier if changed
      if (newTier !== tier) {
        await pool.query(`
          UPDATE seller_profiles 
          SET tier = $1, tier_updated_at = CURRENT_TIMESTAMP 
          WHERE user_id = $2
        `, [newTier, userId]);
      }
    } catch (error) {
      throw new Error('Error checking tier upgrade: ' + error.message);
    }
  }

  // Get seller analytics for specific time period
  static async getAnalytics(sellerId, days = 30) {
    try {
      const analyticsQuery = await pool.query(`
        SELECT 
          DATE(aa.date) as date,
          COALESCE(SUM(aa.daily_views), 0) as views,
          COALESCE(SUM(aa.daily_watchers), 0) as watchers,
          COALESCE(SUM(aa.daily_bids), 0) as bids,
          COALESCE(SUM(aa.unique_viewers), 0) as unique_viewers
        FROM auction_analytics aa
        JOIN auctions a ON aa.auction_id = a.id
        JOIN products p ON a.product_id = p.id
        WHERE p.created_by = $1 
          AND aa.date >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE(aa.date)
        ORDER BY date DESC
      `, [sellerId]);

      // Get summary statistics
      const summaryQuery = await pool.query(`
        SELECT 
          COUNT(a.id) as total_auctions,
          SUM(COALESCE(a.view_count, 0)) as total_views,
          AVG(COALESCE(a.view_count, 0)) as avg_views_per_auction,
          COUNT(DISTINCT w.user_id) as total_watchers,
          COUNT(DISTINCT b.bidder_id) as unique_bidders,
          MAX(a.view_count) as max_views_single_auction
        FROM auctions a
        JOIN products p ON a.product_id = p.id
        LEFT JOIN watchlists w ON a.id = w.auction_id
        LEFT JOIN bids b ON a.id = b.auction_id
        WHERE p.created_by = $1 
          AND a.created_at >= CURRENT_DATE - INTERVAL '${days} days'
      `, [sellerId]);

      return {
        analytics: analyticsQuery.rows,
        summary: summaryQuery.rows[0] || {
          total_auctions: 0,
          total_views: 0,
          avg_views_per_auction: 0,
          total_watchers: 0,
          unique_bidders: 0,
          max_views_single_auction: 0
        }
      };
    } catch (error) {
      throw new Error('Error getting seller analytics: ' + error.message);
    }
  }

  // Get tier requirements and progress
  static async getTierProgress(userId) {
    try {
      const profile = await this.getOrCreateProfile(userId);
      
      const tierRequirements = {
        basic: {
          name: 'Basic Seller',
          maxValue: 200,
          maxActive: 2,
          features: ['Basic listing', 'Up to 3 photos'],
          nextTier: 'verified',
          requirements: null
        },
        verified: {
          name: 'Verified Seller',
          maxValue: 1000,
          maxActive: 5,
          features: ['Buy Now option', 'Up to 6 photos', 'Enhanced descriptions'],
          nextTier: 'trusted',
          requirements: {
            completedAuctions: 5,
            completionRate: 100
          }
        },
        trusted: {
          name: 'Trusted Seller',
          maxValue: 5000,
          maxActive: 10,
          features: ['Reserve prices', 'Auction scheduling', 'Priority listings', 'Full analytics'],
          nextTier: null,
          requirements: {
            completedAuctions: 20,
            averageRating: 4.8,
            monthsActive: 3
          }
        }
      };

      const currentTier = tierRequirements[profile.tier];
      const nextTierInfo = currentTier.nextTier ? tierRequirements[currentTier.nextTier] : null;

      // Calculate progress to next tier
      let progress = null;
      if (nextTierInfo && nextTierInfo.requirements) {
        const req = nextTierInfo.requirements;
        const monthsActive = Math.floor((Date.now() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24 * 30));
        
        progress = {
          completedAuctions: {
            current: profile.completedAuctions,
            required: req.completedAuctions,
            percentage: Math.min(100, (profile.completedAuctions / req.completedAuctions) * 100)
          },
          completionRate: req.completionRate ? {
            current: profile.completionRate,
            required: req.completionRate,
            percentage: Math.min(100, (profile.completionRate / req.completionRate) * 100)
          } : null,
          averageRating: req.averageRating ? {
            current: profile.averageRating,
            required: req.averageRating,
            percentage: Math.min(100, (profile.averageRating / req.averageRating) * 100)
          } : null,
          monthsActive: req.monthsActive ? {
            current: monthsActive,
            required: req.monthsActive,
            percentage: Math.min(100, (monthsActive / req.monthsActive) * 100)
          } : null
        };
      }

      return {
        profile,
        currentTier,
        nextTier: nextTierInfo,
        progress
      };
    } catch (error) {
      throw new Error('Error getting tier progress: ' + error.message);
    }
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      tier: this.tier,
      tierUpdatedAt: this.tierUpdatedAt,
      stats: {
        totalAuctions: this.totalAuctions,
        completedAuctions: this.completedAuctions,
        completionRate: this.completionRate,
        averageRating: this.averageRating,
        totalSales: this.totalSales
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = SellerProfile;
