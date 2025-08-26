const { pool } = require('../config/database');

class Order {
  constructor(orderData) {
    this.id = orderData.id;
    this.auctionId = orderData.auction_id;
    this.buyerId = orderData.buyer_id;
    this.sellerId = orderData.seller_id;
    this.itemTitle = orderData.item_title;
    this.finalPrice = parseFloat(orderData.final_price);
    this.orderStatus = orderData.order_status;
    this.shippingStatus = orderData.shipping_status;
    this.trackingNumber = orderData.tracking_number;
    this.shippingAddress = orderData.shipping_address;
    this.estimatedDelivery = orderData.estimated_delivery;
    this.deliveredAt = orderData.delivered_at;
    this.createdAt = orderData.created_at;
    this.updatedAt = orderData.updated_at;
  }

  // Replace the createFromAuction method in Order.js with this version:
static async createFromAuction(auctionId) {
  try {
    console.log('🔄 Starting order creation for auction ID:', auctionId);
    
    // Get auction details with winner
    const auctionQuery = `
      SELECT a.*, p.title, p.created_by as seller_id, a.current_winner_id as buyer_id, 
             a.current_price as final_price
      FROM auctions a
      JOIN products p ON a.product_id = p.id
      WHERE a.id = $1 AND a.current_winner_id IS NOT NULL
    `;
    
    console.log('🔍 Executing auction query for ID:', auctionId);
    const auctionResult = await pool.query(auctionQuery, [auctionId]);
    
    console.log('📊 Auction query result:', {
      rowCount: auctionResult.rows.length,
      data: auctionResult.rows[0]
    });
    
    if (auctionResult.rows.length === 0) {
      console.log('❌ No auction found or auction has no winner');
      throw new Error('Auction not found or has no winner');
    }

    const auction = auctionResult.rows[0];
    console.log('✅ Found auction:', {
      id: auction.id,
      title: auction.title,
      buyerId: auction.buyer_id,
      sellerId: auction.seller_id,
      finalPrice: auction.final_price
    });
    
    // Get buyer's shipping address
    console.log('🔍 Getting buyer address for buyer ID:', auction.buyer_id);
    const addressQuery = `SELECT address FROM users WHERE id = $1`;
    const addressResult = await pool.query(addressQuery, [auction.buyer_id]);
    
    console.log('📍 Address query result:', {
      rowCount: addressResult.rows.length,
      address: addressResult.rows[0]?.address
    });
    
    const shippingAddress = addressResult.rows[0]?.address || 'Address not provided';

    // Create order
    console.log('💾 Creating order with data:', {
      auctionId,
      buyerId: auction.buyer_id,
      sellerId: auction.seller_id,
      itemTitle: auction.title,
      finalPrice: auction.final_price,
      shippingAddress
    });
    
    const insertQuery = `
      INSERT INTO orders (auction_id, buyer_id, seller_id, item_title, final_price, 
                         shipping_address, order_status, shipping_status)
      VALUES ($1, $2, $3, $4, $5, $6, 'payment_pending', 'not_shipped')
      RETURNING *
    `;
    
    const values = [
      auctionId,
      auction.buyer_id,
      auction.seller_id,
      auction.title,
      auction.final_price,
      shippingAddress
    ];

    console.log('🔄 Executing order insert with values:', values);
    const result = await pool.query(insertQuery, values);
    
    console.log('✅ Order insert result:', {
      rowCount: result.rows.length,
      orderId: result.rows[0]?.id
    });
    
    // Create initial order history entry
    console.log('📝 Adding order history entry...');
    await this.addHistoryEntry(result.rows[0].id, null, 'payment_pending', 'Order created from successful auction');
    
    console.log('🎉 Order creation completed successfully');
    return new Order(result.rows[0]);
  } catch (error) {
    console.error('❌ Order creation error:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}


//   // Create order when auction ends successfully
//   static async createFromAuction(auctionId) {
//     try {
//       // Get auction details with winner
//       const auctionQuery = `
//         SELECT a.*, p.title, p.created_by as seller_id, a.current_winner_id as buyer_id, 
//                a.current_price as final_price
//         FROM auctions a
//         JOIN products p ON a.product_id = p.id
//         WHERE a.id = $1 AND a.current_winner_id IS NOT NULL
//       `;
      
//       const auctionResult = await pool.query(auctionQuery, [auctionId]);
      
//       if (auctionResult.rows.length === 0) {
//         throw new Error('Auction not found or has no winner');
//       }

//       const auction = auctionResult.rows[0];
      
//       // Get buyer's shipping address
//       const addressQuery = `
//         SELECT address FROM users WHERE id = $1
//       `;
//       const addressResult = await pool.query(addressQuery, [auction.buyer_id]);
//       const shippingAddress = addressResult.rows[0]?.address || 'Address not provided';

//       // Create order
//       const insertQuery = `
//         INSERT INTO orders (auction_id, buyer_id, seller_id, item_title, final_price, 
//                            shipping_address, order_status, shipping_status)
//         VALUES ($1, $2, $3, $4, $5, $6, 'payment_pending', 'not_shipped')
//         RETURNING *
//       `;
      
//       const values = [
//         auctionId,
//         auction.buyer_id,
//         auction.seller_id,
//         auction.title,
//         auction.final_price,
//         shippingAddress
//       ];

//       const result = await pool.query(insertQuery, values);
      
//       // Create initial order history entry
//       await this.addHistoryEntry(result.rows[0].id, null, 'payment_pending', 'Order created from successful auction');
      
//       return new Order(result.rows[0]);
//     } catch (error) {
//       console.error('Error creating order from auction:', error);
//       throw error;
//     }
//   }

  // Get order by ID with full details
  static async findByIdWithDetails(orderId) {
    try {
      const query = `
        SELECT o.*, 
               buyer.username as buyer_username, buyer.first_name as buyer_first_name,
               buyer.last_name as buyer_last_name, buyer.email as buyer_email,
               seller.username as seller_username, seller.first_name as seller_first_name,
               seller.last_name as seller_last_name, seller.email as seller_email,
               a.end_time as auction_end_time,
               p.images as product_images
        FROM orders o
        JOIN users buyer ON o.buyer_id = buyer.id
        JOIN users seller ON o.seller_id = seller.id
        JOIN auctions a ON o.auction_id = a.id
        JOIN products p ON a.product_id = p.id
        WHERE o.id = $1
      `;
      
      const result = await pool.query(query, [orderId]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const order = new Order(row);
      
      // Add buyer and seller info
      order.buyer = {
        id: row.buyer_id,
        username: row.buyer_username,
        firstName: row.buyer_first_name,
        lastName: row.buyer_last_name,
        email: row.buyer_email
      };
      
      order.seller = {
        id: row.seller_id,
        username: row.seller_username,
        firstName: row.seller_first_name,
        lastName: row.seller_last_name,
        email: row.seller_email
      };
      
      order.auction = {
        id: row.auction_id,
        endTime: row.auction_end_time
      };
      
      order.productImages = row.product_images || [];
      
      // Get order history
      order.history = await this.getOrderHistory(orderId);
      
      return order;
    } catch (error) {
      console.error('Error getting order details:', error);
      throw error;
    }
  }

  // Get user's orders (buyer or seller)
  static async getUserOrders(userId, filters = {}) {
    try {
      let whereConditions = ['(o.buyer_id = $1 OR o.seller_id = $1)'];
      let queryParams = [userId];
      let paramIndex = 2;

      // Add role filter (buyer/seller)
      if (filters.role === 'buyer') {
        whereConditions = ['o.buyer_id = $1'];
      } else if (filters.role === 'seller') {
        whereConditions = ['o.seller_id = $1'];
      }

      // Add status filter
      if (filters.status && filters.status !== 'all') {
        whereConditions.push(`o.order_status = $${paramIndex}`);
        queryParams.push(filters.status);
        paramIndex++;
      }

      // Pagination
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;

      const query = `
        SELECT o.*, 
               buyer.username as buyer_username, buyer.first_name as buyer_first_name,
               seller.username as seller_username, seller.first_name as seller_first_name,
               a.end_time as auction_end_time,
               p.images as product_images
        FROM orders o
        JOIN users buyer ON o.buyer_id = buyer.id
        JOIN users seller ON o.seller_id = seller.id
        JOIN auctions a ON o.auction_id = a.id
        JOIN products p ON a.product_id = p.id
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY o.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      queryParams.push(limit, offset);
      const result = await pool.query(query, queryParams);

      return result.rows.map(row => {
        const order = new Order(row);
        
        order.buyer = {
          username: row.buyer_username,
          firstName: row.buyer_first_name
        };
        
        order.seller = {
          username: row.seller_username,
          firstName: row.seller_first_name
        };
        
        order.productImages = row.product_images || [];
        
        return order;
      });
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  }

  // Update order status
  static async updateStatus(orderId, newStatus, userId, notes = null) {
    try {
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Get current status
        const currentResult = await client.query('SELECT order_status FROM orders WHERE id = $1', [orderId]);
        const currentStatus = currentResult.rows[0]?.order_status;
        
        // Update order
        await client.query(
          'UPDATE orders SET order_status = $1, updated_at = NOW() WHERE id = $2',
          [newStatus, orderId]
        );
        
        // Add history entry
        await client.query(`
          INSERT INTO order_history (order_id, status_from, status_to, notes, created_by)
          VALUES ($1, $2, $3, $4, $5)
        `, [orderId, currentStatus, newStatus, notes, userId]);
        
        await client.query('COMMIT');
        return true;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Add shipping information
  static async updateShipping(orderId, trackingNumber, estimatedDelivery = null) {
    try {
      const query = `
        UPDATE orders 
        SET tracking_number = $1, estimated_delivery = $2, shipping_status = 'shipped', updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `;
      
      const result = await pool.query(query, [trackingNumber, estimatedDelivery, orderId]);
      
      if (result.rows.length > 0) {
        await this.addHistoryEntry(orderId, 'not_shipped', 'shipped', `Tracking number: ${trackingNumber}`);
      }
      
      return result.rows[0] ? new Order(result.rows[0]) : null;
    } catch (error) {
      console.error('Error updating shipping:', error);
      throw error;
    }
  }

  // Get order history
  static async getOrderHistory(orderId) {
    try {
      const query = `
        SELECT oh.*, u.username as created_by_username
        FROM order_history oh
        LEFT JOIN users u ON oh.created_by = u.id
        WHERE oh.order_id = $1
        ORDER BY oh.created_at ASC
      `;
      
      const result = await pool.query(query, [orderId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting order history:', error);
      return [];
    }
  }

  // Add history entry
  static async addHistoryEntry(orderId, statusFrom, statusTo, notes, userId = null) {
    try {
      const query = `
        INSERT INTO order_history (order_id, status_from, status_to, notes, created_by)
        VALUES ($1, $2, $3, $4, $5)
      `;
      
      await pool.query(query, [orderId, statusFrom, statusTo, notes, userId]);
    } catch (error) {
      console.error('Error adding history entry:', error);
    }
  }

  // Get order statistics for seller dashboard
  static async getSellerOrderStats(sellerId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_orders,
          COUNT(CASE WHEN order_status = 'payment_pending' THEN 1 END) as pending_payment,
          COUNT(CASE WHEN order_status = 'paid' THEN 1 END) as ready_to_ship,
          COUNT(CASE WHEN shipping_status = 'shipped' THEN 1 END) as shipped,
          COUNT(CASE WHEN order_status = 'completed' THEN 1 END) as completed,
          SUM(CASE WHEN order_status = 'completed' THEN final_price ELSE 0 END) as total_revenue
        FROM orders
        WHERE seller_id = $1
      `;
      
      const result = await pool.query(query, [sellerId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting seller order stats:', error);
      return {};
    }
  }

  toJSON() {
    return {
      id: this.id,
      auctionId: this.auctionId,
      buyerId: this.buyerId,
      sellerId: this.sellerId,
      itemTitle: this.itemTitle,
      finalPrice: this.finalPrice,
      orderStatus: this.orderStatus,
      shippingStatus: this.shippingStatus,
      trackingNumber: this.trackingNumber,
      shippingAddress: this.shippingAddress,
      estimatedDelivery: this.estimatedDelivery,
      deliveredAt: this.deliveredAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      buyer: this.buyer,
      seller: this.seller,
      auction: this.auction,
      productImages: this.productImages,
      history: this.history
    };
  }
}

module.exports = Order;
