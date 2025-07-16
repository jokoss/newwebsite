const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { upload, uploadErrorHandler } = require('../middleware/upload.middleware');

// Admin routes for categories
router.get('/', categoryController.getAllCategoriesAdmin);
router.post('/', upload.single('image'), uploadErrorHandler, categoryController.createCategory);
router.put('/reorder', categoryController.updateCategoryOrder);
router.put('/:id', upload.single('image'), uploadErrorHandler, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
