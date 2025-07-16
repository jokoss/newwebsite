const { Test, Category } = require('../models/index');

/**
 * Get all tests (public)
 * @route GET /api/tests
 * @access Public
 */
exports.getAllTests = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const whereClause = { active: true };
    
    // Filter by category if provided
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    
    const tests = await Test.findAll({
      where: whereClause,
      order: [['displayOrder', 'ASC'], ['name', 'ASC']],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    return res.status(200).json({
      success: true,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    console.error('Get all tests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get single test by ID (public)
 * @route GET /api/tests/:id
 * @access Public
 */
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const test = await Test.findOne({
      where: { id, active: true },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: test
    });
  } catch (error) {
    console.error('Get test by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new test (admin)
 * @route POST /api/admin/tests
 * @access Private/Admin
 */
exports.createTest = async (req, res) => {
  const transaction = await Test.sequelize.transaction();
  try {
    const { 
      name, 
      description, 
      price, 
      categoryId, 
      turnaroundTime, 
      methodReference,
      displayOrder 
    } = req.body;
    
    console.log('Received data for new test:', req.body);

    if (!name || !categoryId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide test name and category'
      });
    }
    
    // Verify category exists
    const category = await Category.findByPk(categoryId, { transaction });
    if (!category) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Create test
    const test = await Test.create({
      name,
      description,
      price: price || 0,
      categoryId,
      turnaroundTime,
      methodReference,
      displayOrder: displayOrder || 0
    }, { transaction });
    
    await transaction.commit();
    console.log('Test created successfully:', test.toJSON());
    
    return res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: test
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update test (admin)
 * @route PUT /api/admin/tests/:id
 * @access Private/Admin
 */
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price, 
      categoryId, 
      turnaroundTime, 
      methodReference,
      active,
      displayOrder 
    } = req.body;
    
    // Find test
    const test = await Test.findByPk(id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    // Verify category exists if changing
    if (categoryId && categoryId !== test.categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      test.categoryId = categoryId;
    }
    
    // Update fields
    if (name) test.name = name;
    if (description !== undefined) test.description = description;
    if (price !== undefined) test.price = price;
    if (turnaroundTime !== undefined) test.turnaroundTime = turnaroundTime;
    if (methodReference !== undefined) test.methodReference = methodReference;
    if (active !== undefined) test.active = active;
    if (displayOrder !== undefined) test.displayOrder = displayOrder;
    
    await test.save();
    
    return res.status(200).json({
      success: true,
      message: 'Test updated successfully',
      data: test
    });
  } catch (error) {
    console.error('Update test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete test (admin)
 * @route DELETE /api/admin/tests/:id
 * @access Private/Admin
 */
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find test
    const test = await Test.findByPk(id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    // Delete test
    await test.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    console.error('Delete test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all tests (admin)
 * @route GET /api/admin/tests
 * @access Private/Admin
 */
exports.getAllTestsAdmin = async (req, res) => {
  try {
    const tests = await Test.findAll({
      order: [['displayOrder', 'ASC'], ['name', 'ASC']],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    return res.status(200).json({
      success: true,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    console.error('Get all tests admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Toggle test active status (admin)
 * @route PATCH /api/admin/tests/:id/toggle
 * @access Private/Admin
 */
exports.toggleTestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find test
    const test = await Test.findByPk(id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    // Toggle status
    test.active = !test.active;
    await test.save();
    
    return res.status(200).json({
      success: true,
      message: `Test ${test.active ? 'activated' : 'deactivated'} successfully`,
      data: test
    });
  } catch (error) {
    console.error('Toggle test status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Reorder tests (admin)
 * @route PUT /api/admin/tests/reorder
 * @access Private/Admin
 */
exports.reorderTests = async (req, res) => {
  const transaction = await Test.sequelize.transaction();
  
  try {
    const { tests } = req.body; // Array of { id, displayOrder }
    
    if (!Array.isArray(tests)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Tests array is required'
      });
    }
    
    // Update display order for each test
    for (const test of tests) {
      await Test.update(
        { displayOrder: test.displayOrder },
        { where: { id: test.id }, transaction }
      );
    }
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Test order updated successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Reorder tests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
