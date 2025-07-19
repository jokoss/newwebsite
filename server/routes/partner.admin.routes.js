const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partner.controller');
const { upload } = require('../middleware/upload.middleware');

// Admin routes
router.get('/', partnerController.getAllPartners);
router.get('/:id', partnerController.getPartnerById);
router.post('/', upload.single('logo'), partnerController.createPartner);
router.put('/:id', upload.single('logo'), partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);
router.post('/display-order', partnerController.updateDisplayOrder);

module.exports = router;
