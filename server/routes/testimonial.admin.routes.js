const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Admin routes - all require authentication and admin privileges
router.use(require('../middleware/auth.middleware').authenticateToken);
router.use(require('../middleware/auth.middleware').isAdmin);

// Get all testimonials (including inactive ones)
router.get('/', testimonialController.getAllTestimonials);

// Create a new testimonial
router.post('/', testimonialController.createTestimonial);

// Update a testimonial
router.put('/:id', testimonialController.updateTestimonial);

// Delete a testimonial
router.delete('/:id', testimonialController.deleteTestimonial);

// Update display order
router.put('/order/update', testimonialController.updateDisplayOrder);

module.exports = router;
