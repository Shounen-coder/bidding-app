// backend/src/controllers/sellerController.js
const SellerProfile = require('../models/SellerProfile');
const Auction = require('../models/Auction');
const { pool } = require('../config/database');

// Get seller profile with tier progress
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const tierData = await SellerProfile.getTierProgress(userId);
    
    res.json({
      success: true,
      data: tierData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new auction with tier validation
// exports.createAuction = async (req, res) => {
//   try {
//     const sellerId = req.user.id;
//     const {
//       title,
//       description,
//       category_id,
//       subcategory_id,
//       starting_price,
//       reserve_price,
//       buy_now_price,
//       bid_increment,
//       condition,
//       images,
//       start_time,
//       end_time
//     } = req.body;

//     // Validate required fields
//     const requiredFields = ['title', 'description', 'category_id', 'starting_price', 'end_time'];
//     for (const field of requiredFields) {
//       if (!req.body[field]) {
//         return res.status(400).json({
//           success: false,
//           message: `${field} is required`
//         });
//       }
//     }

//     // Start transaction
//     const client = await pool.connect();
    
//     try {
//       await client.query('BEGIN');

//       // First create the product
//       const productQuery = await client.query(`
//         INSERT INTO products (
//           title, description, category_id, subcategory_id, 
//           starting_price, reserve_price, buy_now_price, 
//           bid_increment, condition, images, created_by
//         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
//         RETURNING *
//       `, [
//         title, description, category_id, subcategory_id,
//         starting_price, reserve_price, buy_now_price,
//         bid_increment || 1, condition, images || [], sellerId
//       ]);

//       const product = productQuery.rows[0];

//       // Get seller tier for validation
//       const sellerProfile = await SellerProfile.getOrCreateProfile(sellerId);

//       // Create auction with validation
//       const auctionData = {
//         productId: product.id,
//         startTime: start_time || new Date(),
//         endTime: end_time,
//         status: start_time && new Date(start_time) > new Date() ? 'scheduled' : 'active',
//         sellerId: sellerId,
//         sellerTier: sellerProfile.tier
//       };

//       const auction = await Auction.create(auctionData);

//       await client.query('COMMIT');

//       // Return success response
//       res.status(201).json({
//         success: true,
//         message: 'Auction created successfully',
//         data: {
//           auction: {
//             id: auction.id,
//             productId: auction.productId,
//             title: product.title,
//             startingPrice: parseFloat(product.starting_price),
//             status: auction.status,
//             startTime: auction.startTime,
//             endTime: auction.endTime
//           }
//         }
//       });

//     } catch (error) {
//       await client.query('ROLLBACK');
//       throw error;
//     } finally {
//       client.release();
//     }

//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
// backend/src/controllers/sellerController.js
// Replace the createAuction function with this version:

exports.createAuction = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const {
      title,
      description,
      category_id,
      subcategory_id,
      starting_price,
      reserve_price,
      buy_now_price,
      bid_increment,
      condition,
      images,
      start_time,
      end_time
    } = req.body;

    // Validate required fields
    const requiredFields = ['title', 'description', 'category_id', 'starting_price', 'end_time'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Get seller profile for validation BEFORE creating product
    const SellerProfile = require('../models/SellerProfile');
    const sellerProfile = await SellerProfile.getOrCreateProfile(sellerId);

    // Define tier limits for validation
    const tierLimits = {
      basic: { maxValue: 200, maxActive: 2, features: ['basic'] },
      verified: { maxValue: 1000, maxActive: 5, features: ['basic', 'buy_now'] },
      trusted: { maxValue: 5000, maxActive: 10, features: ['basic', 'buy_now', 'reserve'] }
    };

    const limits = tierLimits[sellerProfile.tier];

    // Validate auction value BEFORE creating anything
    if (parseFloat(starting_price) > limits.maxValue) {
      return res.status(400).json({
        success: false,
        message: `${sellerProfile.tier} sellers can only list items up to $${limits.maxValue}`
      });
    }

    // Check active auction count
    const activeCountQuery = await pool.query(`
      SELECT COUNT(*) FROM auctions a
      JOIN products p ON a.product_id = p.id
      WHERE p.created_by = $1 AND a.status IN ('active', 'scheduled')
    `, [sellerId]);

    const activeCount = parseInt(activeCountQuery.rows[0].count);
    if (activeCount >= limits.maxActive) {
      return res.status(400).json({
        success: false,
        message: `${sellerProfile.tier} sellers can only have ${limits.maxActive} active auctions`
      });
    }

    // Validate tier-specific features
    if (buy_now_price && !limits.features.includes('buy_now')) {
      return res.status(400).json({
        success: false,
        message: 'Buy Now option requires Verified tier or higher'
      });
    }

    if (reserve_price && !limits.features.includes('reserve')) {
      return res.status(400).json({
        success: false,
        message: 'Reserve price requires Trusted tier'
      });
    }

    // Start transaction AFTER validation
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create the product
      const productQuery = await client.query(`
        INSERT INTO products (
          title, description, category_id, subcategory_id, 
          starting_price, reserve_price, buy_now_price, 
          bid_increment, condition, images, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        title, 
        description, 
        category_id, 
        subcategory_id,
        starting_price, 
        reserve_price, 
        buy_now_price,
        bid_increment || 1, 
        condition, 
        images || [], // Pass array directly
        sellerId
      ]);

      const product = productQuery.rows[0];

      // Create auction WITHOUT validation (since we already validated)
      const auctionQuery = await client.query(`
        INSERT INTO auctions (product_id, start_time, end_time, status, seller_tier, view_count, watch_count, bid_count)
        VALUES ($1, $2, $3, $4, $5, 0, 0, 0)
        RETURNING *
      `, [
        product.id,
        start_time || new Date(),
        end_time,
        start_time && new Date(start_time) > new Date() ? 'scheduled' : 'active',
        sellerProfile.tier
      ]);

      const auction = auctionQuery.rows[0];

      await client.query('COMMIT');

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Auction created successfully',
        data: {
          auction: {
            id: auction.id,
            productId: auction.product_id,
            title: product.title,
            startingPrice: parseFloat(product.starting_price),
            status: auction.status,
            startTime: auction.start_time,
            endTime: auction.end_time,
            images: product.images || [],
            sellerTier: auction.seller_tier
          }
        }
      });

      //added debug
      console.log('🎉 Created auction with ID:', auction.id);


    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Create auction error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Get seller's auctions with filtering and pagination
exports.getSellerAuctions = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { status = 'all', category, page = 1, limit = 10, sortBy } = req.query;
    
    const filters = {
      status,
      category,
      sortBy,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    const auctions = await Auction.getSellerAuctions(sellerId, filters);
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) FROM auctions a
      JOIN products p ON a.product_id = p.id
      WHERE p.created_by = $1
    `;
    const countParams = [sellerId];
    
    if (status && status !== 'all') {
      const statusCondition = Auction.buildStatusCondition(status);
      if (statusCondition) {
        countQuery += ' ' + statusCondition;
      }
    }
    
    if (category) {
      countQuery += ` AND p.category_id = $${countParams.length + 1}`;
      countParams.push(category);
    }
    
    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].count);
    
    res.json({
      success: true,
      data: {
        auctions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get seller analytics
exports.getAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { days = 30 } = req.query;
    
    const analyticsData = await SellerProfile.getAnalytics(sellerId, days);
    
    res.json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get seller earnings (mock data for now)
exports.getEarnings = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { status = 'all', period = '30' } = req.query;
    
    // Mock earnings data since we don't have real payment integration
    const mockEarnings = [
      {
        id: 1,
        auction_title: 'Vintage Camera',
        gross_amount: 150.00,
        platform_fee: 15.00,
        net_amount: 135.00,
        payment_status: 'paid',
        payment_hold_until: new Date(Date.now() - 86400000), // Yesterday
        created_at: new Date(Date.now() - 172800000), // 2 days ago
        availability_status: 'available'
      },
      {
        id: 2,
        auction_title: 'Smartphone',
        gross_amount: 300.00,
        platform_fee: 30.00,
        net_amount: 270.00,
        payment_status: 'pending',
        payment_hold_until: new Date(Date.now() + 432000000), // 5 days from now
        created_at: new Date(Date.now() - 86400000), // Yesterday
        availability_status: 'on_hold'
      }
    ];

    // Filter based on status
    let filteredEarnings = mockEarnings;
    if (status !== 'all') {
      filteredEarnings = mockEarnings.filter(e => e.payment_status === status);
    }

    // Mock summary
    const mockSummary = {
      total_gross: 450.00,
      total_fees: 45.00,
      total_net: 405.00,
      available_amount: 135.00,
      on_hold_amount: 270.00
    };
    
    res.json({
      success: true,
      data: {
        earnings: filteredEarnings,
        summary: mockSummary
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get categories for auction creation
// exports.getCategories = async (req, res) => {
//   try {
//     const categoriesQuery = await pool.query(`
//       SELECT c.id, c.name, c.slug, c.icon_name, c.color_code,
//              json_agg(
//                json_build_object(
//                  'id', sc.id,
//                  'name', sc.name,
//                  'slug', sc.slug
//                )
//              ) FILTER (WHERE sc.id IS NOT NULL) as subcategories
//       FROM categories c
//       LEFT JOIN subcategories sc ON c.id = sc.category_id
//       GROUP BY c.id, c.name, c.slug, c.icon_name, c.color_code
//       ORDER BY c.name
//     `);

//     res.json({
//       success: true,
//       data: {
//         categories: categoriesQuery.rows
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// Replace the existing getCategories function with this corrected version

// Get categories for auction creation
exports.getCategories = async (req, res) => {
  try {
    // Updated query to match your exact table structure
    const categoriesQuery = await pool.query(`
      SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.description,
        c.icon_name, 
        c.color_code,
        c.sort_order,
        c.is_active,
        COALESCE(
          json_agg(
            json_build_object(
              'id', sc.id,
              'name', sc.name,
              'slug', sc.slug,
              'description', sc.description,
              'icon_name', sc.icon_name,
              'sort_order', sc.sort_order,
              'is_active', sc.is_active
            ) ORDER BY sc.sort_order, sc.name
          ) FILTER (WHERE sc.id IS NOT NULL), 
          '[]'::json
        ) as subcategories
      FROM categories c
      LEFT JOIN subcategories sc ON c.id = sc.parent_category_id AND sc.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id, c.name, c.slug, c.description, c.icon_name, c.color_code, c.sort_order, c.is_active
      ORDER BY c.sort_order, c.name
    `);

    res.json({
      success: true,
      data: {
        categories: categoriesQuery.rows
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories: ' + error.message
    });
  }
};

// Update auction status (draft to active, etc.)
exports.updateAuctionStatus = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { status } = req.body;
    const sellerId = req.user.id;

    // Verify auction belongs to seller
    const verifyQuery = await pool.query(`
      SELECT a.id FROM auctions a
      JOIN products p ON a.product_id = p.id
      WHERE a.id = $1 AND p.created_by = $2
    `, [auctionId, sellerId]);

    if (verifyQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found or unauthorized'
      });
    }

    // Update status
    const updateQuery = await pool.query(`
      UPDATE auctions 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, auctionId]);

    res.json({
      success: true,
      message: 'Auction status updated successfully',
      data: {
        auction: updateQuery.rows[0]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
