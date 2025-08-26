const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth/authMiddleware');
const {
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  addShippingInfo,
  createOrderFromAuction,
  getSellerOrderStats
} = require('../controllers/order/orderController');

// Apply authentication to all routes
router.use(authenticateToken);

// Get user's orders
router.get('/', getUserOrders);

// Get seller order statistics
router.get('/stats/seller', getSellerOrderStats);

// Get specific order
router.get('/:id', getOrderById);

// Create order from auction (automated process)
router.post('/create-from-auction', createOrderFromAuction);

// Update order status (seller)
router.put('/:id/status', updateOrderStatus);

// Add shipping information (seller)
router.put('/:id/shipping', addShippingInfo);

// Add this route to orderRoutes.js
const AuctionEndService = require('../services/auctionEndService');

// Add this route (you can also create a separate admin route file)
router.post('/trigger-auction-end-process', async (req, res) => {
  try {
    const processedCount = await AuctionEndService.triggerManually();
    res.json({
      success: true,
      message: `Processed ${processedCount} ended auctions`,
      processedCount
    });
  } catch (error) {
    console.error('Manual trigger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process ended auctions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


module.exports = router;
