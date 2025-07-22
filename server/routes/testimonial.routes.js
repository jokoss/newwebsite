const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');

// Public routes
router.get('/', testimonialController.getActiveTestimonials);
router.get('/:id', testimonialController.getTestimonialById);

module.exports = router;
