const {pool} = require('../config/database');
const crypto = require('crypto');

class RefreshToken {
  constructor(tokenData) {
    this.id = tokenData.id;
    this.userId = tokenData.user_id;
    this.tokenId = tokenData.token_id;
    this.tokenHash = tokenData.token_hash;
    this.expiresAt = tokenData.expires_at;
    this.createdAt = tokenData.created_at;
    this.lastUsedAt = tokenData.last_used_at;
    this.isRevoked = tokenData.is_revoked;
    this.userAgent = tokenData.user_agent;
    this.ipAddress = tokenData.ip_address;
    this.deviceInfo = tokenData.device_info;
  }

  /**
   * Store refresh token in database
   * @param {Object} tokenData - Token information
   * @returns {Promise<RefreshToken>} - Created refresh token instance
   */
  static async create({ userId, tokenId, refreshToken, expiresAt, userAgent, ipAddress, deviceInfo }) {
    try {
      // Hash the refresh token for storage
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

      const query = `
        INSERT INTO refresh_tokens (user_id, token_id, token_hash, expires_at, user_agent, ip_address, device_info, created_at, last_used_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *
      `;

      const values = [userId, tokenId, tokenHash, expiresAt, userAgent, ipAddress, deviceInfo];
      const result = await pool.query(query, values);

      return new RefreshToken(result.rows[0]);
    } catch (error) {
      console.error('Error creating refresh token:', error);
      throw error;
    }
  }

  /**
   * Find refresh token by token ID
   * @param {string} tokenId - Token identifier
   * @returns {Promise<RefreshToken|null>} - Found token or null
   */
  static async findByTokenId(tokenId) {
    try {
      const query = `
        SELECT * FROM refresh_tokens 
        WHERE token_id = $1 AND expires_at > NOW() AND is_revoked = FALSE
      `;
      
      const result = await pool.query(query, [tokenId]);
      return result.rows.length > 0 ? new RefreshToken(result.rows[0]) : null;
    } catch (error) {
      console.error('Error finding refresh token:', error);
      throw error;
    }
  }

  /**
   * Verify refresh token hash
   * @param {string} tokenId - Token identifier
   * @param {string} refreshToken - Raw refresh token
   * @returns {Promise<RefreshToken|null>} - Valid token or null
   */
  static async verifyToken(tokenId, refreshToken) {
    try {
      const tokenRecord = await this.findByTokenId(tokenId);
      if (!tokenRecord) {
        return null;
      }

      // Hash the provided token and compare
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      
      if (tokenRecord.tokenHash !== tokenHash) {
        return null;
      }

      // Update last used time
      await pool.query(
        'UPDATE refresh_tokens SET last_used_at = NOW() WHERE id = $1',
        [tokenRecord.id]
      );

      return tokenRecord;
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      throw error;
    }
  }

  /**
   * Revoke refresh token
   * @param {string} tokenId - Token identifier
   * @returns {Promise<boolean>} - Success status
   */
  static async revokeToken(tokenId) {
    try {
      const query = `
        UPDATE refresh_tokens 
        SET is_revoked = TRUE 
        WHERE token_id = $1
        RETURNING id
      `;
      
      const result = await pool.query(query, [tokenId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error revoking refresh token:', error);
      throw error;
    }
  }

  /**
   * Revoke all refresh tokens for a user
   * @param {number} userId - User ID
   * @returns {Promise<number>} - Number of tokens revoked
   */
  static async revokeAllUserTokens(userId) {
    try {
      const query = `
        UPDATE refresh_tokens 
        SET is_revoked = TRUE 
        WHERE user_id = $1 AND is_revoked = FALSE
        RETURNING id
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows.length;
    } catch (error) {
      console.error('Error revoking user tokens:', error);
      throw error;
    }
  }

  /**
   * Clean up expired tokens
   * @returns {Promise<number>} - Number of tokens cleaned up
   */
  static async cleanupExpiredTokens() {
    try {
      const query = `
        DELETE FROM refresh_tokens 
        WHERE expires_at < NOW() OR is_revoked = TRUE
        RETURNING id
      `;
      
      const result = await pool.query(query);
      return result.rows.length;
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
      throw error;
    }
  }

  /**
   * Get user's active refresh tokens
   * @param {number} userId - User ID
   * @returns {Promise<RefreshToken[]>} - Array of active tokens
   */
  static async getUserActiveTokens(userId) {
    try {
      const query = `
        SELECT * FROM refresh_tokens 
        WHERE user_id = $1 AND expires_at > NOW() AND is_revoked = FALSE
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows.map(row => new RefreshToken(row));
    } catch (error) {
      console.error('Error getting user active tokens:', error);
      throw error;
    }
  }
}

module.exports = RefreshToken;
