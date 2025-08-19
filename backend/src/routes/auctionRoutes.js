const express = require('express');
const auctionController = require('../controllers/auction/auctionController');
const { authenticateToken, optionalAuth } = require('../middleware/auth/authMiddleware');

const router = express.Router();

// Public routes (can be viewed without authentication)
router.get('/', optionalAuth, auctionController.getAllAuctions);
router.get('/featured', optionalAuth, auctionController.getFeaturedAuctions);
router.get('/category/:categorySlug', optionalAuth, auctionController.getAuctionsByCategory);

// Watchlist routes
router.post('/:id/watchlist', auctionController.addToWatchlist);        // POST /api/auctions/:id/watchlist
router.delete('/:id/watchlist', auctionController.removeFromWatchlist); // DELETE /api/auctions/:id/watchlist
router.get('/:id/watchlist/status', auctionController.checkWatchlistStatus); // GET /api/auctions/:id/watchlist/status
router.get('/user/watchlist', auctionController.getUserWatchlist);      // GET /api/auctions/user/watchlist

router.get('/:id', optionalAuth, auctionController.getAuctionById);
router.get('/:id/bids', auctionController.getAuctionBids); // GET /api/auctions/:id/bids
router.post('/:id/bids',auctionController.placeBid);



// Protected routes will be added later for creating auctions, bidding, etc.

module.exports = router;
