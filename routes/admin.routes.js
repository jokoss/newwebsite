const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Protect all admin routes
router.use(authenticateToken);
router.use(isAdmin);

// Import admin route modules
const categoryAdminRoutes = require('./category.admin.routes');
const testAdminRoutes = require('./test.admin.routes');
const certificationAdminRoutes = require('./certification.admin.routes');
const imageAdminRoutes = require('./image.admin.routes');
const partnerAdminRoutes = require('./partner.admin.routes');
const blogAdminRoutes = require('./blog.admin.routes');

// Use admin route modules
router.use('/categories', categoryAdminRoutes);
router.use('/tests', testAdminRoutes);
router.use('/certifications', certificationAdminRoutes);
router.use('/images', imageAdminRoutes);
router.use('/partners', partnerAdminRoutes);
router.use('/blog', blogAdminRoutes);

module.exports = router;
