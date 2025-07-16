const { Category, Test } = require('../models/index');
const fs = require('fs');
const path = require('path');

/**
 * Get all categories (public)
 * @route GET /api/categories
 * @access Public
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { active: true, parentId: null },
      order: [['displayOrder', 'ASC'], ['name', 'ASC']],
      attributes: ['id', 'name', 'description', 'imageUrl'],
      include: [{
        model: Category,
        as: 'subcategories',
        where: { active: true },
        required: false,
        attributes: ['id', 'name', 'description', 'imageUrl'],
        order: [['displayOrder', 'ASC'], ['name', 'ASC']]
      }]
    });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get single category by ID (public)
 * @route GET /api/categories/:id
 * @access Public
 */
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findOne({
      where: { id, active: true },
      include: [
        {
          model: Test,
          as: 'tests',
          where: { active: true },
          required: false,
          attributes: ['id', 'name', 'description', 'price', 'turnaroundTime', 'methodReference'],
          order: [['displayOrder', 'ASC'], ['name', 'ASC']]
        },
        {
          model: Category,
          as: 'subcategories',
          where: { active: true },
          required: false,
          attributes: ['id', 'name', 'description', 'imageUrl'],
          order: [['displayOrder', 'ASC'], ['name', 'ASC']]
        },
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new category (admin)
 * @route POST /api/admin/categories
 * @access Private/Admin
 */
exports.createCategory = async (req, res) => {
  const transaction = await Category.sequelize.transaction();
  
  try {
    const { name, description, displayOrder, parentId } = req.body;
    
    console.log('Received data for new category:', req.body);
    
    if (!name) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide a category name'
      });
    }
    
    // Handle file upload if present
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      console.log('Image uploaded:', imageUrl);
    }
    
    // Create category with transaction
    const category = await Category.create({
      name,
      description,
      imageUrl,
      displayOrder: displayOrder || 0,
      parentId: parentId || null
    }, { transaction });

    await transaction.commit();
    console.log('Category created successfully:', category.toJSON());
    
    // Fetch the category with associations to return complete data
    const completeCategory = await Category.findByPk(category.id, {
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });
    
    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: completeCategory
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update category (admin)
 * @route PUT /api/admin/categories/:id
 * @access Private/Admin
 */
exports.updateCategory = async (req, res) => {
  const transaction = await Category.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { name, description, active, displayOrder, parentId } = req.body;
    
    // Find category
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Handle file upload if present
    if (req.file) {
      // Delete old image if exists
      if (category.imageUrl && category.imageUrl.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', category.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      category.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Update other fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (active !== undefined) category.active = active;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (parentId !== undefined) category.parentId = parentId || null;
    
    // Prevent circular references
    if (parentId && parseInt(parentId) === parseInt(id)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'A category cannot be its own parent'
      });
    }
    
    await category.save({ transaction });
    await transaction.commit();
    
    // Fetch the updated category with associations
    const updatedCategory = await Category.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete category with smart options (admin)
 * @route DELETE /api/admin/categories/:id
 * @access Private/Admin
 */
exports.deleteCategory = async (req, res) => {
  const transaction = await Category.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { option, targetParentId } = req.body; // Get deletion options from request body
    
    console.log('Delete category request:', { id, option, targetParentId });
    
    // Find category
    const category = await Category.findByPk(id);
    
    if (!category) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Get subcategories
    const subcategories = await Category.findAll({ 
      where: { parentId: id },
      transaction
    });
    
    console.log(`Found ${subcategories.length} subcategories for category ${id}`);
    
    // Handle subcategories based on chosen option
    if (subcategories.length > 0) {
      switch (option) {
        case 'deleteAll':
          console.log('Deleting all subcategories');
          // Delete all subcategories and their tests
          for (const subcategory of subcategories) {
            // Delete tests associated with subcategory
            await Test.destroy({ 
              where: { categoryId: subcategory.id },
              transaction
            });
            
            // Delete subcategory image if exists
            if (subcategory.imageUrl && subcategory.imageUrl.startsWith('/uploads/')) {
              const subcategoryImagePath = path.join(__dirname, '..', subcategory.imageUrl);
              if (fs.existsSync(subcategoryImagePath)) {
                fs.unlinkSync(subcategoryImagePath);
              }
            }
            
            // Delete the subcategory
            await subcategory.destroy({ transaction });
          }
          break;
          
        case 'promoteToMain':
          console.log('Promoting subcategories to main categories');
          // Convert subcategories to main categories by setting parentId to null
          await Category.update(
            { parentId: null },
            { 
              where: { parentId: id },
              transaction
            }
          );
          break;
          
        case 'moveToParent':
          console.log('Moving subcategories to new parent:', targetParentId);
          if (!targetParentId) {
            await transaction.rollback();
            return res.status(400).json({
              success: false,
              message: 'Target parent ID is required when moving subcategories'
            });
          }
          
          // Verify target parent exists and is not the same as current category
          const targetParent = await Category.findByPk(targetParentId);
          if (!targetParent) {
            await transaction.rollback();
            return res.status(400).json({
              success: false,
              message: 'Target parent category not found'
            });
          }
          
          if (targetParent.parentId) {
            await transaction.rollback();
            return res.status(400).json({
              success: false,
              message: 'Target parent must be a main category (not a subcategory)'
            });
          }
          
          // Move subcategories to new parent
          await Category.update(
            { parentId: targetParentId },
            { 
              where: { parentId: id },
              transaction
            }
          );
          break;
          
        default:
          // If no option specified and subcategories exist, use legacy behavior
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Cannot delete category with subcategories. Please delete or reassign subcategories first.'
          });
      }
    }
    
    // Delete tests associated with the main category
    await Test.destroy({ 
      where: { categoryId: id },
      transaction
    });
    
    // Delete main category image if exists
    if (category.imageUrl && category.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', category.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete the main category
    await category.destroy({ transaction });
    await transaction.commit();
    
    console.log('Category deleted successfully:', id);
    
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all categories (admin)
 * @route GET /api/admin/categories
 * @access Private/Admin
 */
exports.getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['displayOrder', 'ASC'], ['name', 'ASC']],
      include: [
        {
          model: Test,
          as: 'tests',
          required: false,
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'subcategories',
          required: false,
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'parent',
          required: false,
          attributes: ['id', 'name']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get all categories admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update category display order (admin)
 * @route PUT /api/admin/categories/reorder
 * @access Private/Admin
 */
exports.updateCategoryOrder = async (req, res) => {
  const transaction = await Category.sequelize.transaction();
  
  try {
    const { categories } = req.body;
    
    if (!categories || !Array.isArray(categories)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Invalid request format. Expected an array of categories with id and displayOrder.'
      });
    }
    
    console.log('Updating category order:', categories);
    
    // Update each category's display order
    for (const item of categories) {
      if (!item.id || typeof item.displayOrder !== 'number') {
        continue; // Skip invalid entries
      }
      
      await Category.update(
        { displayOrder: item.displayOrder },
        { 
          where: { id: item.id },
          transaction
        }
      );
    }
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Category order updated successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update category order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
