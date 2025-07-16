const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { upload, uploadErrorHandler } = require('../middleware/upload.middleware');

// Admin routes
router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPostById);
router.post('/', upload.single('featuredImage'), uploadErrorHandler, blogController.createPost);
router.put('/:id', upload.single('featuredImage'), uploadErrorHandler, blogController.updatePost);
router.delete('/:id', blogController.deletePost);

module.exports = router;
