const Role = require('../../models/Role');
const UserProfile = require('../../models/UserProfile');

class RoleController {
  /**
   * Get all roles with permissions
   */
  static async getAllRoles(req, res) {
    try {
      const roles = await Role.getAllRoles();

      res.json({
        success: true,
        data: { roles }
      });
    } catch (error) {
      console.error('Get all roles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch roles'
      });
    }
  }

  /**
   * Get all permissions
   */
  static async getAllPermissions(req, res) {
    try {
      const permissions = await Role.getAllPermissions();
      
      // Group permissions by resource
      const groupedPermissions = permissions.reduce((acc, permission) => {
        if (!acc[permission.resource]) {
          acc[permission.resource] = [];
        }
        acc[permission.resource].push(permission);
        return acc;
      }, {});

      res.json({
        success: true,
        data: { 
          permissions,
          grouped_permissions: groupedPermissions
        }
      });
    } catch (error) {
      console.error('Get all permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch permissions'
      });
    }
  }

  /**
   * Get user's roles and permissions
   */
  static async getUserRoles(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId || isNaN(parseInt(userId))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const roles = await Role.getUserRoles(parseInt(userId));

      res.json({
        success: true,
        data: { 
          user_id: parseInt(userId),
          roles 
        }
      });
    } catch (error) {
      console.error('Get user roles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user roles'
      });
    }
  }

  /**
   * Assign role to user
   */
  static async assignRole(req, res) {
    try {
      const { userId, roleId } = req.body;
      const assignedBy = req.user.userId;

      if (!userId || !roleId || isNaN(parseInt(userId)) || isNaN(parseInt(roleId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid user ID and role ID are required'
        });
      }

      // Check if role exists
      const roles = await Role.getAllRoles();
      const roleExists = roles.find(role => role.id === parseInt(roleId));
      
      if (!roleExists) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }

      // Assign role
      await Role.assignRoleToUser(parseInt(userId), parseInt(roleId), assignedBy);

      // Log activity
      await UserProfile.logActivity(assignedBy, 'role_assigned', {
        targetUserId: parseInt(userId),
        roleId: parseInt(roleId),
        roleName: roleExists.name
      }, req);

      res.json({
        success: true,
        message: `Role "${roleExists.displayName}" assigned successfully`
      });
    } catch (error) {
      console.error('Assign role error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign role'
      });
    }
  }

  /**
   * Remove role from user
   */
  static async removeRole(req, res) {
    try {
      const { userId, roleId } = req.body;
      const removedBy = req.user.userId;

      if (!userId || !roleId || isNaN(parseInt(userId)) || isNaN(parseInt(roleId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid user ID and role ID are required'
        });
      }

      // Get role info before removal
      const roles = await Role.getAllRoles();
      const role = roles.find(r => r.id === parseInt(roleId));

      const removed = await Role.removeRoleFromUser(parseInt(userId), parseInt(roleId));

      if (!removed) {
        return res.status(404).json({
          success: false,
          message: 'Role assignment not found'
        });
      }

      // Log activity
      if (role) {
        await UserProfile.logActivity(removedBy, 'role_removed', {
          targetUserId: parseInt(userId),
          roleId: parseInt(roleId),
          roleName: role.name
        }, req);
      }

      res.json({
        success: true,
        message: 'Role removed successfully'
      });
    } catch (error) {
      console.error('Remove role error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove role'
      });
    }
  }

  /**
   * Check user permissions (for debugging/frontend)
   */
  static async checkUserPermissions(req, res) {
    try {
      const userId = req.user.userId;
      const { permission } = req.query;

      if (permission) {
        const hasPermission = await Role.userHasPermission(userId, permission);
        return res.json({
          success: true,
          data: {
            user_id: userId,
            permission,
            has_permission: hasPermission
          }
        });
      }

      // Return all user permissions
      const roles = await Role.getUserRoles(userId);
      const allPermissions = roles.reduce((acc, role) => {
        return acc.concat(role.permissions.map(p => p.name));
      }, []);

      res.json({
        success: true,
        data: {
          user_id: userId,
          roles,
          permissions: [...new Set(allPermissions)]
        }
      });
    } catch (error) {
      console.error('Check permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check permissions'
      });
    }
  }
}

module.exports = RoleController;
