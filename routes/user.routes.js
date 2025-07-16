const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, isSuperAdmin } = require('../middleware/auth.middleware');

// All routes require authentication and super admin privileges
router.get('/', authenticateToken, isSuperAdmin, userController.getAllUsers);
router.get('/:id', authenticateToken, isSuperAdmin, userController.getUserById);
router.post('/', authenticateToken, isSuperAdmin, userController.createUser);
router.put('/:id', authenticateToken, isSuperAdmin, userController.updateUser);
router.put('/:id/reset-password', authenticateToken, isSuperAdmin, userController.resetPassword);
router.delete('/:id', authenticateToken, isSuperAdmin, userController.deleteUser);

module.exports = router;
