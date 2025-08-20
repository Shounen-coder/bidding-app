const {pool} = require('../config/database');

class Role {
  constructor(roleData) {
    this.id = roleData.id;
    this.name = roleData.name;
    this.displayName = roleData.display_name;
    this.description = roleData.description;
    this.isActive = roleData.is_active;
    this.createdAt = roleData.created_at;
    this.updatedAt = roleData.updated_at;
  }

  /**
   * Get all roles with their permissions
   */
  static async getAllRoles() {
    try {
      const query = `
        SELECT r.*, 
               COALESCE(
                 json_agg(
                   json_build_object(
                     'id', p.id,
                     'name', p.name,
                     'display_name', p.display_name,
                     'resource', p.resource,
                     'action', p.action
                   )
                 ) FILTER (WHERE p.id IS NOT NULL), 
                 '[]'
               ) as permissions
        FROM roles r
        LEFT JOIN role_permissions rp ON r.id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.id
        WHERE r.is_active = true
        GROUP BY r.id, r.name, r.display_name, r.description, r.is_active, r.created_at, r.updated_at
        ORDER BY r.name
      `;

      const result = await pool.query(query);
      return result.rows.map(row => ({
        ...new Role(row),
        permissions: row.permissions
      }));
    } catch (error) {
      console.error('Error getting all roles:', error);
      throw error;
    }
  }

  /**
   * Get role by name
   */
  static async findByName(roleName) {
    try {
      const query = 'SELECT * FROM roles WHERE name = $1 AND is_active = true';
      const result = await pool.query(query, [roleName]);
      
      return result.rows.length > 0 ? new Role(result.rows[0]) : null;
    } catch (error) {
      console.error('Error finding role by name:', error);
      throw error;
    }
  }

  /**
   * Get user's roles with permissions
   */
  static async getUserRoles(userId) {
    try {
      const query = `
        SELECT r.*, 
               COALESCE(
                 json_agg(
                   json_build_object(
                     'id', p.id,
                     'name', p.name,
                     'display_name', p.display_name,
                     'resource', p.resource,
                     'action', p.action
                   )
                 ) FILTER (WHERE p.id IS NOT NULL), 
                 '[]'
               ) as permissions
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        LEFT JOIN role_permissions rp ON r.id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = $1 
        AND ur.is_active = true
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        AND r.is_active = true
        GROUP BY r.id, r.name, r.display_name, r.description, r.is_active, r.created_at, r.updated_at
        ORDER BY r.name
      `;

      const result = await pool.query(query, [userId]);
      return result.rows.map(row => ({
        ...new Role(row),
        permissions: row.permissions
      }));
    } catch (error) {
      console.error('Error getting user roles:', error);
      throw error;
    }
  }

  /**
   * Check if user has specific permission
   */
  static async userHasPermission(userId, permissionName) {
    try {
      const query = `
        SELECT 1
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = $1 
        AND p.name = $2
        AND ur.is_active = true
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        AND r.is_active = true
        LIMIT 1
      `;

      const result = await pool.query(query, [userId, permissionName]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking user permission:', error);
      throw error;
    }
  }

  /**
   * Check if user has any of the specified permissions
   */
  static async userHasAnyPermission(userId, permissionNames) {
    try {
      const query = `
        SELECT 1
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = $1 
        AND p.name = ANY($2::text[])
        AND ur.is_active = true
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        AND r.is_active = true
        LIMIT 1
      `;

      const result = await pool.query(query, [userId, permissionNames]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking user permissions:', error);
      throw error;
    }
  }

  /**
   * Assign role to user
   */
  static async assignRoleToUser(userId, roleId, assignedBy = null) {
    try {
      const query = `
        INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at, is_active)
        VALUES ($1, $2, $3, NOW(), true)
        ON CONFLICT (user_id, role_id) 
        DO UPDATE SET is_active = true, assigned_at = NOW(), assigned_by = $3
        RETURNING *
      `;

      const result = await pool.query(query, [userId, roleId, assignedBy]);
      return result.rows[0];
    } catch (error) {
      console.error('Error assigning role to user:', error);
      throw error;
    }
  }

  /**
   * Remove role from user
   */
  static async removeRoleFromUser(userId, roleId) {
    try {
      const query = `
        UPDATE user_roles 
        SET is_active = false 
        WHERE user_id = $1 AND role_id = $2
        RETURNING *
      `;

      const result = await pool.query(query, [userId, roleId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error removing role from user:', error);
      throw error;
    }
  }

  /**
   * Get all permissions
   */
  static async getAllPermissions() {
    try {
      const query = `
        SELECT * FROM permissions 
        ORDER BY resource, action
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting all permissions:', error);
      throw error;
    }
  }
}

module.exports = Role;
