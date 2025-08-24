// backend/src/models/Auction.js (Enhanced with seller features)
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
    
    // NEW: Add seller-specific properties
    this.sellerId = auctionData.seller_id || auctionData.created_by;
    this.sellerTier = auctionData.seller_tier;
    this.viewCount = parseInt(auctionData.view_count) || 0;
    this.watchCount = parseInt(auctionData.watch_count) || 0;
    this.bidCount = parseInt(auctionData.bid_count) || 0;
    this.isFeatured = auctionData.is_featured || false;
    this.featuredUntil = auctionData.featured_until;
  }

  // ✅ PRESERVED: Helper function for status filtering
  static buildStatusCondition(status) {
    switch (status) {
      case 'active':
        return "AND a.end_time > NOW() AND a.status = 'active'";
      case 'ended':
        return "AND a.end_time <= NOW()";
      case 'scheduled':
        return "AND a.start_time > NOW() AND a.status = 'scheduled'";
      case 'all':
        return '';
      default:
        return "AND a.end_time > NOW() AND a.status = 'active'";
    }
  }

  // ✅ PRESERVED: Get all auctions with product and category info (Enhanced with seller data)
  static async getAllWithDetails(filters = {}) {
    let whereConditions = ['1=1'];
    let queryParams = [];
    let paramIndex = 1;

    // ✅ PRESERVED: Add status filtering first
    const statusCondition = this.buildStatusCondition(filters.status);
    if (statusCondition) {
      whereConditions.push(statusCondition.replace('AND ', ''));
    }

    // ✅ PRESERVED: Build WHERE conditions based on filters
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

    // NEW: Add seller-specific filters
    if (filters.sellerId) {
      whereConditions.push(`p.created_by = $${paramIndex}`);
      queryParams.push(filters.sellerId);
      paramIndex++;
    }

    if (filters.sellerTier) {
      whereConditions.push(`a.seller_tier = $${paramIndex}`);
      queryParams.push(filters.sellerTier);
      paramIndex++;
    }

    // ✅ PRESERVED: Build ORDER BY clause
    let orderBy = 'a.created_at DESC';
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
        // NEW: Add view-based sorting
        case 'most_viewed':
          orderBy = 'a.view_count DESC';
          break;
        case 'most_watched':
          orderBy = 'a.watch_count DESC';
          break;
      }
    }

    // ✅ PRESERVED: Build LIMIT and OFFSET for pagination
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    // ENHANCED: Updated query to include seller data and new fields
    // const query = `
    //   SELECT a.*, p.*, c.name as category_name, c.slug as category_slug,
    //          c.icon_name as category_icon, c.color_code as category_color,
    //          sc.name as subcategory_name, sc.slug as subcategory_slug,
    //          u.username as seller_username, u.first_name as seller_first_name, 
    //          u.last_name as seller_last_name,
    //          sp.tier as seller_tier, sp.average_rating as seller_rating,
    //          COUNT(*) OVER() as total_count
    //   FROM auctions a
    //   JOIN products p ON a.product_id = p.id
    //   JOIN categories c ON p.category_id = c.id
    //   LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    //   JOIN users u ON p.created_by = u.id
    //   LEFT JOIN seller_profiles sp ON u.id = sp.user_id
    //   WHERE ${whereConditions.join(' AND ')}
    //   ORDER BY ${orderBy}
    //   LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    // `;

   // Replace the existing query with this corrected version:
  const query = `
    SELECT 
      a.id as auction_id,                    -- ✅ Explicit auction ID
      a.product_id,                          -- ✅ Foreign key to products
      a.start_time,
      a.end_time,
      a.status,
      a.current_price,
      a.current_winner_id,
      a.total_bids,
      a.reserve_met,
      a.created_at,
      a.updated_at,
      a.seller_tier,
      a.view_count,
      a.watch_count,
      a.bid_count,
      p.id as product_pk_id,                -- ✅ Product primary key  
      p.title, 
      p.description,
      p.starting_price,
      p.reserve_price,
      p.buy_now_price,
      p.bid_increment,
      p.condition, 
      p.images,
      c.id as category_id,
      c.name as category_name, 
      c.slug as category_slug,
      c.icon_name as category_icon, 
      c.color_code as category_color,
      sc.id as subcategory_id,
      sc.name as subcategory_name, 
      sc.slug as subcategory_slug,
      u.id as seller_user_id,               -- ✅ User ID for seller
      u.username as seller_username, 
      u.first_name as seller_first_name,
      u.last_name as seller_last_name,
      sp.tier as seller_tier, 
      sp.average_rating as seller_rating,
      COUNT(*) OVER() as total_count
    FROM auctions a
    JOIN products p ON a.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id AND sc.parent_category_id = c.id
    JOIN users u ON p.created_by = u.id
    LEFT JOIN seller_profiles sp ON u.id = sp.user_id
    WHERE ${whereConditions.join(' AND ')}
    ORDER BY ${orderBy}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  queryParams.push(limit, offset);

  try {
    const result = await pool.query(query, queryParams);
    const auctions = result.rows.map(row => {
      // ✅ FIXED: Use explicit column names
      const auctionData = {
        id: row.auction_id,
        product_id: row.product_id,        
        start_time: row.start_time,
        end_time: row.end_time,
        status: row.status,
        current_price: row.current_price,
        current_winner_id: row.current_winner_id,
        total_bids: row.total_bids,
        reserve_met: row.reserve_met,
        created_at: row.created_at,
        updated_at: row.updated_at,
        seller_tier: row.seller_tier,
        view_count: row.view_count,
        watch_count: row.watch_count,
        bid_count: row.bid_count
      };

      const auction = new Auction(auctionData);

      // ✅ VERIFY: Debug the correct mapping
      console.log('🔧 FIXED getAllWithDetails mapping:', {
        auctionId: auction.id,              // Should be correct auction ID
        productId: auction.productId,       // Should be product ID
      });

      // ✅ PRESERVED: Add product info
      auction.product = {
        id: row.product_id,
        title: row.title,
        description: row.description,
        startingPrice: parseFloat(row.starting_price),
        reservePrice: row.reserve_price ? parseFloat(row.reserve_price) : null,
        buyNowPrice: row.buy_now_price ? parseFloat(row.buy_now_price) : null,
        bidIncrement: parseFloat(row.bid_increment),
        condition: row.condition,
        images: row.images || [],
        createdBy: row.seller_user_id       // ✅ Add createdBy
      };

      // ✅ PRESERVED: Add category info
      auction.category = {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        icon: row.category_icon,
        color: row.category_color
      };

      // ✅ PRESERVED: Add subcategory if exists
      if (row.subcategory_id) {
        auction.subcategory = {
          id: row.subcategory_id,
          name: row.subcategory_name,
          slug: row.subcategory_slug
        };
      }

      // ENHANCED: Add seller info with tier and rating
      auction.seller = {
        id: row.seller_user_id,             // ✅ Add seller ID
        username: row.seller_username,
        firstName: row.seller_first_name,
        lastName: row.seller_last_name,
        tier: row.seller_tier || 'basic',
        rating: row.seller_rating ? parseFloat(row.seller_rating) : null
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

  // ✅ PRESERVED: Get auction by ID with full details (Enhanced with seller data)
  // ✅ PRESERVED: Get auction by ID with full details (Enhanced with debugging)
// static async findByIdWithDetails(id) {
//   try {
//     console.log('🔍 Searching for auction ID:', id);
    
//     // STEP 1: Check if auction exists at all
//     const basicCheck = await pool.query('SELECT * FROM auctions WHERE id = $1', [id]);
//     console.log('📊 Basic auction check result:', basicCheck.rows.length, basicCheck.rows[0]?.status);
    
//     if (basicCheck.rows.length === 0) {
//       console.log('❌ No auction found with ID:', id);
//       return null;
//     }
    
//     // STEP 2: Check if product exists
//     const productCheck = await pool.query('SELECT * FROM products WHERE id = $1', [basicCheck.rows[0].product_id]);
//     console.log('📦 Product check result:', productCheck.rows.length, productCheck.rows[0]?.title);
    
//     // STEP 3: Check if user exists
//     const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [productCheck.rows[0].created_by]);
//     console.log('👤 User check result:', userCheck.rows.length, userCheck.rows[0]?.username);
    
//     // STEP 4: Full detailed query
//     const query = `
//       SELECT a.*, p.*, c.name as category_name, c.slug as category_slug,
//       c.icon_name as category_icon, c.color_code as category_color,
//       sc.name as subcategory_name, sc.slug as subcategory_slug,
//       u.username as seller_username, u.first_name as seller_first_name,
//       u.last_name as seller_last_name, u.email as seller_email,
//       sp.tier as seller_tier, sp.average_rating as seller_rating,
//       sp.total_auctions as seller_total_auctions
//       FROM auctions a
//       JOIN products p ON a.product_id = p.id
//       JOIN categories c ON p.category_id = c.id
//       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id AND sc.parent_category_id = c.id
//       JOIN users u ON p.created_by = u.id
//       LEFT JOIN seller_profiles sp ON u.id = sp.user_id
//       WHERE a.id = $1
//     `;

//     const result = await pool.query(query, [id]);
//     console.log('🔗 Complex query result:', result.rows.length);
    
//     if (result.rows.length === 0) {
//       console.log('❌ No auction found with details for ID:', id);
//       return null;
//     }

//     const row = result.rows[0];
//     console.log('✅ Found auction:', row.title); // Add debug log
    
//     const auction = new Auction(row);

//     // ✅ PRESERVED: Add product info
//     auction.product = {
//       id: row.product_id,
//       title: row.title,
//       description: row.description,
//       startingPrice: parseFloat(row.starting_price),
//       reservePrice: row.reserve_price ? parseFloat(row.reserve_price) : null,
//       buyNowPrice: row.buy_now_price ? parseFloat(row.buy_now_price) : null,
//       bidIncrement: parseFloat(row.bid_increment),
//       condition: row.condition,
//       images: row.images || []
//     };

//     // ✅ PRESERVED: Add category info
//     auction.category = {
//       id: row.category_id,
//       name: row.category_name,
//       slug: row.category_slug,
//       icon: row.category_icon,
//       color: row.category_color
//     };

//     // ✅ PRESERVED: Add subcategory if exists
//     if (row.subcategory_id) {
//       auction.subcategory = {
//         id: row.subcategory_id,
//         name: row.subcategory_name,
//         slug: row.subcategory_slug
//       };
//     }

//     // ENHANCED: Add seller info with tier data
//     auction.seller = {
//       username: row.seller_username,
//       firstName: row.seller_first_name,
//       lastName: row.seller_last_name,
//       email: row.seller_email,
//       tier: row.seller_tier || 'basic',
//       rating: row.seller_rating ? parseFloat(row.seller_rating) : null,
//       totalAuctions: row.seller_total_auctions || 0
//     };

//     // ✅ PRESERVED: Fetch bid history
//     auction.bids = await Auction.findBidsByAuctionId(id);

//     return auction;
//   } catch (error) {
//     console.error('Get auction by ID error:', error);
//     throw error;
//   }
// }
// ✅ PRESERVED: Get auction by ID with full details (FIXED with explicit aliases)
static async findByIdWithDetails(id) {
  try {
    console.log('🔍 Searching for auction ID:', id);
    
    // STEP 1: Check if auction exists at all
    const basicCheck = await pool.query('SELECT * FROM auctions WHERE id = $1', [id]);
    console.log('📊 Basic auction check result:', basicCheck.rows.length, basicCheck.rows[0]?.status);
    
    if (basicCheck.rows.length === 0) {
      console.log('❌ No auction found with ID:', id);
      return null;
    }

    // STEP 2: Check if product exists
    const productCheck = await pool.query('SELECT * FROM products WHERE id = $1', [basicCheck.rows[0].product_id]);
    console.log('📦 Product check result:', productCheck.rows.length, productCheck.rows[0]?.title);
    
    // STEP 3: Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [productCheck.rows[0].created_by]);
    console.log('👤 User check result:', userCheck.rows.length, userCheck.rows[0]?.username);

    // STEP 4: ✅ FIXED: Full detailed query with explicit aliases
    const query = `
      SELECT 
        a.id as auction_id,                    -- ✅ Explicit auction ID
        a.product_id, 
        a.start_time, 
        a.end_time, 
        a.status, 
        a.current_price,
        a.current_winner_id,
        a.total_bids,
        a.reserve_met,
        a.created_at, 
        a.updated_at,
        a.seller_tier,
        a.view_count,
        a.watch_count,
        a.bid_count,
        p.id as product_pk_id,                -- ✅ Product primary key
        p.title, 
        p.description, 
        p.starting_price,
        p.reserve_price,
        p.buy_now_price,
        p.bid_increment,
        p.condition, 
        p.images,
        c.id as category_id,
        c.name as category_name, 
        c.slug as category_slug,
        c.icon_name as category_icon, 
        c.color_code as category_color,
        sc.id as subcategory_id,
        sc.name as subcategory_name, 
        sc.slug as subcategory_slug,
        u.id as user_id,
        u.username as seller_username, 
        u.first_name as seller_first_name,
        u.last_name as seller_last_name, 
        u.email as seller_email,
        sp.tier as seller_tier, 
        sp.average_rating as seller_rating,
        sp.total_auctions as seller_total_auctions
      FROM auctions a
      JOIN products p ON a.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id AND sc.parent_category_id = c.id
      JOIN users u ON p.created_by = u.id
      LEFT JOIN seller_profiles sp ON u.id = sp.user_id
      WHERE a.id = $1
    `;

    const result = await pool.query(query, [id]);
    console.log('🔗 Complex query result:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('❌ No auction found with details for ID:', id);
      return null;
    }

    const row = result.rows[0];
    console.log('✅ Found auction:', row.title);

    // ✅ FIXED: Use explicit column names
    const auctionData = {
      id: row.auction_id,                     // ✅ Use auction_id (16)
      product_id: row.product_id,             // ✅ Use product_id (22)
      start_time: row.start_time,
      end_time: row.end_time,
      status: row.status,
      current_price: row.current_price,
      current_winner_id: row.current_winner_id,
      total_bids: row.total_bids,
      reserve_met: row.reserve_met,
      created_at: row.created_at,
      updated_at: row.updated_at,
      seller_tier: row.seller_tier,
      view_count: row.view_count,
      watch_count: row.watch_count,
      bid_count: row.bid_count
    };

    const auction = new Auction(auctionData);

    // ✅ VERIFY: Debug the correct mapping
    console.log('🔧 FIXED findByIdWithDetails mapping:', {
      auctionId: auction.id,        // Should be 16
      productId: auction.productId, // Should be 22
    });

    // ✅ PRESERVED: Add product info
    auction.product = {
      id: row.product_id,           // ✅ Use product_id (22) for internal use
      title: row.title,
      description: row.description,
      startingPrice: parseFloat(row.starting_price),
      reservePrice: row.reserve_price ? parseFloat(row.reserve_price) : null,
      buyNowPrice: row.buy_now_price ? parseFloat(row.buy_now_price) : null,
      bidIncrement: parseFloat(row.bid_increment),
      condition: row.condition,
      images: row.images || [],
      createdBy: row.user_id 
    };

    // ✅ PRESERVED: Add category info
    auction.category = {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
      icon: row.category_icon,
      color: row.category_color
    };

    // ✅ PRESERVED: Add subcategory if exists
    if (row.subcategory_id) {
      auction.subcategory = {
        id: row.subcategory_id,
        name: row.subcategory_name,
        slug: row.subcategory_slug
      };
    }

    // ENHANCED: Add seller info with tier data
    auction.seller = {
      id: row.user_id,
      username: row.seller_username,
      firstName: row.seller_first_name,
      lastName: row.seller_last_name,
      email: row.seller_email,
      tier: row.seller_tier || 'basic',
      rating: row.seller_rating ? parseFloat(row.seller_rating) : null,
      totalAuctions: row.seller_total_auctions || 0
    };

    // ✅ PRESERVED: Fetch bid history
    auction.bids = await Auction.findBidsByAuctionId(id);

    return auction;
  } catch (error) {
    console.error('Get auction by ID error:', error);
    throw error;
  }
}



  // ✅ PRESERVED: Create new auction (Enhanced with seller validation)
  static async create(auctionData) {
    const {
      productId,
      startTime,
      endTime,
      status = 'scheduled',
      sellerId, // NEW: Required for seller validation
      sellerTier = 'basic' // NEW: Store seller tier at creation
    } = auctionData;

    try {
      // NEW: Validate seller tier restrictions if sellerId provided
      if (sellerId) {
        await this.validateSellerLimits(sellerId, auctionData);
      }

      const query = `
        INSERT INTO auctions (product_id, start_time, end_time, status, seller_tier, view_count, watch_count, bid_count)
        VALUES ($1, $2, $3, $4, $5, 0, 0, 0)
        RETURNING *
      `;
      const values = [productId, startTime, endTime, status, sellerTier];
      const result = await pool.query(query, values);
      return new Auction(result.rows[0]);
    } catch (error) {
      console.error('Auction creation error:', error);
      throw error;
    }
  }

  // NEW: Validate seller tier restrictions
  static async validateSellerLimits(sellerId, auctionData) {
    try {
      // Get seller profile
      const sellerQuery = await pool.query(
        'SELECT tier FROM seller_profiles WHERE user_id = $1',
        [sellerId]
      );

      if (sellerQuery.rows.length === 0) {
        throw new Error('Seller profile not found');
      }

      const { tier } = sellerQuery.rows[0];

      // Define tier limits
      const tierLimits = {
        basic: { maxValue: 200, maxActive: 2, features: ['basic'] },
        verified: { maxValue: 1000, maxActive: 5, features: ['basic', 'buy_now'] },
        trusted: { maxValue: 5000, maxActive: 10, features: ['basic', 'buy_now', 'reserve'] }
      };

      const limits = tierLimits[tier];

      // Get product details to check starting price
      const productQuery = await pool.query(
        'SELECT starting_price, buy_now_price, reserve_price FROM products WHERE id = $1',
        [auctionData.productId]
      );

      if (productQuery.rows.length === 0) {
        throw new Error('Product not found');
      }

      const product = productQuery.rows[0];

      // Validate auction value
      if (parseFloat(product.starting_price) > limits.maxValue) {
        throw new Error(`${tier} sellers can only list items up to $${limits.maxValue}`);
      }

      // Check active auction count
      const activeCountQuery = await pool.query(`
        SELECT COUNT(*) FROM auctions a
        JOIN products p ON a.product_id = p.id
        WHERE p.created_by = $1 AND a.status IN ('active', 'scheduled')
      `, [sellerId]);

      const activeCount = parseInt(activeCountQuery.rows[0].count);
      if (activeCount >= limits.maxActive) {
        throw new Error(`${tier} sellers can only have ${limits.maxActive} active auctions`);
      }

      // Validate tier-specific features
      if (product.buy_now_price && !limits.features.includes('buy_now')) {
        throw new Error('Buy Now option requires Verified tier or higher');
      }

      if (product.reserve_price && !limits.features.includes('reserve')) {
        throw new Error('Reserve price requires Trusted tier');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // NEW: Get seller's auctions with enhanced filtering
  // NEW: Get seller's auctions with enhanced filtering
static async getSellerAuctions(sellerId, filters = {}) {
  try {
    let whereConditions = ['p.created_by = $1'];
    let queryParams = [sellerId];
    let paramIndex = 2;
    
    // Add status filter
    if (filters.status && filters.status !== 'all') {
      const statusCondition = this.buildStatusCondition(filters.status);
      if (statusCondition) {
        whereConditions.push(statusCondition.replace('AND ', ''));
      }
    }

    // Add category filter
    if (filters.category) {
      whereConditions.push(`p.category_id = $${paramIndex}`);
      queryParams.push(filters.category);
      paramIndex++;
    }

    // Build ORDER BY
    let orderBy = 'a.created_at DESC';
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'ending_soon':
          orderBy = 'a.end_time ASC';
          break;
        case 'most_bids':
          orderBy = 'a.total_bids DESC';
          break;
        case 'most_viewed':
          orderBy = 'a.view_count DESC';
          break;
      }
    }

    // Pagination
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    
    // ✅ FIXED: Explicit column names to avoid conflicts
    const query = `
      SELECT 
        a.id as auction_id,              -- ✅ Explicit auction ID
        a.product_id,                    -- ✅ Foreign key to products
        a.start_time,
        a.end_time, 
        a.status,
        a.current_price,
        a.total_bids,
        a.view_count,
        a.created_at,
        a.updated_at,
        a.seller_tier,
        p.id as product_pk_id,           -- ✅ Product primary key (for reference)
        p.title,
        p.description,
        p.starting_price,
        p.condition,
        p.images,
        c.id as category_id,
        c.name as category_name,
        COALESCE(bid_stats.bid_count, 0) as total_bids,
        COALESCE(watch_stats.watch_count, 0) as total_watchers
      FROM auctions a
      JOIN products p ON a.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN (
        SELECT auction_id, COUNT(*) as bid_count
        FROM bids GROUP BY auction_id
      ) bid_stats ON a.id = bid_stats.auction_id
      LEFT JOIN (
        SELECT auction_id, COUNT(*) as watch_count
        FROM watchlists GROUP BY auction_id
      ) watch_stats ON a.id = watch_stats.auction_id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const result = await pool.query(query, queryParams);

    return result.rows.map(row => {
      // ✅ FIXED: Use explicit column names
      const auctionData = {
        id: row.auction_id,              // ✅ Use auction_id column (16)
        product_id: row.product_id,      // ✅ Use product_id column (22)
        start_time: row.start_time,
        end_time: row.end_time,
        status: row.status,
        current_price: row.current_price,
        total_bids: row.total_bids,
        view_count: row.view_count,
        created_at: row.created_at,
        updated_at: row.updated_at,
        seller_tier: row.seller_tier
      };
      
      const auction = new Auction(auctionData);
      
      // ✅ VERIFY: These should now be correct
      console.log('🔧 FIXED Backend mapping:', {
        auctionId: auction.id,        // Should be 16
        productId: auction.productId, // Should be 22  
      });

      auction.product = {
        id: row.product_id,           // ✅ Product ID for internal use
        title: row.title,
        description: row.description,
        startingPrice: parseFloat(row.starting_price),
        currentPrice: row.current_price ? parseFloat(row.current_price) : null,
        condition: row.condition,
        images: row.images || []
      };

      auction.category = {
        id: row.category_id,
        name: row.category_name
      };

      // FIX: Map the computed values
      auction.startingPrice = parseFloat(row.starting_price);
      auction.currentPrice = row.current_price ? parseFloat(row.current_price) : null;
      auction.totalBids = parseInt(row.total_bids) || 0;
      auction.totalWatchers = parseInt(row.total_watchers) || 0;
      auction.viewCount = parseInt(row.view_count) || 0;

      return auction;
    });
  } catch (error) {
    throw new Error('Error getting seller auctions: ' + error.message);
  }
}


  // NEW: Update auction view count
  static async incrementViewCount(auctionId, uniqueViewer = false) {
    try {
      // Update auction view count
      await pool.query(
        'UPDATE auctions SET view_count = view_count + 1 WHERE id = $1',
        [auctionId]
      );

      // Update daily analytics
      const today = new Date().toISOString().split('T')[0];
      await pool.query(`
        INSERT INTO auction_analytics (auction_id, date, daily_views, unique_viewers)
        VALUES ($1, $2, 1, $3)
        ON CONFLICT (auction_id, date)
        DO UPDATE SET 
          daily_views = auction_analytics.daily_views + 1,
          unique_viewers = auction_analytics.unique_viewers + $3
      `, [auctionId, today, uniqueViewer ? 1 : 0]);
    } catch (error) {
      // Don't throw error for analytics - log it instead
      console.error('Error updating view count:', error);
    }
  }

  // NEW: Get auction analytics for seller
  static async getAuctionAnalytics(auctionId) {
    try {
      const query = `
        SELECT 
          date,
          daily_views,
          daily_watchers,
          daily_bids,
          unique_viewers
        FROM auction_analytics 
        WHERE auction_id = $1 
        ORDER BY date DESC 
        LIMIT 30
      `;
      
      const result = await pool.query(query, [auctionId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting auction analytics:', error);
      return [];
    }
  }

  // ✅ PRESERVED: Fetch bid history for an auction
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

  // ✅ PRESERVED: Get users watching this auction
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
      return [];
    }
  }

  // ✅ PRESERVED: Helper methods for computed properties
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

  // ✅ PRESERVED: Get bids since a specific timestamp
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

  // ENHANCED: toJSON method with new seller data
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
      
      // NEW: Seller-specific fields
      sellerId: this.sellerId,
      sellerTier: this.sellerTier,
      viewCount: this.viewCount,
      watchCount: this.watchCount,
      bidCount: this.bidCount,
      isFeatured: this.isFeatured,
      featuredUntil: this.featuredUntil,
      
      // ✅ PRESERVED: Include all related data
      product: this.product,
      category: this.category,
      subcategory: this.subcategory,
      seller: this.seller,
      bids: this.bids || [],
      
      // ✅ PRESERVED: Add computed properties for frontend convenience
      timeRemaining: this.getTimeRemaining(),
      isActive: this.status === 'active',
      hasReserve: this.product?.reservePrice > 0,
      nextMinBid: this.getNextMinBid()
    };
  }
}

module.exports = Auction;
