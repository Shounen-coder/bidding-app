const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const authConfig = require('../../config/auth');

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    authConfig.jwt.secret,
    { expiresIn: authConfig.jwt.expiresIn }
  );

  const refreshToken = jwt.sign(
    { userId },
    authConfig.jwt.refreshSecret,
    { expiresIn: authConfig.jwt.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone } = req.body;

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      phone
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        accessToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific errors
    if (error.message === 'Email already exists' || error.message === 'Username already exists') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // FIX: Add debugging and proper error handling
    console.log('User found:', user.email);
    console.log('Password hash exists:', !!user.passwordHash);

    if (!user.passwordHash) {
      console.error('Password hash is missing for user:', user.email);
      return res.status(500).json({
        success: false,
        message: 'Authentication error - please contact support'
      });
    }

    // Verify password
    const isValidPassword = await User.comparePassword(password, user.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // FIX: Remove passwordHash from response
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword.toJSON ? userWithoutPassword.toJSON() : userWithoutPassword,
        accessToken
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


// Logout user
const logout = (req, res) => {
  try {
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

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, authConfig.jwt.refreshSecret);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token - user not found'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    // Set new refresh token cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: tokens.accessToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    // FIX: Add debugging
    console.log('Current user from middleware:', req.user);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found in request'
      });
    }

    res.json({
      success: true,
      data: {
        user: req.user.toJSON()
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


// Verify email (placeholder for future implementation)
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // TODO: Implement email verification logic
    // For now, just return success
    
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
  verifyEmail
};
