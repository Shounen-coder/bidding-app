const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.username = userData.username;
    this.email = userData.email;
    this.firstName = userData.first_name;
    this.lastName = userData.last_name;
    this.phone = userData.phone;
    this.profileImage = userData.profile_image;
    this.isVerified = userData.is_verified;
    this.isAdmin = userData.is_admin;
    this.createdAt = userData.created_at;
    this.updatedAt = userData.updated_at;
  }

  // Hash password
  static async hashPassword(password) {
    return await bcrypt.hash(password, authConfig.bcrypt.rounds);
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    if (!hashedPassword) {
      throw new Error('Hashed password is required for comparison');
    }
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Create new user
  static async create(userData) {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phone = null
    } = userData;

    try {
      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Insert user into database
      const query = `
        INSERT INTO users (username, email, password_hash, first_name, last_name, phone, is_verified, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, username, email, first_name, last_name, phone, profile_image, is_verified, is_admin, created_at, updated_at
      `;

      const values = [
        username,
        email,
        hashedPassword,
        firstName,
        lastName,
        phone,
        false, // is_verified - default false
        false  // is_admin - default false
      ];

      const result = await pool.query(query, values);
      return new User(result.rows[0]);
    } catch (error) {
      // Handle unique constraint violations
      if (error.code === '23505') {
        if (error.constraint === 'users_email_key') {
          throw new Error('Email already exists');
        }
        if (error.constraint === 'users_username_key') {
          throw new Error('Username already exists');
        }
      }
      throw error;
    }
  }

  // Find user by email - FIX: Return passwordHash separately
  static async findByEmail(email) {
    const query = `
      SELECT id, username, email, password_hash, first_name, last_name, phone, 
             profile_image, is_verified, is_admin, created_at, updated_at
      FROM users 
      WHERE email = $1
    `;
    
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const userData = result.rows[0];
    const user = new User(userData);
    
    // Return user object with passwordHash attached
    return {
      ...user,
      passwordHash: userData.password_hash
    };
  }

  // Find user by ID
  static async findById(id) {
    const query = `
      SELECT id, username, email, first_name, last_name, phone, 
             profile_image, is_verified, is_admin, created_at, updated_at
      FROM users 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(result.rows[0]);
  }

  // Find user by username
  static async findByUsername(username) {
    const query = `
      SELECT id, username, email, first_name, last_name, phone, 
             profile_image, is_verified, is_admin, created_at, updated_at
      FROM users 
      WHERE username = $1
    `;
    
    const result = await pool.query(query, [username]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(result.rows);
  }

  // Update user profile
  static async updateProfile(id, updateData) {
    const allowedFields = ['first_name', 'last_name', 'phone', 'profile_image'];
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    // Build dynamic query based on provided fields
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = NOW()`);
    
    // Add user ID for WHERE clause
    values.push(id);

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, username, email, first_name, last_name, phone, 
                profile_image, is_verified, is_admin, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    return new User(result.rows[0]);
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const hashedPassword = await this.hashPassword(newPassword);
    
    const query = `
      UPDATE users 
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [hashedPassword, id]);
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    return true;
  }

  // Verify user email
  static async verifyEmail(id) {
    const query = `
      UPDATE users 
      SET is_verified = true, updated_at = NOW()
      WHERE id = $1
      RETURNING id, is_verified
    `;

    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    return result.rows[0];
  }

  // Get user stats (for admin)
  static async getUserStats() {
    const query = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_users,
        COUNT(CASE WHEN is_admin = true THEN 1 END) as admin_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_users
      FROM users
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  // FIX: Convert to JSON (properly return all properties)
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      profileImage: this.profileImage,
      isVerified: this.isVerified,
      isAdmin: this.isAdmin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;
