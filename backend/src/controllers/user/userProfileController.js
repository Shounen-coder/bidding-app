const UserProfile = require('../../models/UserProfile');
const User = require('../../models/User');
const { pool } = require('../../config/database');

class UserProfileController {
  /**
   * Get current user's complete profile
   */
  static async getMyProfile(req, res) {
    try {
      console.log('🔍 DEBUG: getMyProfile called');
      console.log('🔍 DEBUG: req.user:', req.user);
      const userId = req.user.id;

      const profileData = await UserProfile.getCompleteProfile(userId);

      if (!profileData) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      // Log activity
      await UserProfile.logActivity(userId, 'profile_viewed', {}, req);

      res.json({
        success: true,
        data: profileData
      });
    } catch (error) {
      console.error('Get my profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile'
      });
    }
  }

  /**
   * Update current user's profile - FIXED
   */
  static async updateMyProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      // FIXED: Use UserProfileController.validateProfileData instead of this.validateProfileData
      const validation = await UserProfileController.validateProfileData(profileData);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.errors[0]
        });
      }

      // Update profile
      const updatedUser = await UserProfile.updateProfile(userId, profileData);

      // Log activity
      await UserProfile.logActivity(userId, 'profile_updated', {
        updatedFields: Object.keys(profileData)
      }, req);

      // Get updated complete profile
      const completeProfile = await UserProfile.getCompleteProfile(userId);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: completeProfile
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  }

  /**
   * Get user's notifications - FIXED
   */
  static async getMyNotifications(req, res) {
    try {
      console.log('🔍 DEBUG: getMyNotifications called');
      console.log('🔍 DEBUG: req.user:', req.user);
      
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      console.log('🔍 DEBUG: userId:', userId, 'page:', page, 'limit:', limit);
      
      // FIXED: Use UserProfileController.getUserNotifications instead of this.getUserNotifications
      const notifications = await UserProfileController.getUserNotifications(userId, page, limit);

      console.log('🔍 DEBUG: notifications result:', notifications);
      
      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error('❌ Get notifications error:', error);
      console.error('❌ Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications',
        error: error.message
      });
    }
  }

  /**
   * Get user's watchlist - FIXED
   */
  static async getMyWatchlist(req, res) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      // FIXED: Use UserProfileController.getUserWatchlist instead of this.getUserWatchlist
      const watchlist = await UserProfileController.getUserWatchlist(userId, page, limit);
      
      res.json({
        success: true,
        data: watchlist
      });
    } catch (error) {
      console.error('Get watchlist error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch watchlist'
      });
    }
  }

  /**
   * Add item to watchlist
   */
  static async addToWatchlist(req, res) {
    try {
      const userId = req.user.id;
      const { auctionId } = req.params;

      // Check if already in watchlist
      const existingQuery = 'SELECT id FROM watchlists WHERE user_id = $1 AND auction_id = $2';
      const existing = await pool.query(existingQuery, [userId, auctionId]);
      
      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Item already in watchlist'
        });
      }

      // Add to watchlist
      const insertQuery = `
        INSERT INTO watchlists (user_id, auction_id, created_at)
        VALUES ($1, $2, NOW())
        RETURNING id
      `;
      await pool.query(insertQuery, [userId, auctionId]);

      // Log activity
      await UserProfile.logActivity(userId, 'watchlist_added', { auctionId }, req);

      res.json({
        success: true,
        message: 'Item added to watchlist'
      });
    } catch (error) {
      console.error('Add to watchlist error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add item to watchlist'
      });
    }
  }

  /**
   * Remove item from watchlist
   */
  static async removeFromWatchlist(req, res) {
    try {
      const userId = req.user.id;
      const { auctionId } = req.params;

      const deleteQuery = 'DELETE FROM watchlists WHERE user_id = $1 AND auction_id = $2';
      const result = await pool.query(deleteQuery, [userId, auctionId]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in watchlist'
        });
      }

      await UserProfile.logActivity(userId, 'watchlist_removed', { auctionId }, req);

      res.json({
        success: true,
        message: 'Item removed from watchlist'
      });
    } catch (error) {
      console.error('Remove from watchlist error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove item from watchlist'
      });
    }
  }

  /**
   * Get user's dashboard statistics - FIXED
   */
  static async getDashboardStats(req, res) {
    try {
      const userId = req.user.id;
      
      // FIXED: Use UserProfileController.calculateDashboardStats instead of this.calculateDashboardStats
      const stats = await UserProfileController.calculateDashboardStats(userId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard statistics'
      });
    }
  }

  /**
   * Get user's orders - FIXED
   */
  static async getMyOrders(req, res) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const status = req.query.status;
      
      // FIXED: Use UserProfileController.getUserOrders instead of this.getUserOrders
      const orders = await UserProfileController.getUserOrders(userId, page, limit, status);
      
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }
  }

  /**
   * Get user's bids - FIXED
   */
  static async getMyBids(req, res) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const status = req.query.status;
      
      // FIXED: Use UserProfileController.getUserBids instead of this.getUserBids
      const bids = await UserProfileController.getUserBids(userId, page, limit, status);
      
      res.json({
        success: true,
        data: bids
      });
    } catch (error) {
      console.error('Get bids error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bids'
      });
    }
  }

  /**
   * Mark notifications as read
   */
  static async markNotificationsRead(req, res) {
    try {
      const userId = req.user.id;
      const { notificationIds } = req.body;

      if (!notificationIds || !Array.isArray(notificationIds)) {
        return res.status(400).json({
          success: false,
          message: 'Notification IDs array is required'
        });
      }

      const query = `
        UPDATE notifications
        SET is_read = true, updated_at = NOW()
        WHERE user_id = $1 AND id = ANY($2)
      `;
      await pool.query(query, [userId, notificationIds]);

      res.json({
        success: true,
        message: 'Notifications marked as read'
      });
    } catch (error) {
      console.error('Mark notifications read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notifications as read'
      });
    }
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(req, res) {
    try {
      const userId = req.user.id;
      const { notificationSettings } = req.body;

      if (!notificationSettings || typeof notificationSettings !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification settings'
        });
      }

      await UserProfile.updateProfile(userId, { notificationSettings });

      await UserProfile.logActivity(userId, 'notification_settings_updated', {
        settings: notificationSettings
      }, req);

      res.json({
        success: true,
        message: 'Notification settings updated successfully'
      });
    } catch (error) {
      console.error('Update notification settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update notification settings'
      });
    }
  }

  // Helper Methods
  static async validateProfileData(data) {
    const errors = [];

    if (data.firstName && data.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (data.lastName && data.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }

    if (data.website && !UserProfileController.isValidUrl(data.website)) {
      errors.push('Please enter a valid website URL');
    }

    if (data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        errors.push('You must be at least 18 years old to use this platform');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * FIXED: Get user notifications with better error handling
   */
 static async getUserNotifications(userId, page, limit) {
  try {
    const offset = (page - 1) * limit;
    
    // Create notifications table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'system',
        is_read BOOLEAN DEFAULT FALSE,
        related_auction_id INTEGER,
        priority VARCHAR(20) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert sample notifications if none exist
    const countQuery = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1';
    const countResult = await pool.query(countQuery, [userId]);
    
    if (parseInt(countResult.rows[0].count) === 0) {
      // Insert sample notifications
      await pool.query(`
        INSERT INTO notifications (user_id, title, message, type, is_read, priority, created_at)
        VALUES 
          ($1, 'Welcome to BIDDEX!', 'Your account has been created successfully. Start bidding now!', 'system', false, 'high', NOW() - INTERVAL '1 hour'),
          ($1, 'New auction available', 'Check out the new vintage camera auction ending soon!', 'system', false, 'medium', NOW() - INTERVAL '2 hours'),
          ($1, 'Bid confirmation', 'Your bid of $150 has been placed successfully.', 'system', true, 'low', NOW() - INTERVAL '1 day')
      `, [userId]);
    }

    // FIXED: Simple query without problematic JOIN
    const query = `
      SELECT n.*
      FROM notifications n
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [userId, limit, offset]);

    return {
      notifications: result.rows,
      pagination: {
        page,
        limit,
        hasMore: result.rows.length === limit
      }
    };
  } catch (error) {
    console.error('getUserNotifications error:', error);
    throw error;
  }
}


// static async getUserWatchlist(userId, page, limit) {
//   try {
//     const offset = (page - 1) * limit;

//     const query = `
//       SELECT
//         w.id,
//         w.user_id,
//         w.auction_id,
//         w.created_at,
//         a.status as auction_status,
//         a.current_price,
//         a.end_time,
//         a.starting_price,
//         a.title,
//         a.description,
//         a.images,
//         a.category,
//         a.current_winner_id
//       FROM watchlists w
//       JOIN auctions a ON w.auction_id = a.id
//       WHERE w.user_id = $1
//       ORDER BY w.created_at DESC
//       LIMIT $2 OFFSET $3
//     `;

//     const result = await pool.query(query, [userId, limit, offset]);
    
//     const formattedWatchlist = result.rows.map(row => ({
//       id: row.id,
//       userId: row.user_id,
//       auctionId: row.auction_id,
//       createdAt: row.created_at,
//       auction: {
//         id: row.auction_id,
//         title: row.title,
//         description: row.description,
//         images: Array.isArray(row.images) ? row.images : (row.images ? [row.images] : ['https://via.placeholder.com/300']),
//         category: row.category,
//         status: row.auction_status,
//         currentPrice: parseFloat(row.current_price || 0),
//         startingPrice: parseFloat(row.starting_price || 0),
//         endTime: row.end_time,
//         currentWinnerId: row.current_winner_id
//       }
//     }));

//     return {
//       watchlist: formattedWatchlist,
//       pagination: { 
//         page, 
//         limit, 
//         hasMore: result.rows.length === limit 
//       }
//     };
//   } catch (error) {
//     console.error('getUserWatchlist error:', error);
//     throw error;
//   }
// }

static async getUserWatchlist(userId, page, limit) {
  try {
    const offset = (page - 1) * limit;
    
    // ENTERPRISE-LEVEL QUERY: Join watchlists → auctions → products → categories
    const query = `
      SELECT 
        w.id,
        w.user_id,
        w.auction_id,
        w.created_at,
        -- AUCTION DATA
        a.status as auction_status,
        a.current_price,
        a.end_time,
        a.start_time,
        a.starting_price,
        a.current_winner_id,
        a.images as auction_images,
        a.description as auction_description,
        -- PRODUCT DATA (REAL TITLES AND INFO)
        p.title as product_title,
        p.description as product_description,
        p.images as product_images,
        p.condition as product_condition,
        -- CATEGORY DATA
        c.name as category_name,
        sc.name as subcategory_name
      FROM watchlists w
      JOIN auctions a ON w.auction_id = a.id
      JOIN products p ON a.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    console.log('🔍 EXECUTING WATCHLIST QUERY:', query);
    console.log('🔍 WITH PARAMS:', [userId, limit, offset]);

    const result = await pool.query(query, [userId, limit, offset]);
    
    console.log('🔍 RAW WATCHLIST RESULT:', result.rows[0]); // Debug first row

    // Format the results with REAL product data (same structure as bids)
    const formattedWatchlist = result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      auctionId: row.auction_id,
      createdAt: row.created_at,
      auction: {
        id: row.auction_id,
        title: row.product_title, // REAL PRODUCT TITLE
        description: row.product_description || row.auction_description,
        images: Array.isArray(row.product_images) ? row.product_images : 
                (Array.isArray(row.auction_images) ? row.auction_images : 
                (row.product_images ? [row.product_images] : 
                (row.auction_images ? [row.auction_images] : ['https://via.placeholder.com/300']))),
        category: row.category_name, // REAL CATEGORY NAME
        subcategory: row.subcategory_name,
        condition: row.product_condition,
        status: row.auction_status,
        currentPrice: parseFloat(row.current_price || 0),
        startingPrice: parseFloat(row.starting_price || 0),
        endTime: row.end_time,
        startTime: row.start_time,
        currentWinnerId: row.current_winner_id
      }
    }));

    console.log('🔍 FORMATTED WATCHLIST RESULT:', formattedWatchlist[0]); // Debug first formatted item

    return {
      watchlist: formattedWatchlist,
      pagination: {
        page,
        limit,
        hasMore: result.rows.length === limit
      }
    };
  } catch (error) {
    console.error('getUserWatchlist error:', error);
    throw error;
  }
}


  // static async calculateDashboardStats(userId) {
  //   try {
  //     // Create tables if they don't exist
  //     await pool.query(`
  //       CREATE TABLE IF NOT EXISTS bids (
  //         id SERIAL PRIMARY KEY,
  //         bidder_id INTEGER REFERENCES users(id),
  //         auction_id INTEGER,
  //         amount DECIMAL(10,2),
  //         bid_time TIMESTAMP DEFAULT NOW()
  //       )
  //     `);

  //     await pool.query(`
  //       CREATE TABLE IF NOT EXISTS orders (
  //         id SERIAL PRIMARY KEY,
  //         buyer_id INTEGER REFERENCES users(id),
  //         auction_id INTEGER,
  //         total_amount DECIMAL(10,2),
  //         status VARCHAR(50) DEFAULT 'pending',
  //         created_at TIMESTAMP DEFAULT NOW()
  //       )
  //     `);

  //     const queries = await Promise.all([
  //       // Total bids
  //       pool.query('SELECT COUNT(*) as count FROM bids WHERE bidder_id = $1', [userId]),
  //       // Total won auctions (for now, return 0)
  //       pool.query('SELECT COUNT(*) as count FROM orders WHERE buyer_id = $1', [userId]),
  //       // Total watchlist items
  //       pool.query('SELECT COUNT(*) as count FROM watchlists WHERE user_id = $1', [userId]),
  //       // Total notifications
  //       pool.query('SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false', [userId])
  //     ]);

  //     return {
  //     // FIXED: Use correct array indices
  //     totalBids: parseInt(queries[0].rows.count) || 0,
  //     totalAuctionsWon: parseInt(queries[1].rows.count) || 0,
  //     totalWatchlistItems: parseInt(queries[2].rows.count) || 0,
  //     unreadNotifications: parseInt(queries[3].rows.count) || 0,
  //     totalAmountSpent: 0,
  //     averageBidAmount: 0
  //     };
  //   } catch (error) {
  //     console.error('calculateDashboardStats error:', error);
  //     throw error;
  //   }
  // }

  static async calculateDashboardStats(userId) {
  try {
    const queries = await Promise.all([
      // Total bids
      pool.query('SELECT COUNT(*) as count FROM bids WHERE bidder_id = $1', [userId]),
      // Total won auctions
      pool.query('SELECT COUNT(*) as count FROM orders WHERE buyer_id = $1', [userId]),
      // Total watchlist items
      pool.query('SELECT COUNT(*) as count FROM watchlists WHERE user_id = $1', [userId]),
      // Total notifications
      pool.query('SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false', [userId])
    ]);

    return {
      totalBids: parseInt(queries[0].rows[0].count) || 0,
      totalAuctionsWon: parseInt(queries[1].rows.count) || 0,
      totalWatchlistItems: parseInt(queries[2].rows.count) || 0,
      unreadNotifications: parseInt(queries[3].rows.count) || 0,
      totalAmountSpent: 0,
      averageBidAmount: 0
    };
  } catch (error) {
    console.error('calculateDashboardStats error:', error);
    throw error;
  }
}


  // static async getUserOrders(userId, page, limit, status) {
  //   try {
  //     const offset = (page - 1) * limit;
  //     let query = `
  //       SELECT o.*, 'Sample Order' as title, '["image1.jpg"]' as images
  //       FROM orders o
  //       WHERE o.buyer_id = $1
  //     `;
  //     const params = [userId];

  //     if (status) {
  //       query += ' AND o.status = $' + (params.length + 1);
  //       params.push(status);
  //     }

  //     query += ' ORDER BY o.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  //     params.push(limit, offset);
      
  //     const result = await pool.query(query, params);
      
  //     return {
  //       orders: result.rows,
  //       pagination: {
  //         page,
  //         limit,
  //         hasMore: result.rows.length === limit
  //       }
  //     };
  //   } catch (error) {
  //     console.error('getUserOrders error:', error);
  //     throw error;
  //   }
  // }

  static async getUserOrders(userId, page, limit, status) {
  try {
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        o.*,
        a.end_time,
        a.title,
        a.description,
        a.images,
        a.category
      FROM orders o
      JOIN auctions a ON o.auction_id = a.id
      WHERE o.buyer_id = $1
    `;

    const params = [userId];

    if (status && status !== 'all') {
      query += ` AND o.status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    const formattedOrders = result.rows.map(row => ({
      id: row.id,
      orderId: row.order_id,
      auctionId: row.auction_id,
      totalAmount: parseFloat(row.total_amount || 0),
      finalBid: parseFloat(row.final_bid || 0),
      shippingCost: parseFloat(row.shipping_cost || 0),
      status: row.status,
      paymentMethod: row.payment_method,
      trackingNumber: row.tracking_number,
      createdAt: row.created_at,
      paidAt: row.paid_at,
      shippedAt: row.shipped_at,
      deliveredAt: row.delivered_at,
      estimatedDelivery: row.estimated_delivery,
      auction: {
        id: row.auction_id,
        title: row.title,
        description: row.description,
        images: Array.isArray(row.images) ? row.images : (row.images ? [row.images] : ['https://via.placeholder.com/300']),
        category: row.category,
        endTime: row.end_time
      }
    }));

    return {
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        hasMore: result.rows.length === limit
      }
    };
  } catch (error) {
    console.error('getUserOrders error:', error);
    throw error;
  }
}




// static async getUserBids(userId, page, limit, status) {
//   try {
//     const offset = (page - 1) * limit;
    
//     let query = `
//       SELECT 
//         b.id,
//         b.amount,
//         b.bid_time,
//         b.auction_id,
//         b.status as bid_status,
//         a.status as auction_status,
//         a.current_price,
//         a.end_time,
//         a.starting_price,
//         a.current_winner_id,
//         COALESCE(a.title, 'Untitled Auction') as title, -- FIXED: Ensure title is never NULL
//         a.description,
//         a.images,
//         a.category,
//         -- Determine if user is currently winning
//         CASE 
//           WHEN a.status = 'active' AND a.current_winner_id = $1 THEN 'winning'
//           WHEN a.status = 'active' AND (a.current_winner_id != $1 OR a.current_winner_id IS NULL) THEN 'outbid'
//           WHEN a.status = 'completed' AND a.current_winner_id = $1 THEN 'won'
//           WHEN a.status = 'completed' AND (a.current_winner_id != $1 OR a.current_winner_id IS NULL) THEN 'lost'
//           ELSE 'active'
//         END as bid_status
//       FROM bids b
//       JOIN auctions a ON b.auction_id = a.id
//       WHERE b.bidder_id = $1
//     `;

//     const params = [userId];

//     if (status && status !== 'all') {
//       if (status === 'winning') {
//         query += ` AND a.status = 'active' AND a.current_winner_id = $1`;
//       } else if (status === 'outbid') {
//         query += ` AND a.status = 'active' AND (a.current_winner_id != $1 OR a.current_winner_id IS NULL)`;
//       } else if (status === 'won') {
//         query += ` AND a.status = 'completed' AND a.current_winner_id = $1`;
//       } else if (status === 'lost') {
//         query += ` AND a.status = 'completed' AND (a.current_winner_id != $1 OR a.current_winner_id IS NULL)`;
//       }
//     }

//     query += ` ORDER BY b.bid_time DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
//     params.push(limit, offset);

//     const result = await pool.query(query, params);
    
//     // Format the results with proper title handling
//     const formattedBids = result.rows.map(row => ({
//       id: row.id,
//       amount: parseFloat(row.amount),
//       bidTime: row.bid_time,
//       auctionId: row.auction_id,
//       bidStatus: row.bid_status,
//       auctionEndTime: row.end_time,
//       currentPrice: parseFloat(row.current_price || 0),
//       startingPrice: parseFloat(row.starting_price || 0),
//       auction: {
//         id: row.auction_id,
//         title: row.title, // This will never be null due to COALESCE
//         description: row.description,
//         images: Array.isArray(row.images) ? row.images : (row.images ? [row.images] : ['https://via.placeholder.com/300']),
//         category: row.category,
//         status: row.auction_status,
//         endTime: row.end_time,
//         currentPrice: parseFloat(row.current_price || 0),
//         currentWinnerId: row.current_winner_id
//       }
//     }));

//     return {
//       bids: formattedBids,
//       pagination: {
//         page,
//         limit,
//         hasMore: result.rows.length === limit
//       }
//     };
//   } catch (error) {
//     console.error('getUserBids error:', error);
//     throw error;
//   }
// }

static async getUserBids(userId, page, limit, status) {
  try {
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        b.id,
        b.amount,
        b.bid_time,
        b.auction_id,
        b.status as bid_status,
        -- AUCTION DATA
        a.status as auction_status,
        a.current_price,
        a.start_time,
        a.end_time,
        a.starting_price,
        a.current_winner_id,
        a.images as auction_images,
        a.description as auction_description,
        -- PRODUCT DATA (REAL TITLES AND INFO)
        p.title as product_title,
        p.description as product_description,
        p.images as product_images,
        p.condition as product_condition,
        -- CATEGORY DATA
        c.name as category_name,
        sc.name as subcategory_name,
        -- Determine bid status
        CASE 
          WHEN a.status = 'active' AND a.current_winner_id = $1 THEN 'winning'
          WHEN a.status = 'active' AND (a.current_winner_id != $1 OR a.current_winner_id IS NULL) THEN 'outbid'
          WHEN a.status = 'completed' AND a.current_winner_id = $1 THEN 'won'
          WHEN a.status = 'completed' AND (a.current_winner_id != $1 OR a.current_winner_id IS NULL) THEN 'lost'
          ELSE 'active'
        END as bid_status
      FROM bids b
      JOIN auctions a ON b.auction_id = a.id
      JOIN products p ON a.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      WHERE b.bidder_id = $1
    `;

    const params = [userId];

    if (status && status !== 'all') {
      if (status === 'winning') {
        query += ` AND a.status = 'active' AND a.current_winner_id = $1`;
      } else if (status === 'outbid') {
        query += ` AND a.status = 'active' AND (a.current_winner_id != $1 OR a.current_winner_id IS NULL)`;
      } else if (status === 'won') {
        query += ` AND a.status = 'completed' AND a.current_winner_id = $1`;
      } else if (status === 'lost') {
        query += ` AND a.status = 'completed' AND (a.current_winner_id != $1 OR a.current_winner_id IS NULL)`;
      }
    }

    query += ` ORDER BY b.bid_time DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    console.log('🔍 EXECUTING QUERY:', query);
    console.log('🔍 WITH PARAMS:', params);

    const result = await pool.query(query, params);
    
    console.log('🔍 RAW QUERY RESULT:', result.rows[0]); // Debug first row

    // Format the results with REAL product data
    const formattedBids = result.rows.map(row => ({
      id: row.id,
      amount: parseFloat(row.amount),
      bidTime: row.bid_time,
      auctionId: row.auction_id,
      bidStatus: row.bid_status,
      auctionEndTime: row.end_time,
      currentPrice: parseFloat(row.current_price || 0),
      startingPrice: parseFloat(row.starting_price || 0),
      auction: {
        id: row.auction_id,
        title: row.product_title, // REAL PRODUCT TITLE
        description: row.product_description || row.auction_description,
        images: Array.isArray(row.product_images) ? row.product_images : 
                (Array.isArray(row.auction_images) ? row.auction_images : 
                (row.product_images ? [row.product_images] : 
                (row.auction_images ? [row.auction_images] : ['https://via.placeholder.com/300']))),
        category: row.category_name, // REAL CATEGORY NAME
        subcategory: row.subcategory_name,
        condition: row.product_condition,
        status: row.auction_status,
        endTime: row.end_time,
        currentPrice: parseFloat(row.current_price || 0),
        currentWinnerId: row.current_winner_id
      }
    }));

    console.log('🔍 FORMATTED RESULT:', formattedBids[0]); // Debug first formatted item

    return {
      bids: formattedBids,
      pagination: {
        page,
        limit,
        hasMore: result.rows.length === limit
      }
    };
  } catch (error) {
    console.error('getUserBids error:', error);
    throw error;
  }
}







}

module.exports = UserProfileController;
