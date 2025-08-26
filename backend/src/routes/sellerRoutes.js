// backend/src/routes/seller.js
const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { body, param, query, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth/authMiddleware');

// Apply auth middleware to all seller routes
router.use(authenticateToken);

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};


// Get seller profile with tier progress
router.get('/profile', sellerController.getProfile);

// Get categories for auction creation
router.get('/categories', sellerController.getCategories);

// Create auction
router.post('/auctions', [
  body('title')
    .notEmpty()
    .isLength({ min: 5, max: 255 })
    .withMessage('Title must be 5-255 characters'),
  body('description')
    .notEmpty()
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Valid category is required'),
  body('starting_price')
    .isFloat({ min: 0.01 })
    .withMessage('Starting price must be greater than 0'),
  body('end_time')
    .isISO8601()
    .withMessage('Valid end time is required'),
  body('buy_now_price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Buy now price must be greater than 0'),
  body('reserve_price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Reserve price must be greater than 0'),
  body('bid_increment')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Bid increment must be greater than 0'),
  body('condition')
    .optional()
    .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
    .withMessage('Invalid condition'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  handleValidationErrors
], sellerController.createAuction);

// Get seller's auctions
router.get('/auctions', [
  query('status')
    .optional()
    .isIn(['all', 'active', 'scheduled', 'ended', 'draft'])
    .withMessage('Invalid status'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('sortBy')
    .optional()
    .isIn(['newest', 'ending_soon', 'most_bids', 'most_viewed'])
    .withMessage('Invalid sort option'),
  handleValidationErrors
], sellerController.getSellerAuctions);

// Update auction status
router.patch('/auctions/:auctionId/status', [
  param('auctionId')
    .isInt({ min: 1 })
    .withMessage('Valid auction ID is required'),
  body('status')
    .isIn(['draft', 'scheduled', 'active', 'ended', 'cancelled'])
    .withMessage('Invalid status'),
  handleValidationErrors
], sellerController.updateAuctionStatus);

// Get seller analytics
// router.get('/analytics', [
//   query('days')
//     .optional()
//     .isInt({ min: 1, max: 365 })
//     .withMessage('Days must be between 1 and 365'),
//   handleValidationErrors
// ], sellerController.getAnalytics);

// Add this line to routes/sellerRoutes.js
router.get('/analytics', authenticateToken, sellerController.getAnalytics);


// Get seller earnings
router.get('/earnings', [
  query('status')
    .optional()
    .isIn(['all', 'pending', 'processing', 'paid', 'cancelled'])
    .withMessage('Invalid status'),
  query('period')
    .optional()
    .isIn(['7', '30', '90', '365', 'all'])
    .withMessage('Invalid period'),
  handleValidationErrors
], sellerController.getEarnings);

module.exports = router;
