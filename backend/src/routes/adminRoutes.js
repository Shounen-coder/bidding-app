const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/admin/roleController');
const { authenticateToken, requirePermission, requireAdmin } = require('../middleware/auth/authMiddleware');

// All admin routes require authentication
router.use(authenticateToken);

// Role and permission management (admin only)
router.get('/roles', requirePermission(['system.admin']), RoleController.getAllRoles);
router.get('/permissions', requirePermission(['system.admin']), RoleController.getAllPermissions);
router.get('/users/:userId/roles', requirePermission(['users.read', 'system.admin']), RoleController.getUserRoles);
router.post('/users/assign-role', requirePermission(['users.manage_roles']), RoleController.assignRole);
router.post('/users/remove-role', requirePermission(['users.manage_roles']), RoleController.removeRole);

// Permission checking endpoint
router.get('/my-permissions', RoleController.checkUserPermissions);

// Admin dashboard stats (we'll implement this later)
// router.get('/dashboard/stats', requireAdmin, AdminController.getDashboardStats);

module.exports = router;
