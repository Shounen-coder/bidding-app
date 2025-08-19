const {pool} = require('../config/database');

class Watchlist {
  constructor(watchlistData) {
    this.id = watchlistData.id;
    this.userId = watchlistData.user_id;
    this.auctionId = watchlistData.auction_id;
    this.createdAt = watchlistData.created_at;
    this.updatedAt = watchlistData.updated_at;
  }

  // Add auction to watchlist
  static async addToWatchlist(userId, auctionId) {
    const query = `
      INSERT INTO watchlists (user_id, auction_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, auction_id) DO NOTHING
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [userId, auctionId]);
      return result.rows.length > 0 ? new Watchlist(result.rows[0]) : null;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  }

  // Remove auction from watchlist
  static async removeFromWatchlist(userId, auctionId) {
    const query = `
      DELETE FROM watchlists 
      WHERE user_id = $1 AND auction_id = $2
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [userId, auctionId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  }

  // Check if auction is in user's watchlist
  static async isInWatchlist(userId, auctionId) {
    const query = `
      SELECT id FROM watchlists 
      WHERE user_id = $1 AND auction_id = $2
    `;
    
    try {
      const result = await pool.query(query, [userId, auctionId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking watchlist:', error);
      throw error;
    }
  }

  // Get user's watchlist with auction details
  static async getUserWatchlist(userId, limit = 20, offset = 0) {
    const query = `
      SELECT w.*, a.*, p.title, p.description, p.images, p.starting_price,
             c.name as category_name, c.slug as category_slug
      FROM watchlists w
      JOIN auctions a ON w.auction_id = a.id
      JOIN products p ON a.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    try {
      const result = await pool.query(query, [userId, limit, offset]);
      return result.rows.map(row => ({
        watchlistId: row.id,
        addedAt: row.created_at,
        auction: {
          id: row.auction_id,
          status: row.status,
          currentPrice: parseFloat(row.current_price || 0),
          totalBids: row.total_bids,
          endTime: row.end_time,
          product: {
            title: row.title,
            description: row.description,
            images: row.images,
            startingPrice: parseFloat(row.starting_price)
          },
          category: {
            name: row.category_name,
            slug: row.category_slug
          }
        }
      }));
    } catch (error) {
      console.error('Error getting user watchlist:', error);
      throw error;
    }
  }

  // Get watchlist count for user
  static async getWatchlistCount(userId) {
    const query = `SELECT COUNT(*) as count FROM watchlists WHERE user_id = $1`;
    
    try {
      const result = await pool.query(query, [userId]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting watchlist count:', error);
      throw error;
    }
  }
}

module.exports = Watchlist;
