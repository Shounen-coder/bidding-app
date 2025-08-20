const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class JWTUtils {
  // JWT Configuration
  static ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  static REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;
  
  // Token expiration times
  static ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  static REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  static REMEMBER_ME_EXPIRES_IN = process.env.JWT_REMEMBER_ME_EXPIRES_IN || '30d';

  /**
   * Generate access token
   */
  static generateAccessToken(payload) {
    try {
      const tokenPayload = {
        userId: payload.id,
        username: payload.username,
        email: payload.email,
        role: payload.role,
        type: 'access'
      };

      return jwt.sign(
        tokenPayload,
        this.ACCESS_TOKEN_SECRET,
        {
          expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
          issuer: 'biddex-auction',
          audience: 'biddex-users'
        }
      );
    } catch (error) {
      console.error('Error generating access token:', error);
      throw new Error('Token generation failed');
    }
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload, rememberMe = false) {
    try {
      const tokenPayload = {
        userId: payload.id,
        username: payload.username,
        tokenId: crypto.randomBytes(16).toString('hex'),
        type: 'refresh'
      };

      const expiresIn = rememberMe ? this.REMEMBER_ME_EXPIRES_IN : this.REFRESH_TOKEN_EXPIRES_IN;

      return jwt.sign(
        tokenPayload,
        this.REFRESH_TOKEN_SECRET,
        {
          expiresIn,
          issuer: 'biddex-auction',
          audience: 'biddex-users'
        }
      );
    } catch (error) {
      console.error('Error generating refresh token:', error);
      throw new Error('Token generation failed');
    }
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET, {
        issuer: 'biddex-auction',
        audience: 'biddex-users'
      });

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET, {
        issuer: 'biddex-auction',
        audience: 'biddex-users'
      });

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Generate token pair (access + refresh)
   */
  static generateTokenPair(user, rememberMe = false) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user, rememberMe);

    const accessTokenExpiresAt = new Date(Date.now() + (15 * 60 * 1000)); // 15 minutes
    const refreshTokenExpiresAt = new Date(
      Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000)
    );

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      expiresIn: 15 * 60
    };
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader) {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    
    return parts[1];
  }

  /**
   * Get token expiration info
   */
  static getTokenExpiration(token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) {
        return null;
      }

      const expiresAt = new Date(decoded.exp * 1000);
      const now = new Date();
      const isExpired = now >= expiresAt;
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();

      return {
        expiresAt,
        isExpired,
        timeUntilExpiry,
        expiresInMinutes: Math.floor(timeUntilExpiry / (1000 * 60))
      };
    } catch (error) {
      return null;
    }
  }
}

module.exports = JWTUtils;
