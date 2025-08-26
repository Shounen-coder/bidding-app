const { pool } = require('../config/database');
const Order = require('../models/Order');

class AuctionEndService {
  static async processEndedAuctions() {
    try {
      console.log('🔄 Checking for ended auctions...');
      
      // Find auctions that have ended but don't have orders yet
      const endedAuctionsQuery = `
        SELECT a.id, a.current_winner_id
        FROM auctions a
        LEFT JOIN orders o ON a.id = o.auction_id
        WHERE a.end_time <= NOW() 
          AND a.status = 'active' 
          AND a.current_winner_id IS NOT NULL
          AND o.id IS NULL
      `;
      
      const result = await pool.query(endedAuctionsQuery);
      
      for (const auction of result.rows) {
        try {
          // Create order for this ended auction
          await Order.createFromAuction(auction.id);
          
          // Update auction status to 'ended'
          await pool.query(
            'UPDATE auctions SET status = $1 WHERE id = $2',
            ['ended', auction.id]
          );
          
          console.log(`✅ Created order for ended auction ${auction.id}`);
        } catch (error) {
          console.error(`❌ Failed to create order for auction ${auction.id}:`, error);
        }
      }
      
      console.log(`✅ Processed ${result.rows.length} ended auctions`);
      return result.rows.length;
    } catch (error) {
      console.error('❌ Error processing ended auctions:', error);
      return 0;
    }
  }

  static startScheduler() {
    // Run every 2 minutes
    setInterval(() => {
      this.processEndedAuctions();
    }, 2 * 60 * 1000);
    
    // Run once immediately
    this.processEndedAuctions();
    
    console.log('🚀 Auction end scheduler started - checking every 2 minutes');
  }

  // Manual trigger method for testing
  static async triggerManually() {
    console.log('🔄 Manual trigger: Processing ended auctions...');
    return await this.processEndedAuctions();
  }
}

module.exports = AuctionEndService;
