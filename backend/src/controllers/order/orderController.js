const Order = require('../../models/Order');
const { pool } = require('../../config/database');

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const filters = {
      role: req.query.role, // 'buyer', 'seller', or null for both
      status: req.query.status || 'all',
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    };

    const orders = await Order.getUserOrders(userId, filters);

    res.json({
      success: true,
      data: {
        orders: orders.map(order => order.toJSON())
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const order = await Order.findByIdWithDetails(parseInt(id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is involved in this order
    if (order.buyerId !== userId && order.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        order: order.toJSON()
      }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
};

// Update order status (seller actions)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user?.id;

    // Validate status
    const validStatuses = ['payment_pending', 'paid', 'shipped', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Check if user is the seller
    const order = await Order.findByIdWithDetails(parseInt(id));
    if (!order || order.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Order.updateStatus(parseInt(id), status, userId, notes);

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// Add shipping information
const addShippingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, estimatedDelivery } = req.body;
    const userId = req.user?.id;

    // Check if user is the seller
    const order = await Order.findByIdWithDetails(parseInt(id));
    if (!order || order.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedOrder = await Order.updateShipping(parseInt(id), trackingNumber, estimatedDelivery);

    res.json({
      success: true,
      data: {
        order: updatedOrder.toJSON()
      },
      message: 'Shipping information added successfully'
    });
  } catch (error) {
    console.error('Add shipping info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add shipping information'
    });
  }
};

// // Create order from ended auction (automated)
// const createOrderFromAuction = async (req, res) => {
//   try {
//     const { auctionId } = req.body;

//     const order = await Order.createFromAuction(parseInt(auctionId));

//     res.status(201).json({
//       success: true,
//       data: {
//         order: order.toJSON()
//       },
//       message: 'Order created successfully'
//     });
//   } catch (error) {
//     console.error('Create order from auction error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create order'
//     });
//   }
// };

// Update the createOrderFromAuction function in orderController.js:
const createOrderFromAuction = async (req, res) => {
  try {
    console.log('📥 Received order creation request:', req.body);
    const { auctionId } = req.body;

    if (!auctionId) {
      console.log('❌ Missing auctionId in request');
      return res.status(400).json({
        success: false,
        message: 'Auction ID is required'
      });
    }

    console.log('🔄 Creating order for auction ID:', auctionId);
    const order = await Order.createFromAuction(parseInt(auctionId));

    console.log('✅ Order created successfully:', order.id);
    res.status(201).json({
      success: true,
      data: {
        order: order.toJSON()
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('❌ Create order from auction error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Get seller order statistics
const getSellerOrderStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    const stats = await Order.getSellerOrderStats(userId);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get seller order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  addShippingInfo,
  createOrderFromAuction,
  getSellerOrderStats
};
