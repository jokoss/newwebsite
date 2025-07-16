const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');

// Public routes
router.get('/', blogController.getAllPublishedPosts);
router.get('/:slug', blogController.getPostBySlug);

module.exports = router;
