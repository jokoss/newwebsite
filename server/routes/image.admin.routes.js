const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');
const { upload } = require('../middleware/upload.middleware');

/**
 * @route   GET /api/admin/images
 * @desc    Get all images for admin management
 * @access  Private/Admin
 */
router.get('/', imageController.getAllImagesAdmin);

/**
 * @route   GET /api/admin/images/unused
 * @desc    Get all unused images
 * @access  Private/Admin
 */
router.get('/unused', imageController.getUnusedImagesAdmin);

/**
 * @route   POST /api/admin/images
 * @desc    Upload new image
 * @access  Private/Admin
 */
router.post('/', upload.single('image'), imageController.createImage);

/**
 * @route   PUT /api/admin/images/:id
 * @desc    Update image metadata or replace image
 * @access  Private/Admin
 */
router.put('/:id', upload.single('image'), imageController.updateImage);

/**
 * @route   DELETE /api/admin/images/:id
 * @desc    Delete image
 * @access  Private/Admin
 */
router.delete('/:id', imageController.deleteImage);

/**
 * @route   DELETE /api/admin/images/bulk
 * @desc    Bulk delete images
 * @access  Private/Admin
 */
router.delete('/bulk', imageController.bulkDeleteImages);

module.exports = router;
