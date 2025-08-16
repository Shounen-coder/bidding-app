const express = require('express');
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/user/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth/authMiddleware');
const { validate } = require('../middleware/validation/validationMiddleware');

const router = express.Router();

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

// All user routes require authentication
router.use(authenticateToken);

// User profile routes
router.get('/profile', 
  generalLimiter, 
  userController.getProfile
);

router.put('/profile', 
  generalLimiter, 
  validate('updateProfile'), 
  userController.updateProfile
);

router.put('/change-password', 
  generalLimiter, 
  validate('changePassword'), 
  userController.changePassword
);

router.delete('/account', 
  generalLimiter, 
  userController.deleteAccount
);

// Admin only routes
router.get('/stats', 
  generalLimiter, 
  requireAdmin, 
  userController.getUserStats
);

module.exports = router;
