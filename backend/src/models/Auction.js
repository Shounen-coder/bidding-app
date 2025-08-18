const { pool } = require('../config/database');
const Product = require('./Product');

class Auction {
  constructor(auctionData) {
    this.id = auctionData.id;
    this.productId = auctionData.product_id;
    this.startTime = auctionData.start_time;
    this.endTime = auctionData.end_time;
    this.currentPrice = auctionData.current_price ? parseFloat(auctionData.current_price) : null;
    this.currentWinnerId = auctionData.current_winner_id;
    this.totalBids = parseInt(auctionData.total_bids) || 0;
    this.status = auctionData.status;
    this.reserveMet = auctionData.reserve_met;
    this.createdAt = auctionData.created_at;
    this.updatedAt = auctionData.updated_at;
  }

  // Get all auctions with product and category info
  static async getAllWithDetails(filters = {}) {
    let whereConditions = ['1=1'];
    let queryParams = [];
    let paramIndex = 1;

    // Build WHERE conditions based on filters
    if (filters.category) {
      whereConditions.push(`c.slug = $${paramIndex}`);
      queryParams.push(filters.category);
      paramIndex++;
    }

    if (filters.subcategory) {
      whereConditions.push(`sc.slug = $${paramIndex}`);
      queryParams.push(filters.subcategory);
      paramIndex++;
    }

    if (filters.status) {
      whereConditions.push(`a.status = $${paramIndex}`);
      queryParams.push(filters.status);
      paramIndex++;
    }

    if (filters.condition) {
      whereConditions.push(`p.condition = $${paramIndex}`);
      queryParams.push(filters.condition);
      paramIndex++;
    }

    if (filters.minPrice) {
      whereConditions.push(`COALESCE(a.current_price, p.starting_price) >= $${paramIndex}`);
      queryParams.push(parseFloat(filters.minPrice));
      paramIndex++;
    }

    if (filters.maxPrice) {
      whereConditions.push(`COALESCE(a.current_price, p.starting_price) <= $${paramIndex}`);
      queryParams.push(parseFloat(filters.maxPrice));
      paramIndex++;
    }

    if (filters.search) {
      whereConditions.push(`(p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }

    // Build ORDER BY clause
    let orderBy = 'a.created_at DESC'; // default
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_low':
          orderBy = 'COALESCE(a.current_price, p.starting_price) ASC';
          break;
        case 'price_high':
          orderBy = 'COALESCE(a.current_price, p.starting_price) DESC';
          break;
        case 'ending_soon':
          orderBy = 'a.end_time ASC';
          break;
        case 'newest':
          orderBy = 'a.created_at DESC';
          break;
        case 'most_bids':
          orderBy = 'a.total_bids DESC';
          break;
      }
    }

    // Build LIMIT and OFFSET for pagination
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    const query = `
      SELECT a.*, p.*, c.name as category_name, c.slug as category_slug, 
             c.icon_name as category_icon, c.color_code as category_color,
             sc.name as subcategory_name, sc.slug as subcategory_slug,
             u.username as seller_username,
             u.first_name as seller_first_name, u.last_name as seller_last_name,
             COUNT(*) OVER() as total_count
      FROM auctions a
      JOIN products p ON a.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      JOIN users u ON p.created_by = u.id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    try {
      const result = await pool.query(query, queryParams);
      
      const auctions = result.rows.map(row => {
        const auction = new Auction(row);
        
        // Add product info
        auction.product = {
          id: row.product_id,
          title: row.title,
          description: row.description,
          startingPrice: parseFloat(row.starting_price),
          reservePrice: row.reserve_price ? parseFloat(row.reserve_price) : null,
          buyNowPrice: row.buy_now_price ? parseFloat(row.buy_now_price) : null,
          condition: row.condition,
          images: row.images || []
        };

        // Add category info
        auction.category = {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
          icon: row.category_icon,
          color: row.category_color
        };

        // Add subcategory if exists
        if (row.subcategory_id) {
          auction.subcategory = {
            id: row.subcategory_id,
            name: row.subcategory_name,
            slug: row.subcategory_slug
          };
        }

        // Add seller info
        auction.seller = {
          username: row.seller_username,
          firstName: row.seller_first_name,
          lastName: row.seller_last_name
        };

        return auction;
      });

      const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;

      return {
        auctions,
        totalCount,
        hasMore: offset + auctions.length < totalCount
      };
    } catch (error) {
      console.error('Get auctions error:', error);
      throw error;
    }
  }

  // Get auction by ID with full details
  static async findByIdWithDetails(id) {
    const query = `
      SELECT a.*, p.*, c.name as category_name, c.slug as category_slug,
             c.icon_name as category_icon, c.color_code as category_color,
             sc.name as subcategory_name, sc.slug as subcategory_slug,
             u.username as seller_username, u.first_name as seller_first_name, 
             u.last_name as seller_last_name, u.email as seller_email
      FROM auctions a
      JOIN products p ON a.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      JOIN users u ON p.created_by = u.id
      WHERE a.id = $1
    `;

    try {
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const auction = new Auction(row);
      
      // Add product info
      auction.product = {
        id: row.product_id,
        title: row.title,
        description: row.description,
        startingPrice: parseFloat(row.starting_price),
        reservePrice: row.reserve_price ? parseFloat(row.reserve_price) : null,
        buyNowPrice: row.buy_now_price ? parseFloat(row.buy_now_price) : null,
        bidIncrement: parseFloat(row.bid_increment),
        condition: row.condition,
        images: row.images || []
      };

      // Add category info
      auction.category = {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        icon: row.category_icon,
        color: row.category_color
      };

      // Add subcategory if exists
      if (row.subcategory_id) {
        auction.subcategory = {
          id: row.subcategory_id,
          name: row.subcategory_name,
          slug: row.subcategory_slug
        };
      }

      // Add seller info
      auction.seller = {
        username: row.seller_username,
        firstName: row.seller_first_name,
        lastName: row.seller_last_name,
        email: row.seller_email
      };

      //Fetch bid history
    auction.bids = await Auction.findBidsByAuctionId(id);

      return auction;
    } catch (error) {
      console.error('Get auction by ID error:', error);
      throw error;
    }
  }

  // Create new auction
  static async create(auctionData) {
    const {
      productId,
      startTime,
      endTime,
      status = 'scheduled'
    } = auctionData;

    try {
      const query = `
        INSERT INTO auctions (product_id, start_time, end_time, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const values = [productId, startTime, endTime, status];
      const result = await pool.query(query, values);
      
      return new Auction(result.rows[0]);
    } catch (error) {
      console.error('Auction creation error:', error);
      throw error;
    }
  }

  // Fetch bid history for an auction
static async findBidsByAuctionId(auctionId) {
  const query = `
    SELECT b.*, u.username, u.first_name, u.last_name, u.email
    FROM bids b
    JOIN users u ON b.bidder_id = u.id
    WHERE b.auction_id = $1
    ORDER BY b.bid_time DESC
    LIMIT 20
  `;
  
  try {
    const result = await pool.query(query, [auctionId]);
    return result.rows.map(row => ({
      id: row.id,
      auctionId: row.auction_id,
      bidderId: row.bidder_id,
      amount: parseFloat(row.amount),
      bidTime: row.bid_time,
      status: row.status,
      isAutoBid: row.is_auto_bid || false,
      bidder: {
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email
      }
    }));
  } catch (error) {
    console.error('Error fetching bids:', error);
    throw error;
  }
}

// Get users watching this auction
static async findWatchersByAuctionId(auctionId) {
  const query = `
    SELECT w.*, u.username, u.first_name, u.last_name
    FROM watchlists w
    JOIN users u ON w.user_id = u.id
    WHERE w.auction_id = $1
    ORDER BY w.created_at DESC
  `;
  
  try {
    const result = await pool.query(query, [auctionId]);
    return result.rows.map(row => ({
      userId: row.user_id,
      auctionId: row.auction_id,
      addedAt: row.created_at,
      user: {
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name
      }
    }));
  } catch (error) {
    console.error('Error fetching watchers:', error);
    return []; // Don't break if watchlist table doesn't exist yet
  }
}

// Helper methods for computed properties
getTimeRemaining() {
  if (this.status !== 'active') return null;
  
  const now = new Date();
  const endTime = new Date(this.endTime);
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) return null;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, totalMs: diff };
}

getNextMinBid() {
  const currentBid = this.currentPrice || this.product?.startingPrice || 0;
  const increment = this.product?.bidIncrement || 1;
  return currentBid + increment;
}

// Get bids since a specific timestamp (for incremental updates)
static async findBidsSince(auctionId, sinceTimestamp) {
  const query = `
    SELECT b.*, u.username, u.first_name, u.last_name, u.email
    FROM bids b
    JOIN users u ON b.bidder_id = u.id
    WHERE b.auction_id = $1 AND b.bid_time > $2
    ORDER BY b.bid_time DESC
  `;
  
  try {
    const result = await pool.query(query, [auctionId, sinceTimestamp]);
    return result.rows.map(row => ({
      id: row.id,
      auctionId: row.auction_id,
      bidderId: row.bidder_id,
      amount: parseFloat(row.amount),
      bidTime: row.bid_time,
      status: row.status,
      isAutoBid: row.is_auto_bid || false,
      bidder: {
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email
      }
    }));
  } catch (error) {
    console.error('Error fetching bids since timestamp:', error);
    throw error;
  }
}


toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      startTime: this.startTime,
      endTime: this.endTime,
      currentPrice: this.currentPrice,
      currentWinnerId: this.currentWinnerId,
      totalBids: this.totalBids,
      status: this.status,
      reserveMet: this.reserveMet,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,

      //Include all related data
      product: this.product,
      category: this.category,
      subcategory: this.subcategory,
      seller: this.seller,
      bids: this.bids || [],

      //Add computed properties for frontend convenience
      timeRemaining: this.getTimeRemaining(),
      isActive: this.status === 'active',
      hasReserve: this.product?.reservePrice > 0,
      nextMinBid: this.getNextMinBid()
    };
  }
}

module.exports = Auction;
