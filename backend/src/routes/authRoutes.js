// 

const express = require('express');
const authController = require('../controllers/auth/authController');
const { authenticateToken } = require('../middleware/auth/authMiddleware');
const { validate } = require('../middleware/validation/validationMiddleware');

const router = express.Router();

// Public routes - Rate limiting removed for development
router.post('/register', 
  validate('register'), 
  authController.register
);

router.post('/login', 
  validate('login'), 
  authController.login
);

router.post('/logout', 
  authController.logout
);

router.post('/refresh-token', 
  authController.refreshToken
);

router.get('/verify-email/:token', 
  authController.verifyEmail
);

// Protected routes
router.get('/me', 
  authenticateToken, 
  authController.getCurrentUser
);

module.exports = router;
