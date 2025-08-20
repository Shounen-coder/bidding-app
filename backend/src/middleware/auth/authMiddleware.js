const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const JWTUtils = require('../../utils/jwtUtils');
const Role = require('../../models/Role');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        code: 'TOKEN_REQUIRED'
      });
    }

    // Use your existing JWT secret (the same one used in login)
    const JWT_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not found in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Authentication configuration error'
      });
    }

    // Verify token with the same secret used in login
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const { pool } = require('../../config/database');
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.rows[0];

    // Add user to request object (same format as your existing middleware)
    req.user = {
      id: user.id,
      userId: user.id, // Add userId for consistency
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isAdmin: user.is_admin,
      isVerified: user.is_verified,
      // Add toJSON method for compatibility
      toJSON: () => ({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isAdmin: user.is_admin,
        isVerified: user.is_verified
      })
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
        hint: 'Use refresh token to get new access token'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

// Enhanced admin check using permission system
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const userId = req.user.userId || req.user.id;

    // Check if user has admin permission OR legacy isAdmin flag
    const hasAdminPermission = await Role.userHasPermission(userId, 'system.admin');
    const isLegacyAdmin = req.user.isAdmin || req.user.role === 'admin';

    if (!hasAdminPermission && !isLegacyAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Admin check failed'
    });
  }
};

const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const JWT_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
        const decoded = jwt.verify(token, JWT_SECRET);

        const { pool } = require('../../config/database');
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);

        if (userResult.rows.length > 0) {
          const user = userResult.rows[0];
          req.user = {
            id: user.id,
            userId: user.id, // Add userId for consistency
            username: user.username,
            email: user.email,
            role: user.role,
            isAdmin: user.is_admin,
            isVerified: user.is_verified
          };
        }
      } catch (error) {
        // Silently ignore token errors for optional auth
        console.log('Optional auth failed:', error.message);
      }
    }
  } catch (error) {
    // Ignore errors for optional auth
    console.log('Optional auth error:', error.message);
  }
  
  next();
};

// NEW: Permission-based authorization middleware
const requirePermission = (requiredPermissions) => {
  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userId = req.user.userId || req.user.id;

      // Check if user has any of the required permissions
      const hasPermission = await Role.userHasAnyPermission(userId, permissions);

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required_permissions: permissions
        });
      }

      // Add user permissions to request for further use
      if (!req.userPermissions) {
        const userRoles = await Role.getUserRoles(userId);
        const allPermissions = userRoles.reduce((acc, role) => {
          return acc.concat(role.permissions.map(p => p.name));
        }, []);
        req.userPermissions = [...new Set(allPermissions)]; // Remove duplicates
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Permission check failed',
        code: 'PERMISSION_CHECK_FAILED'
      });
    }
  };
};

// NEW: Middleware to load user permissions into request
const loadUserPermissions = async (req, res, next) => {
  try {
    if (req.user) {
      const userId = req.user.userId || req.user.id;
      const userRoles = await Role.getUserRoles(userId);
      
      const allPermissions = userRoles.reduce((acc, role) => {
        return acc.concat(role.permissions.map(p => p.name));
      }, []);

      req.userRoles = userRoles;
      req.userPermissions = [...new Set(allPermissions)];
    }
    next();
  } catch (error) {
    console.error('Load permissions error:', error);
    // Don't fail the request if permission loading fails
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireVerified,
  optionalAuth,
  requirePermission,     // NEW
  loadUserPermissions,   // NEW
  
  // Aliases for consistency
  authMiddleware: authenticateToken,
  optionalAuthMiddleware: optionalAuth
};
