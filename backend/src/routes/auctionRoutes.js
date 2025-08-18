const express = require('express');
const auctionController = require('../controllers/auction/auctionController');
const { authenticateToken, optionalAuth } = require('../middleware/auth/authMiddleware');

const router = express.Router();

// Public routes (can be viewed without authentication)
router.get('/', optionalAuth, auctionController.getAllAuctions);
router.get('/featured', optionalAuth, auctionController.getFeaturedAuctions);
router.get('/category/:categorySlug', optionalAuth, auctionController.getAuctionsByCategory);
router.get('/:id', optionalAuth, auctionController.getAuctionById);
router.get('/:id/bids', auctionController.getAuctionBids); // GET /api/auctions/:id/bids


// Protected routes will be added later for creating auctions, bidding, etc.

module.exports = router;
