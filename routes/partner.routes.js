const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partner.controller');

// Public routes
router.get('/', partnerController.getActivePartners);
router.get('/:id', partnerController.getPartnerById);

module.exports = router;
