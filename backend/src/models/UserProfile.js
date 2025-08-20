const {pool} = require('../config/database');

class UserProfile {
  constructor(profileData) {
    this.id = profileData.id;
    this.userId = profileData.user_id;
    this.dateOfBirth = profileData.date_of_birth;
    this.bio = profileData.bio;
    this.location = profileData.location;
    this.website = profileData.website;
    this.socialMedia = profileData.social_media || {};
    this.preferences = profileData.preferences || {};
    this.notificationSettings = profileData.notification_settings || {};
    this.timezone = profileData.timezone;
    this.language = profileData.language;
    this.profileCompletionScore = profileData.profile_completion_score;
    this.lastActivityAt = profileData.last_activity_at;
  }

  /**
   * Get complete user profile with statistics
   */
  static async getCompleteProfile(userId) {
    try {
      const query = `
        SELECT 
          u.*,
          us.total_bids,
          us.total_auctions_won,
          us.total_amount_spent,
          us.total_auctions_created,
          us.total_revenue_earned,
          us.average_bid_amount,
          us.last_bid_date,
          us.last_auction_created_date,
          (SELECT COUNT(*) FROM watchlists WHERE user_id = u.id) as total_watchlist_items
        FROM users u
        LEFT JOIN user_statistics us ON u.id = us.user_id
        WHERE u.id = $1
      `;
      
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const userData = result.rows[0];
      
      // Get recent activity
      const recentActivity = await this.getRecentActivity(userId, 10);
      
      // Get bidding history
      const biddingHistory = await this.getBiddingHistory(userId, 5);
      
      // Get watchlist
      const watchlist = await this.getWatchlistSummary(userId, 5);

      return {
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          phone: userData.phone,
          address: userData.address,
          profileImage: userData.profile_image,
          dateOfBirth: userData.date_of_birth,
          bio: userData.bio,
          location: userData.location,
          website: userData.website,
          socialMedia: userData.social_media || {},
          preferences: userData.preferences || {},
          notificationSettings: userData.notification_settings || {},
          timezone: userData.timezone,
          language: userData.language,
          role: userData.role,
          isVerified: userData.is_verified,
          isAdmin: userData.is_admin,
          profileCompletionScore: userData.profile_completion_score || 0,
          lastActivityAt: userData.last_activity_at,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at
        },
        statistics: {
          totalBids: userData.total_bids || 0,
          totalAuctionsWon: userData.total_auctions_won || 0,
          totalAmountSpent: parseFloat(userData.total_amount_spent || 0),
          totalAuctionsCreated: userData.total_auctions_created || 0,
          totalRevenueEarned: parseFloat(userData.total_revenue_earned || 0),
          averageBidAmount: parseFloat(userData.average_bid_amount || 0),
          totalWatchlistItems: userData.total_watchlist_items || 0,
          lastBidDate: userData.last_bid_date,
          lastAuctionCreatedDate: userData.last_auction_created_date
        },
        recentActivity,
        biddingHistory,
        watchlist
      };
    } catch (error) {
      console.error('Error getting complete profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile information
   */
  static async updateProfile(userId, profileData) {
    try {
      const {
        firstName,
        lastName,
        phone,
        address,
        dateOfBirth,
        bio,
        location,
        website,
        socialMedia,
        preferences,
        notificationSettings,
        timezone,
        language
      } = profileData;

      const query = `
        UPDATE users 
        SET 
          first_name = COALESCE($2, first_name),
          last_name = COALESCE($3, last_name),
          phone = COALESCE($4, phone),
          address = COALESCE($5, address),
          date_of_birth = COALESCE($6, date_of_birth),
          bio = COALESCE($7, bio),
          location = COALESCE($8, location),
          website = COALESCE($9, website),
          social_media = COALESCE($10, social_media),
          preferences = COALESCE($11, preferences),
          notification_settings = COALESCE($12, notification_settings),
          timezone = COALESCE($13, timezone),
          language = COALESCE($14, language),
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const values = [
        userId, firstName, lastName, phone, address,
        dateOfBirth, bio, location, website,
        JSON.stringify(socialMedia || {}),
        JSON.stringify(preferences || {}),
        JSON.stringify(notificationSettings || {}),
        timezone, language
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      // Update profile completion score
      await this.updateProfileCompletionScore(userId);

      return result.rows[0];
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Get user's recent activity
   */
  static async getRecentActivity(userId, limit = 10) {
    try {
      const query = `
        SELECT action_type, action_data, created_at
        FROM user_activity_logs
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2
      `;

      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw error;
    }
  }

  /**
   * Get user's bidding history
   */
  static async getBiddingHistory(userId, limit = 5) {
    try {
      const query = `
        SELECT 
          b.id,
          b.amount,
          b.bid_time,
          b.status,
          a.id as auction_id,
          p.title as auction_title,
          p.images
        FROM bids b
        JOIN auctions a ON b.auction_id = a.id
        JOIN products p ON a.product_id = p.id
        WHERE b.bidder_id = $1
        ORDER BY b.bid_time DESC
        LIMIT $2
      `;

      const result = await pool.query(query, [userId, limit]);
      return result.rows.map(row => ({
        id: row.id,
        amount: parseFloat(row.amount),
        bidTime: row.bid_time,
        status: row.status,
        auction: {
          id: row.auction_id,
          title: row.auction_title,
          images: row.images
        }
      }));
    } catch (error) {
      console.error('Error getting bidding history:', error);
      throw error;
    }
  }

  /**
   * Get user's watchlist summary
   */
  static async getWatchlistSummary(userId, limit = 5) {
    try {
      const query = `
        SELECT 
          w.created_at as added_at,
          a.id as auction_id,
          a.status as auction_status,
          a.current_price,
          a.end_time,
          p.title,
          p.images
        FROM watchlists w
        JOIN auctions a ON w.auction_id = a.id
        JOIN products p ON a.product_id = p.id
        WHERE w.user_id = $1
        ORDER BY w.created_at DESC
        LIMIT $2
      `;

      const result = await pool.query(query, [userId, limit]);
      return result.rows.map(row => ({
        addedAt: row.added_at,
        auction: {
          id: row.auction_id,
          title: row.title,
          images: row.images,
          status: row.auction_status,
          currentPrice: parseFloat(row.current_price || 0),
          endTime: row.end_time
        }
      }));
    } catch (error) {
      console.error('Error getting watchlist summary:', error);
      throw error;
    }
  }

  /**
   * Log user activity
   */
  static async logActivity(userId, actionType, actionData = {}, req = null) {
    try {
      const query = `
        INSERT INTO user_activity_logs (user_id, action_type, action_data, ip_address, user_agent)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;

      const values = [
        userId,
        actionType,
        JSON.stringify(actionData),
        req ? req.ip : null,
        req ? req.headers['user-agent'] : null
      ];

      const result = await pool.query(query, values);
      
      // Update user's last activity
      await pool.query(
        'UPDATE users SET last_activity_at = NOW() WHERE id = $1',
        [userId]
      );

      return result.rows[0].id;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }

  /**
   * Calculate and update profile completion score
   */
  static async updateProfileCompletionScore(userId) {
    try {
      const query = `
        SELECT 
          first_name, last_name, email, phone, address, profile_image,
          date_of_birth, bio, location, website
        FROM users
        WHERE id = $1
      `;

      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        return 0;
      }

      const user = result.rows[0];
      let score = 0;

      // Basic information (40 points)
      if (user.first_name) score += 10;
      if (user.last_name) score += 10;
      if (user.email) score += 10;
      if (user.phone) score += 10;

      // Profile details (40 points)
      if (user.address) score += 10;
      if (user.profile_image) score += 10;
      if (user.date_of_birth) score += 10;
      if (user.bio && user.bio.length > 20) score += 10;

      // Additional info (20 points)
      if (user.location) score += 10;
      if (user.website) score += 10;

      // Update the score
      await pool.query(
        'UPDATE users SET profile_completion_score = $1 WHERE id = $2',
        [score, userId]
      );

      return score;
    } catch (error) {
      console.error('Error updating profile completion score:', error);
      throw error;
    }
  }
}

module.exports = UserProfile;
