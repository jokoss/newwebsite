const { Category, Test, Certification } = require('../models/index');

/**
 * Get dashboard data (admin)
 * @route GET /api/admin/dashboard
 * @access Private/Admin
 */
exports.getDashboardData = async (req, res) => {
  try {
    // Get category count
    const categoriesCount = await Category.count();
    
    // Get test count
    const testsCount = await Test.count();
    
    // Get certification count
    const certificationsCount = await Certification.count();
    
    // Get recent tests
    const recentTests = await Test.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });
    
    return res.status(200).json({
      success: true,
      stats: {
        categoriesCount,
        testsCount,
        certificationsCount
      },
      recentTests: recentTests.map(test => ({
        id: test.id,
        name: test.name,
        category: test.category ? test.category.name : 'Uncategorized',
        price: test.price,
        createdAt: test.createdAt.toISOString().split('T')[0]
      }))
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
