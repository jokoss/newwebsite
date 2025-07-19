const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');
const { upload, uploadErrorHandler } = require('../middleware/upload.middleware');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin routes are now in category.admin.routes.js

module.exports = router;
