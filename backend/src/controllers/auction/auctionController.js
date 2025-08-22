const Auction = require('../../models/Auction');
const Product = require('../../models/Product');
const Bid = require("../../models/Bid");
const {pool} = require("../../config/database");
const Watchlist = require('../../models/Watchlist');

// ✅ ADD: Helper function for status filtering
const buildStatusCondition = (status) => {
  switch (status) {
    case 'active':
      return "AND a.end_time > NOW() AND a.status = 'active'";
    case 'ended':
      return "AND a.end_time <= NOW()"; // Don't rely on status field alone
    case 'scheduled':
      return "AND a.start_time > NOW() AND a.status = 'scheduled'";
    case 'all':
      return '';
    default:
      // Default to active auctions only
      return "AND a.end_time > NOW() AND a.status = 'active'";
  }
};

// Get all auctions with filtering, sorting, and pagination
const getAllAuctions = async (req, res) => {
  try {
    console.log('Get auctions request:', req.query);

    const filters = {
      category: req.query.category,
      subcategory: req.query.subcategory,
      status: req.query.status || 'active', // ✅ ENSURE: Default to active
      condition: req.query.condition,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search,
      sortBy: req.query.sortBy || 'newest',
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    };

    // ✅ ENHANCED: Pass status filter properly to the model
    const result = await Auction.getAllWithDetails(filters);

    res.json({
      success: true,
      data: {
        auctions: result.auctions.map(auction => auction.toJSON()),
        pagination: {
          total: result.totalCount,
          limit: filters.limit,
          offset: filters.offset,
          hasMore: result.hasMore
        }
      }
    });
  } catch (error) {
    console.error('Get all auctions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch auctions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single auction by ID
const getAuctionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid auction ID is required'
      });
    }

    const auction = await Auction.findByIdWithDetails(parseInt(id));

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    res.json({
      success: true,
      data: {
        auction: auction.toJSON()
      }
    });
  } catch (error) {
    console.error('Get auction by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch auction details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get auctions by category
const getAuctionsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { subcategorySlug } = req.query;

    const filters = {
      category: categorySlug,
      subcategory: subcategorySlug,
      status: req.query.status || 'active', // ✅ ENSURE: Default to active
      condition: req.query.condition,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search,
      sortBy: req.query.sortBy || 'newest',
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    };

    const result = await Auction.getAllWithDetails(filters);

    res.json({
      success: true,
      data: {
        auctions: result.auctions.map(auction => auction.toJSON()),
        pagination: {
          total: result.totalCount,
          limit: filters.limit,
          offset: filters.offset,
          hasMore: result.hasMore
        },
        filters: {
          category: categorySlug,
          subcategory: subcategorySlug
        }
      }
    });
  } catch (error) {
    console.error('Get auctions by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category auctions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get featured auctions (ending soon, most popular, etc.)
const getFeaturedAuctions = async (req, res) => {
  try {
    const { type } = req.query; // 'ending_soon', 'popular', 'new'

    let filters = {
      status: 'active', // ✅ ENSURE: Only active auctions for featured
      limit: parseInt(req.query.limit) || 10,
      offset: 0
    };

    switch (type) {
      case 'ending_soon':
        filters.sortBy = 'ending_soon';
        break;
      case 'popular':
        filters.sortBy = 'most_bids';
        break;
      case 'new':
      default:
        filters.sortBy = 'newest';
        break;
    }

    const result = await Auction.getAllWithDetails(filters);

    res.json({
      success: true,
      data: {
        auctions: result.auctions.map(auction => auction.toJSON()),
        type: type || 'new'
      }
    });
  } catch (error) {
    console.error('Get featured auctions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured auctions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get latest bids for an auction (for live updates)
const getAuctionBids = async (req, res) => {
  try {
    const { id } = req.params;
    const { since } = req.query; // optional timestamp for incremental updates

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Valid auction ID is required'
      });
    }

    let bids;
    if (since) {
      // Only get bids newer than 'since' timestamp for efficiency
      bids = await Auction.findBidsSince(parseInt(id), since);
    } else {
      // Get all bids
      bids = await Auction.findBidsByAuctionId(parseInt(id));
    }

    res.json({
      success: true,
      data: {
        bids,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get auction bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bid updates'
    });
  }
};

// Place a bid on an auction
const placeBid = async (req, res) => {
  try {
    const auctionId = parseInt(req.params.id, 10);
    const { amount } = req.body;
    const userId = req.user?.id || 1; // For testing, use user ID 1 if no auth

    // ================== VALIDATION RULES ==================

    // 1. Basic Input Validation
    if (!auctionId || isNaN(auctionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid auction ID'
      });
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bid amount. Must be a positive number.'
      });
    }

    // 2. Fetch Current Auction Details
    const auction = await Auction.findByIdWithDetails(auctionId);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    // 3. Auction Status Check
    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Cannot bid on ${auction.status} auction. Only active auctions accept bids.`
      });
    }

    // ✅ ENHANCED: Auction Time Check (double-check for ended auctions)
    const now = new Date();
    const endTime = new Date(auction.endTime);
    if (now >= endTime) {
      return res.status(400).json({
        success: false,
        message: 'Auction has ended. No more bids accepted.'
      });
    }

    // 5. Minimum Bid Amount Validation
    const currentPrice = auction.currentPrice || auction.product.startingPrice;
    const requiredMinBid = currentPrice + auction.product.bidIncrement;
    
    if (amount < requiredMinBid) {
      return res.status(400).json({
        success: false,
        message: `Minimum bid is ${requiredMinBid.toFixed(2)}. Your bid of ${amount.toFixed(2)} is too low.`
      });
    }

    // 6. Self-Bidding Prevention
    if (userId === auction.currentWinnerId) {
      return res.status(400).json({
        success: false,
        message: "You're already the highest bidder. Wait for someone else to outbid you."
      });
    }

    // 7. Seller Self-Bidding Prevention (Shill Bidding)
    if (userId === auction.seller?.id || userId === auction.product?.createdBy) {
      return res.status(403).json({
        success: false,
        message: 'Sellers cannot bid on their own auctions.'
      });
    }

    // 8. Rate Limiting Check (Prevent rapid-fire bidding)
    const recentBidsQuery = `
      SELECT COUNT(*) as bid_count 
      FROM bids 
      WHERE bidder_id = $1 AND auction_id = $2 
      AND bid_time > NOW() - INTERVAL '30 seconds'
    `;
    const recentBids = await pool.query(recentBidsQuery, [userId, auctionId]);
    
    if (parseInt(recentBids.rows[0].bid_count) >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many bids in a short time. Please wait 30 seconds before bidding again.'
      });
    }

    // ================== TRANSACTION: BID PLACEMENT ==================
    
    // Start database transaction to ensure data consistency
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // 9. Create the new bid
      const bidQuery = `
        INSERT INTO bids (auction_id, bidder_id, amount, bid_time, status, is_auto_bid)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const bidValues = [auctionId, userId, amount, new Date(), 'active', false];
      const bidResult = await client.query(bidQuery, bidValues);
      const newBid = bidResult.rows[0];

      // 10. Update auction current price, winner, and bid count
      const auctionUpdateQuery = `
        UPDATE auctions 
        SET current_price = $1, 
            current_winner_id = $2,
            total_bids = total_bids + 1,
            updated_at = NOW()
        WHERE id = $3
      `;
      await client.query(auctionUpdateQuery, [amount, userId, auctionId]);

      // 11. Mark previous bids as 'outbid' (except the new winning bid)
      const outbidQuery = `
        UPDATE bids 
        SET status = 'outbid' 
        WHERE auction_id = $1 AND bidder_id != $2 AND status = 'active'
      `;
      await client.query(outbidQuery, [auctionId, userId]);

      // 12. Set the new bid as 'winning'
      await client.query(
        'UPDATE bids SET status = $1 WHERE id = $2',
        ['winning', newBid.id]
      );

      // 13. Check Reserve Price Met
      let reserveMet = auction.reserveMet;
      if (!reserveMet && auction.product.reservePrice && amount >= auction.product.reservePrice) {
        await client.query(
          'UPDATE auctions SET reserve_met = true WHERE id = $1',
          [auctionId]
        );
        reserveMet = true;
      }

      await client.query('COMMIT');

      // ================== SUCCESS RESPONSE ==================

      // Get bidder details for response
      const bidderQuery = `SELECT username, first_name, last_name, email FROM users WHERE id = $1`;
      const bidderResult = await pool.query(bidderQuery, [userId]);
      const bidder = bidderResult.rows[0];

      res.status(201).json({
        success: true,
        data: {
          bid: {
            id: newBid.id,
            amount: parseFloat(newBid.amount),
            bidTime: newBid.bid_time,
            status: 'winning',
            bidder: {
              username: bidder.username,
              firstName: bidder.first_name,
              lastName: bidder.last_name
            }
          },
          auction: {
            id: auctionId,
            currentPrice: amount,
            totalBids: auction.totalBids + 1,
            reserveMet: reserveMet,
            nextMinBid: amount + auction.product.bidIncrement
          }
        },
        message: `Bid placed successfully! You are now the highest bidder at $${amount.toFixed(2)}.`
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place bid. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add auction to watchlist
const addToWatchlist = async (req, res) => {
  try {
    console.log('Adding to watchlist:', req.params.id); // DEBUG LOG
    
    const auctionId = parseInt(req.params.id, 10);
    const userId = req.user?.id || 1;

    if (!auctionId || isNaN(auctionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid auction ID'
      });
    }

    // Check if auction exists
    const auction = await Auction.findByIdWithDetails(auctionId);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    console.log(`Adding auction ${auctionId} to watchlist for user ${userId}`); // DEBUG LOG

    const watchlistItem = await Watchlist.addToWatchlist(userId, auctionId);
    
    if (watchlistItem) {
      console.log('Successfully added to watchlist'); // DEBUG LOG
      return res.status(201).json({
        success: true,
        data: { watchlistItem },
        message: 'Auction added to watchlist successfully'
      });
    } else {
      console.log('Already in watchlist'); // DEBUG LOG
      return res.status(200).json({
        success: true,
        message: 'Auction is already in your watchlist'
      });
    }

  } catch (error) {
    console.error('Add to watchlist error:', error);
    console.error('Error stack:', error.stack); // DETAILED ERROR LOG
    return res.status(500).json({
      success: false,
      message: 'Failed to add auction to watchlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove auction from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const auctionId = parseInt(req.params.id, 10);
    const userId = req.user?.id || 1;

    if (!auctionId || isNaN(auctionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid auction ID'
      });
    }

    const removed = await Watchlist.removeFromWatchlist(userId, auctionId);
    
    if (removed) {
      res.json({
        success: true,
        message: 'Auction removed from watchlist successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Auction not found in watchlist'
      });
    }

  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove auction from watchlist'
    });
  }
};

// Get watchlist status for multiple auctions
const getMultipleWatchlistStatus = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { auctionIds } = req.body; // Array of auction IDs

    if (!auctionIds || !Array.isArray(auctionIds)) {
      return res.status(400).json({
        success: false,
        message: 'Valid auction IDs array is required'
      });
    }

    const query = `
      SELECT auction_id, true as is_in_watchlist 
      FROM watchlists 
      WHERE user_id = $1 AND auction_id = ANY($2::int[])
    `;
    
    const result = await pool.query(query, [userId, auctionIds]);
    
    // Create a map of auction_id -> is_in_watchlist
    const watchlistMap = {};
    auctionIds.forEach(id => watchlistMap[id] = false);
    result.rows.forEach(row => watchlistMap[row.auction_id] = true);

    res.json({
      success: true,
      data: watchlistMap
    });
  } catch (error) {
    console.error('Get multiple watchlist status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist status'
    });
  }
};

// Check if auction is in watchlist
const checkWatchlistStatus = async (req, res) => {
  try {
    console.log('Checking watchlist status for auction:', req.params.id); // DEBUG LOG
    
    const auctionId = parseInt(req.params.id, 10);
    const userId = req.user?.id || 1;

    if (!auctionId || isNaN(auctionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid auction ID'
      });
    }

    console.log(`Checking watchlist for user ${userId}, auction ${auctionId}`); // DEBUG LOG
    
    const isInWatchlist = await Watchlist.isInWatchlist(userId, auctionId);
    
    console.log(`Watchlist status: ${isInWatchlist}`); // DEBUG LOG
    
    res.json({
      success: true,
      data: { isInWatchlist }
    });

  } catch (error) {
    console.error('Check watchlist status error:', error);
    console.error('Error stack:', error.stack); // DETAILED ERROR LOG
    res.status(500).json({
      success: false,
      message: 'Failed to check watchlist status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user's watchlist
const getUserWatchlist = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [watchlist, totalCount] = await Promise.all([
      Watchlist.getUserWatchlist(userId, limit, offset),
      Watchlist.getWatchlistCount(userId)
    ]);

    res.json({
      success: true,
      data: {
        watchlist,
        pagination: {
          current_page: page,
          total_count: totalCount,
          total_pages: Math.ceil(totalCount / limit),
          has_more: offset + watchlist.length < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Get user watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist'
    });
  }
};

module.exports = {
  getAllAuctions,
  getAuctionById,
  getAuctionsByCategory,
  getFeaturedAuctions,
  getAuctionBids,
  placeBid,

  //watchlist
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus,
  getUserWatchlist,

  // ✅ ADD: Export helper function for use in Auction model
  buildStatusCondition
};
