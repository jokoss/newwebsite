const { Certification } = require('../models/index');
const fs = require('fs');
const path = require('path');

/**
 * Get all certifications (public)
 * @route GET /api/certifications
 * @access Public
 */
exports.getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.findAll({
      where: { 
        isActive: true, 
        isDisplayed: true 
      },
      order: [['sortOrder', 'ASC'], ['name', 'ASC']],
      attributes: ['id', 'name', 'description', 'imageUrl', 'externalUrl']
    });

    return res.status(200).json({
      success: true,
      count: certifications.length,
      data: certifications
    });
  } catch (error) {
    console.error('Get all certifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all certifications (admin)
 * @route GET /api/admin/certifications
 * @access Private/Admin
 */
exports.getAllCertificationsAdmin = async (req, res) => {
  try {
    const certifications = await Certification.findAll({
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: certifications.length,
      data: certifications
    });
  } catch (error) {
    console.error('Get all certifications admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new certification (admin)
 * @route POST /api/admin/certifications
 * @access Private/Admin
 */
exports.createCertification = async (req, res) => {
  const transaction = await Certification.sequelize.transaction();
  
  try {
    const { name, description, externalUrl, sortOrder, isActive, isDisplayed } = req.body;
    
    console.log('Received data for new certification:', req.body);
    
    if (!name) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide a certification name'
      });
    }
    
    // Handle file upload if present
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      console.log('Image uploaded:', imageUrl);
    }
    
    // Create certification with transaction
    const certification = await Certification.create({
      name,
      description,
      imageUrl,
      externalUrl,
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
      isDisplayed: isDisplayed !== undefined ? isDisplayed : true
    }, { transaction });

    await transaction.commit();
    console.log('Certification created successfully:', certification.toJSON());
    
    return res.status(201).json({
      success: true,
      message: 'Certification created successfully',
      data: certification
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create certification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update certification (admin)
 * @route PUT /api/admin/certifications/:id
 * @access Private/Admin
 */
exports.updateCertification = async (req, res) => {
  const transaction = await Certification.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { name, description, externalUrl, sortOrder, isActive, isDisplayed } = req.body;
    
    // Find certification
    const certification = await Certification.findByPk(id);
    
    if (!certification) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }
    
    // Handle file upload if present
    if (req.file) {
      // Delete old image if exists
      if (certification.imageUrl && certification.imageUrl.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', certification.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      certification.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Update other fields
    if (name) certification.name = name;
    if (description !== undefined) certification.description = description;
    if (externalUrl !== undefined) certification.externalUrl = externalUrl;
    if (sortOrder !== undefined) certification.sortOrder = sortOrder;
    if (isActive !== undefined) certification.isActive = isActive;
    if (isDisplayed !== undefined) certification.isDisplayed = isDisplayed;
    
    await certification.save({ transaction });
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Certification updated successfully',
      data: certification
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update certification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete certification (admin)
 * @route DELETE /api/admin/certifications/:id
 * @access Private/Admin
 */
exports.deleteCertification = async (req, res) => {
  const transaction = await Certification.sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Find certification
    const certification = await Certification.findByPk(id);
    
    if (!certification) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }
    
    // Delete image if exists
    if (certification.imageUrl && certification.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', certification.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete certification with transaction
    await certification.destroy({ transaction });
    await transaction.commit();
    
    console.log('Certification deleted successfully:', id);
    
    return res.status(200).json({
      success: true,
      message: 'Certification deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete certification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update certification order (admin)
 * @route PUT /api/admin/certifications/reorder
 * @access Private/Admin
 */
exports.reorderCertifications = async (req, res) => {
  const transaction = await Certification.sequelize.transaction();
  
  try {
    const { certifications } = req.body; // Array of { id, sortOrder }
    
    if (!Array.isArray(certifications)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Certifications array is required'
      });
    }
    
    // Update sort order for each certification
    for (const cert of certifications) {
      await Certification.update(
        { sortOrder: cert.sortOrder },
        { where: { id: cert.id }, transaction }
      );
    }
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Certification order updated successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Reorder certifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
