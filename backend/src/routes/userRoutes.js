const express = require('express');
const router = express.Router();
const UserProfileController = require('../controllers/user/userProfileController');
const { authenticateToken} = require('../middleware/auth/authMiddleware');

// Protected routes - user must be authenticated

// Profile Routes - Updated paths to match your controller
router.get('/profile', authenticateToken, UserProfileController.getMyProfile);
router.put('/profile', authenticateToken, UserProfileController.updateMyProfile);

// Dashboard Data Routes  
router.get('/notifications', authenticateToken, UserProfileController.getMyNotifications);
router.put('/notifications/read', authenticateToken, UserProfileController.markNotificationsRead);
router.get('/watchlist', authenticateToken, UserProfileController.getMyWatchlist);
router.post('/watchlist/:auctionId', authenticateToken, UserProfileController.addToWatchlist);
router.delete('/watchlist/:auctionId', authenticateToken, UserProfileController.removeFromWatchlist);

// Dashboard Statistics
router.get('/statistics', authenticateToken, UserProfileController.getDashboardStats);
router.get('/orders', authenticateToken, UserProfileController.getMyOrders);
router.get('/bids', authenticateToken, UserProfileController.getMyBids);

// Settings Routes - Comment out the ones not implemented yet
router.put('/settings/notifications', authenticateToken, UserProfileController.updateNotificationSettings);
// router.put('/settings/privacy', authenticateToken, UserProfileController.updatePrivacySettings);
// router.post('/settings/change-password', authenticateToken, UserProfileController.changePassword);

// Activity Routes - Comment out if not implemented
// router.get('/activity', authenticateToken, UserProfileController.getMyActivity);

// Public routes - Comment out if not implemented
// router.get('/profile/:userId', optionalAuth, UserProfileController.getPublicProfile);

module.exports = router;








// // const express = require('express');
// // const router = express.Router();
// // const rateLimit = require('express-rate-limit');
// // const userController = require('../controllers/user/userController');
// // const { authenticateToken, requireAdmin } = require('../middleware/auth/authMiddleware');
// // const { validate } = require('../middleware/validation/validationMiddleware');


// // // Rate limiting
// // const generalLimiter = rateLimit({
// //   windowMs: 15 * 60 * 1000, // 15 minutes
// //   max: 100,
// //   standardHeaders: true,
// //   legacyHeaders: false
// // });

// // // All user routes require authentication
// // router.use(authenticateToken);

// // // User profile routes
// // router.get('/profile', 
// //   generalLimiter, 
// //   userController.getProfile
// // );

// // router.put('/profile', 
// //   generalLimiter, 
// //   validate('updateProfile'), 
// //   userController.updateProfile
// // );

// // router.put('/change-password', 
// //   generalLimiter, 
// //   validate('changePassword'), 
// //   userController.changePassword
// // );

// // router.delete('/account', 
// //   generalLimiter, 
// //   userController.deleteAccount
// // );

// // // Admin only routes
// // router.get('/stats', 
// //   generalLimiter, 
// //   requireAdmin, 
// //   userController.getUserStats
// // );

// // module.exports = router;


// const express = require('express');
// const router = express.Router();
// const UserProfileController = require('../controllers/user/userProfileController');
// const { authenticateToken, optionalAuth } = require('../middleware/auth/authMiddleware');

// // Protected routes - user must be authenticated
// router.get('/profile/me', authenticateToken, UserProfileController.getMyProfile);
// router.put('/profile/me', authenticateToken, UserProfileController.updateMyProfile);

// // router.get('/activity/me', authenticateToken, UserProfileController.getMyActivity);
// // router.put('/notifications', authenticateToken, UserProfileController.updateNotificationSettings);

// // Dashboard Data Routes
// router.get('/activity', authenticateToken, UserProfileController.getMyActivity);
// router.get('/notifications', authenticateToken, UserProfileController.getMyNotifications);
// router.put('/notifications/read', authenticateToken, UserProfileController.markNotificationsRead);
// router.get('/watchlist', authenticateToken, UserProfileController.getMyWatchlist);
// router.post('/watchlist/:auctionId', authenticateToken, UserProfileController.addToWatchlist);
// router.delete('/watchlist/:auctionId', authenticateToken, UserProfileController.removeFromWatchlist);

// // Settings Routes
// router.put('/settings/notifications', authenticateToken, UserProfileController.updateNotificationSettings);
// router.put('/settings/privacy', authenticateToken, UserProfileController.updatePrivacySettings);
// router.post('/settings/change-password', authenticateToken, UserProfileController.changePassword);

// // Dashboard Statistics
// router.get('/statistics', authenticateToken, UserProfileController.getDashboardStats);
// router.get('/orders', authenticateToken, UserProfileController.getMyOrders);
// router.get('/bids', authenticateToken, UserProfileController.getMyBids);



// // Public routes - can be viewed by anyone, optional auth for enhanced features
// router.get('/profile/:userId', optionalAuth, UserProfileController.getPublicProfile);

// module.exports = router;
