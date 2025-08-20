const Role = require('../models/Role');

class PermissionUtils {
  /**
   * Check if user can access resource
   */
  static async canAccessResource(userId, resource, action) {
    const permissionName = `${resource}.${action}`;
    return await Role.userHasPermission(userId, permissionName);
  }

  /**
   * Check if user can perform any of the actions on resource
   */
  static async canPerformAnyAction(userId, resource, actions) {
    const permissions = actions.map(action => `${resource}.${action}`);
    return await Role.userHasAnyPermission(userId, permissions);
  }

  /**
   * Get user's permissions for a specific resource
   */
  static async getUserResourcePermissions(userId, resource) {
    const roles = await Role.getUserRoles(userId);
    const resourcePermissions = [];

    roles.forEach(role => {
      role.permissions.forEach(permission => {
        if (permission.resource === resource) {
          resourcePermissions.push(permission.action);
        }
      });
    });

    return [...new Set(resourcePermissions)];
  }

  /**
   * Check if user is admin (has system.admin permission)
   */
  static async isAdmin(userId) {
    return await Role.userHasPermission(userId, 'system.admin');
  }

  /**
   * Check if user is moderator (has system.moderate permission)
   */
  static async isModerator(userId) {
    return await Role.userHasPermission(userId, 'system.moderate');
  }
}

module.exports = PermissionUtils;
