const {pool} = require('../config/database');

class Bid {
  constructor(bidData) {
    this.id = bidData.id;
    this.auctionId = bidData.auction_id;
    this.bidderId = bidData.bidder_id;
    this.amount = parseFloat(bidData.amount);
    this.bidTime = bidData.bid_time;
    this.status = bidData.status;
    this.isAutoBid = bidData.is_auto_bid;
    this.priorityRank = bidData.priority_rank;
  }

  // Create new bid
  static async create({ auctionId, bidderId, amount, bidTime, status, isAutoBid, priorityRank }) {
    const query = `
      INSERT INTO bids (auction_id, bidder_id, amount, bid_time, status, is_auto_bid, priority_rank)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const vals = [auctionId, bidderId, amount, bidTime || new Date(), status || 'active', isAutoBid || false, priorityRank];
    const result = await pool.query(query, vals);
    return new Bid(result.rows[0]);
  }

  // Get all bids for an auction
  static async findByAuctionId(auctionId) {
    const query = `
      SELECT b.*, u.username, u.first_name, u.last_name
      FROM bids b JOIN users u ON b.bidder_id = u.id
      WHERE b.auction_id = $1
      ORDER BY b.bid_time DESC
    `;
    const result = await pool.query(query, [auctionId]);
    return result.rows.map(row => ({
      id: row.id,
      amount: parseFloat(row.amount),
      bidTime: row.bid_time,
      status: row.status,
      isAutoBid: row.is_auto_bid,
      bidder: {
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
      }
    }));
  }

  // Update bid statuses after new bid
static async updateBidStatuses(auctionId, winningBidderId) {
  const queries = [
    // Mark all non-winning bids as outbid
    `UPDATE bids SET status = 'outbid' WHERE auction_id = $1 AND bidder_id != $2 AND status != 'cancelled'`,
    
    // Mark winning bid as winning
    `UPDATE bids SET status = 'winning' WHERE auction_id = $1 AND bidder_id = $2 AND status = 'active'`
  ];
  
  try {
    await pool.query(queries[0], [auctionId, winningBidderId]);
    await pool.query(queries[1], [auctionId, winningBidderId]);
  } catch (error) {
    console.error('Error updating bid statuses:', error);
    throw error;
  }
}

// Get user's bidding history for an auction
static async getUserBidsForAuction(userId, auctionId) {
  const query = `
    SELECT * FROM bids 
    WHERE bidder_id = $1 AND auction_id = $2 
    ORDER BY bid_time DESC
  `;
  
  try {
    const result = await pool.query(query, [userId, auctionId]);
    return result.rows.map(row => new Bid(row));
  } catch (error) {
    console.error('Error fetching user bids:', error);
    throw error;
  }
}

// Check if user can bid (rate limiting, eligibility)
static async canUserBid(userId, auctionId) {
  const recentBidsQuery = `
    SELECT COUNT(*) as recent_count 
    FROM bids 
    WHERE bidder_id = $1 AND auction_id = $2 
    AND bid_time > NOW() - INTERVAL '30 seconds'
  `;
  
  try {
    const result = await pool.query(recentBidsQuery, [userId, auctionId]);
    const recentCount = parseInt(result.rows[0].recent_count);
    
    return {
      canBid: recentCount < 3,
      reason: recentCount >= 3 ? 'Rate limit exceeded' : null,
      waitTime: recentCount >= 3 ? 30 : 0
    };
  } catch (error) {
    console.error('Error checking bid eligibility:', error);
    return { canBid: false, reason: 'System error', waitTime: 0 };
  }
}

}

module.exports = Bid;
