const {pool} = require('../config/database');
const PasswordUtils = require('../utils/passwordUtils');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.username = userData.username;
    this.email = userData.email;
    this.firstName = userData.first_name;
    this.lastName = userData.last_name;
    this.phone = userData.phone;
    this.address = userData.address;
    this.profileImage = userData.profile_image;
    this.isVerified = userData.is_verified;
    this.isAdmin = userData.is_admin;
    this.role = userData.role || 'user'; // Add role field
    this.createdAt = userData.created_at;
    this.updatedAt = userData.updated_at;
    this.lastLoginAt = userData.last_login_at;
    // Never expose password hash in user object
  }

  /**
   * Create a new user with hashed password
   * @param {Object} userData - User registration data
   * @returns {Promise<User>} - Created user instance
   */
  static async create({ username, email, password, firstName, lastName, phone, role = 'user' }) {
    try {
      // Validate password strength
      const passwordValidation = PasswordUtils.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      // Hash the password
      const hashedPassword = await PasswordUtils.hashPassword(password);

      // Check if user already exists
      const existingUser = await this.findByEmailOrUsername(email, username);
      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      const query = `
        INSERT INTO users (username, email, password_hash, first_name, last_name, phone, role, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id, username, email, first_name, last_name, phone, role, is_verified, is_admin, created_at, updated_at
      `;

      const values = [username, email, hashedPassword, firstName, lastName, phone, role];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Failed to create user');
      }

      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Authenticate user with email/username and password
   * @param {string} identifier - Email or username
   * @param {string} password - Plain text password
   * @returns {Promise<User|null>} - User instance if authentication successful
   */
  static async authenticate(identifier, password) {
    try {
      if (!identifier || !password) {
        throw new Error('Email/username and password are required');
      }

      // Find user by email or username
      const query = `
        SELECT * FROM users 
        WHERE email = $1 OR username = $1
      `;
      
      const result = await pool.query(query, [identifier]);
      
      if (result.rows.length === 0) {
        return null; // User not found
      }

      const userData = result.rows[0];

      // Verify password
      const isValidPassword = await PasswordUtils.verifyPassword(password, userData.password_hash);
      
      if (!isValidPassword) {
        return null; // Invalid password
      }

      // Update last login time
      await pool.query(
        'UPDATE users SET last_login_at = NOW() WHERE id = $1',
        [userData.id]
      );

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = userData;
      return new User(userWithoutPassword);
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  /**
   * Update user password
   * @param {number} userId - User ID
   * @param {string} currentPassword - Current password for verification
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} - Success status
   */
  static async updatePassword(userId, currentPassword, newPassword) {
    try {
      // Get current user data
      const query = 'SELECT password_hash FROM users WHERE id = $1';
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const { password_hash: currentHash } = result.rows[0];

      // Verify current password
      const isCurrentPasswordValid = await PasswordUtils.verifyPassword(currentPassword, currentHash);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      const passwordValidation = PasswordUtils.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(`New password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      // Hash new password
      const newHashedPassword = await PasswordUtils.hashPassword(newPassword);

      // Update password
      const updateQuery = `
        UPDATE users 
        SET password_hash = $1, updated_at = NOW() 
        WHERE id = $2
      `;
      
      await pool.query(updateQuery, [newHashedPassword, userId]);
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  /**
   * Find user by email or username
   * @param {string} email - Email address
   * @param {string} username - Username
   * @returns {Promise<User|null>} - User instance or null
   */
  static async findByEmailOrUsername(email, username) {
    try {
      const query = `
        SELECT id, username, email, first_name, last_name, phone, role, is_verified, is_admin, created_at, updated_at
        FROM users 
        WHERE email = $1 OR username = $2
      `;
      
      const result = await pool.query(query, [email, username]);
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<User|null>} - User instance or null
   */
  static async findById(id) {
    try {
      const query = `
        SELECT id, username, email, first_name, last_name, phone, address, profile_image, 
               role, is_verified, is_admin, created_at, updated_at, last_login_at
        FROM users 
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }


  // Add these methods to your existing User class

/**
 * Update user's last activity timestamp
 */
static async updateLastActivity(userId) {
  try {
    await pool.query(
      'UPDATE users SET last_activity_at = NOW() WHERE id = $1',
      [userId]
    );
  } catch (error) {
    console.error('Error updating last activity:', error);
  }
}

/**
 * Get user's profile completion percentage
 */
static async getProfileCompletion(userId) {
  try {
    const query = 'SELECT profile_completion_score FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);
    
    return result.rows.length > 0 ? result.rows[0].profile_completion_score || 0 : 0;
  } catch (error) {
    console.error('Error getting profile completion:', error);
    return 0;
  }
}


  /**
   * Convert user instance to JSON (safe for API responses)
   * @returns {Object} - User data without sensitive information
   */
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      address: this.address,
      profileImage: this.profileImage,
      role: this.role,
      isVerified: this.isVerified,
      isAdmin: this.isAdmin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLoginAt: this.lastLoginAt
    };
  }
}

module.exports = User;
