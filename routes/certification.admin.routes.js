const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certification.controller');
const { upload } = require('../middleware/upload.middleware');

/**
 * @route   GET /api/admin/certifications
 * @desc    Get all certifications for admin management
 * @access  Private/Admin
 */
router.get('/', certificationController.getAllCertificationsAdmin);

/**
 * @route   POST /api/admin/certifications
 * @desc    Create new certification
 * @access  Private/Admin
 */
router.post('/', upload.single('image'), certificationController.createCertification);

/**
 * @route   PUT /api/admin/certifications/reorder
 * @desc    Reorder certifications
 * @access  Private/Admin
 */
router.put('/reorder', certificationController.reorderCertifications);

/**
 * @route   PUT /api/admin/certifications/:id
 * @desc    Update certification
 * @access  Private/Admin
 */
router.put('/:id', upload.single('image'), certificationController.updateCertification);

/**
 * @route   DELETE /api/admin/certifications/:id
 * @desc    Delete certification
 * @access  Private/Admin
 */
router.delete('/:id', certificationController.deleteCertification);

module.exports = router;
