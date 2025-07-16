const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', testController.getAllTests);
router.get('/:id', testController.getTestById);

// Admin routes are now in test.admin.routes.js

module.exports = router;
