const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certification.controller');

/**
 * @route   GET /api/certifications
 * @desc    Get all active certifications for public display
 * @access  Public
 */
router.get('/', certificationController.getAllCertifications);

module.exports = router;
