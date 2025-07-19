const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');

// Admin routes for tests
router.get('/', testController.getAllTestsAdmin);
router.post('/', testController.createTest);
router.put('/reorder', testController.reorderTests);
router.put('/:id', testController.updateTest);
router.delete('/:id', testController.deleteTest);
router.patch('/:id/toggle', testController.toggleTestStatus);

module.exports = router;
