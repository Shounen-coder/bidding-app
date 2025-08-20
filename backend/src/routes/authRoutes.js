const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const { authenticateToken} = require('../middleware/auth/authMiddleware');
const { authRateLimit } = require('../middleware/auth/rateLimitMiddleware');

// Public routes with rate limiting
router.post('/register', authRateLimit, authController.register);
router.post('/login', authRateLimit, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
// router.get('/verify-email/:token', strictRateLimit, authController.verifyEmail);

// Protected routes
router.get('/user', authenticateToken, authController.getCurrentUser);
router.post('/logout-all', authenticateToken, authController.logoutAll);


module.exports = router;


// const { validate } = require('../middleware/validation/validationMiddleware');