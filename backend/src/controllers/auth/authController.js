const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const RefreshToken = require('../../models/RefreshToken');
const JWTUtils = require('../../utils/jwtUtils');

// Generate JWT tokens (Enhanced version)
const generateTokens = (user, rememberMe = false) => {
  return JWTUtils.generateTokenPair(user, rememberMe);
};

// Register new user (Enhanced with better error handling)
const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, rememberMe = false } = req.body;

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
        errors: ['username', 'email', 'password', 'firstName', 'lastName'].filter(field => !req.body[field])
      });
    }

    // Create user (password validation and hashing handled in User.create)
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      role: 'user'
    });

    try {
  const Role = require('../../models/Role');
  const userRole = await Role.findByName('user');
  
  if (userRole) {
    await Role.assignRoleToUser(user.id, userRole.id);
    console.log(`✅ Assigned 'user' role to new user: ${user.username}`);
    
    // VERIFY the assignment worked
    const hasPermission = await Role.userHasPermission(user.id, 'bids.create');
    console.log(`✅ User ${user.username} has bids.create permission:`, hasPermission);
    
    if (!hasPermission) {
      // Force create permission if missing
      const pool = require('../config/database');
      await pool.query(`
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT r.id, p.id FROM roles r, permissions p
        WHERE r.name = 'user' AND p.name = 'bids.create'
        ON CONFLICT DO NOTHING
      `);
      console.log('✅ Ensured bids.create permission for user role');
    }
  } else {
    console.error('❌ Default "user" role not found in database!');
  }
} catch (roleError) {
  console.error('❌ Role assignment failed:', roleError);
}

    // Generate tokens
    const tokens = generateTokens(user, rememberMe);

    // Store refresh token in database
    const refreshTokenData = JWTUtils.verifyRefreshToken(tokens.refreshToken);
    await RefreshToken.create({
      userId: user.id,
      tokenId: refreshTokenData.tokenId,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.refreshTokenExpiresAt,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      deviceInfo: { rememberMe }
    });

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        accessToken: tokens.accessToken,
        tokenType: tokens.tokenType,
        expiresIn: tokens.expiresIn
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific errors
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user (Enhanced with better authentication)
const login = async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Authenticate user (this uses the new User.authenticate method)
    const user = await User.authenticate(email, password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const tokens = generateTokens(user, rememberMe);

    // Store refresh token in database
    const refreshTokenData = JWTUtils.verifyRefreshToken(tokens.refreshToken);
    await RefreshToken.create({
      userId: user.id,
      tokenId: refreshTokenData.tokenId,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.refreshTokenExpiresAt,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      deviceInfo: { rememberMe }
    });

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        accessToken: tokens.accessToken,
        tokenType: tokens.tokenType,
        expiresIn: tokens.expiresIn
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Logout user (Enhanced with token revocation)
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      try {
        const decoded = JWTUtils.verifyRefreshToken(refreshToken);
        await RefreshToken.revokeToken(decoded.tokenId);
      } catch (error) {
        console.log('Invalid refresh token during logout:', error.message);
      }
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// Refresh access token (Enhanced with database verification)
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided'
      });
    }

    // Verify refresh token
    const decoded = JWTUtils.verifyRefreshToken(refreshToken);
    
    // Verify token exists in database and is valid
    const tokenRecord = await RefreshToken.verifyToken(decoded.tokenId, refreshToken);
    
    if (!tokenRecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Get current user data
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new access token
    const accessToken = JWTUtils.generateAccessToken(user);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: 15 * 60 // 15 minutes
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    // Clear invalid refresh token cookie
    res.clearCookie('refreshToken');
    
    res.status(401).json({
      success: false,
      message: error.message || 'Token refresh failed'
    });
  }
};

// Get current user (Keep your existing logic)
const getCurrentUser = async (req, res) => {
  try {
    console.log('getCurrentUser called, req.user:', req.user); // Debug log
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found in request'
      });
    }

    res.json({
      success: true,
      data: {
        user: req.user.toJSON ? req.user.toJSON() : req.user
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Logout from all devices (NEW FEATURE)
const logoutAll = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Revoke all refresh tokens for the user
    const revokedCount = await RefreshToken.revokeAllUserTokens(userId);

    // Clear current refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: `Logged out from ${revokedCount} device(s) successfully`
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout from all devices failed'
    });
  }
};

// Verify email (Keep your existing placeholder)
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    // TODO: Implement email verification logic
    res.json({
      success: true,
      message: 'Email verification functionality will be implemented in future updates'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  logoutAll,  // NEW
  verifyEmail
};
