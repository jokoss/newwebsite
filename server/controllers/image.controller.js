const { Image } = require('../models/index');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sizeOf = promisify(require('image-size'));

/**
 * Get all images (admin)
 * @route GET /api/admin/images
 * @access Private/Admin
 */
exports.getAllImagesAdmin = async (req, res) => {
  try {
    const { type, referenceId } = req.query;
    const whereClause = {};
    
    // Filter by type if provided
    if (type) {
      whereClause.type = type;
    }
    
    // Filter by referenceId if provided
    if (referenceId) {
      whereClause.referenceId = referenceId;
    }
    
    const images = await Image.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('Get all images admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get unused images (admin)
 * @route GET /api/admin/images/unused
 * @access Private/Admin
 */
exports.getUnusedImagesAdmin = async (req, res) => {
  try {
    // Get all images that don't have a referenceId
    const images = await Image.findAll({
      where: {
        referenceId: null
      },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('Get unused images admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new image (admin)
 * @route POST /api/admin/images
 * @access Private/Admin
 */
exports.createImage = async (req, res) => {
  const transaction = await Image.sequelize.transaction();
  
  try {
    const { name, description, altText, type, referenceId } = req.body;
    
    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file'
      });
    }
    
    if (!name) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide an image name'
      });
    }
    
    const filePath = `/uploads/${req.file.filename}`;
    const fullPath = path.join(__dirname, '..', filePath);
    
    // Get image dimensions and size
    let dimensions = { width: null, height: null };
    try {
      dimensions = await sizeOf(fullPath);
    } catch (err) {
      console.error('Error getting image dimensions:', err);
    }
    
    // Create image record
    const image = await Image.create({
      name,
      description,
      filePath,
      altText: altText || name,
      width: dimensions.width,
      height: dimensions.height,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      type: type || 'general',
      referenceId: referenceId || null
    }, { transaction });
    
    await transaction.commit();
    
    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: image
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update image (admin)
 * @route PUT /api/admin/images/:id
 * @access Private/Admin
 */
exports.updateImage = async (req, res) => {
  const transaction = await Image.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { name, description, altText, type, referenceId, isActive } = req.body;
    
    // Find image
    const image = await Image.findByPk(id);
    
    if (!image) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    // Update file if provided
    if (req.file) {
      // Delete old file
      if (image.filePath) {
        const oldImagePath = path.join(__dirname, '..', image.filePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      const filePath = `/uploads/${req.file.filename}`;
      const fullPath = path.join(__dirname, '..', filePath);
      
      // Get image dimensions and size
      let dimensions = { width: null, height: null };
      try {
        dimensions = await sizeOf(fullPath);
      } catch (err) {
        console.error('Error getting image dimensions:', err);
      }
      
      image.filePath = filePath;
      image.width = dimensions.width;
      image.height = dimensions.height;
      image.fileSize = req.file.size;
      image.mimeType = req.file.mimetype;
    }
    
    // Update other fields
    if (name) image.name = name;
    if (description !== undefined) image.description = description;
    if (altText !== undefined) image.altText = altText;
    if (type) image.type = type;
    if (referenceId !== undefined) image.referenceId = referenceId;
    if (isActive !== undefined) image.isActive = isActive;
    
    await image.save({ transaction });
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Image updated successfully',
      data: image
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete image (admin)
 * @route DELETE /api/admin/images/:id
 * @access Private/Admin
 */
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find image
    const image = await Image.findByPk(id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    // Delete image (file will be deleted by beforeDestroy hook)
    await image.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Bulk delete images (admin)
 * @route DELETE /api/admin/images/bulk
 * @access Private/Admin
 */
exports.bulkDeleteImages = async (req, res) => {
  const transaction = await Image.sequelize.transaction();
  
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of image IDs'
      });
    }
    
    // Find all images to delete
    const images = await Image.findAll({
      where: {
        id: ids
      }
    });
    
    // Delete each image
    for (const image of images) {
      await image.destroy({ transaction });
    }
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${images.length} images`
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Bulk delete images error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
