const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auction/auctionController');
const { authenticateToken, optionalAuth, requirePermission } = require('../middleware/auth/authMiddleware');

// Public routes (can be viewed without authentication)
router.get('/', optionalAuth, auctionController.getAllAuctions);
router.get('/featured', optionalAuth, auctionController.getFeaturedAuctions);
router.get('/category/:categorySlug', optionalAuth, auctionController.getAuctionsByCategory);
router.get('/:id', optionalAuth, auctionController.getAuctionById);

// Public bid viewing (no auth required, but optional auth for enhanced features)
router.get('/:id/bids', optionalAuth, auctionController.getAuctionBids);

// Protected routes (authentication required)
router.post('/:id/bids', authenticateToken, requirePermission(['bids.create']), auctionController.placeBid);

// Watchlist routes (authentication required)
router.post('/:id/watchlist', authenticateToken, auctionController.addToWatchlist);
router.delete('/:id/watchlist', authenticateToken, auctionController.removeFromWatchlist);
router.get('/:id/watchlist/status', authenticateToken, auctionController.checkWatchlistStatus);
router.get('/user/watchlist', authenticateToken, auctionController.getUserWatchlist);

// Admin/Seller routes (permission-based) - Ready for future implementation
// router.post('/', authenticateToken, requirePermission(['auctions.create']), auctionController.createAuction);
// router.put('/:id', authenticateToken, requirePermission(['auctions.update']), auctionController.updateAuction);
// router.delete('/:id', authenticateToken, requirePermission(['auctions.delete']), auctionController.deleteAuction);

// Admin/Moderator routes for auction management
// router.put('/:id/approve', authenticateToken, requirePermission(['auctions.moderate']), auctionController.approveAuction);
// router.put('/:id/reject', authenticateToken, requirePermission(['auctions.moderate']), auctionController.rejectAuction);
// router.put('/:id/suspend', authenticateToken, requirePermission(['auctions.moderate']), auctionController.suspendAuction);

// Admin routes for bid management
// router.delete('/:auctionId/bids/:bidId', authenticateToken, requirePermission(['bids.moderate']), auctionController.removeBid);
// router.put('/:auctionId/bids/:bidId/flag', authenticateToken, requirePermission(['bids.moderate']), auctionController.flagBid);

module.exports = router;
