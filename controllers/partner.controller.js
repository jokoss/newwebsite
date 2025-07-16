const { Partner } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Get all partners
exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.findAll({
      order: [
        ['displayOrder', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });
    
    return res.status(200).json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch partners',
      error: error.message
    });
  }
};

// Get active partners for public display
exports.getActivePartners = async (req, res) => {
  try {
    const partners = await Partner.findAll({
      where: { isActive: true },
      order: [
        ['displayOrder', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });
    
    return res.status(200).json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Error fetching active partners:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch active partners',
      error: error.message
    });
  }
};

// Get partner by ID
exports.getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const partner = await Partner.findByPk(id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    console.error('Error fetching partner:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch partner',
      error: error.message
    });
  }
};

// Create new partner
exports.createPartner = async (req, res) => {
  try {
    const { name, website, description, displayOrder, isActive } = req.body;
    
    // Handle logo upload
    let logo = null;
    if (req.file) {
      logo = `/uploads/${req.file.filename}`;
    }
    
    const partner = await Partner.create({
      name,
      logo,
      website,
      description,
      displayOrder: displayOrder || 0,
      isActive: isActive === undefined ? true : isActive
    });
    
    return res.status(201).json({
      success: true,
      message: 'Partner created successfully',
      data: partner
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create partner',
      error: error.message
    });
  }
};

// Update partner
exports.updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, website, description, displayOrder, isActive } = req.body;
    
    const partner = await Partner.findByPk(id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    // Handle logo upload
    let logo = partner.logo;
    if (req.file) {
      // Delete old logo if exists
      if (partner.logo) {
        const oldLogoPath = path.join(__dirname, '..', partner.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      logo = `/uploads/${req.file.filename}`;
    }
    
    await partner.update({
      name: name || partner.name,
      logo,
      website: website !== undefined ? website : partner.website,
      description: description !== undefined ? description : partner.description,
      displayOrder: displayOrder !== undefined ? displayOrder : partner.displayOrder,
      isActive: isActive !== undefined ? isActive : partner.isActive
    });
    
    return res.status(200).json({
      success: true,
      message: 'Partner updated successfully',
      data: partner
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update partner',
      error: error.message
    });
  }
};

// Delete partner
exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const partner = await Partner.findByPk(id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    // Delete logo file if exists
    if (partner.logo) {
      const logoPath = path.join(__dirname, '..', partner.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    
    await partner.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete partner',
      error: error.message
    });
  }
};

// Update display order
exports.updateDisplayOrder = async (req, res) => {
  try {
    const { partners } = req.body;
    
    if (!Array.isArray(partners)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected an array of partners.'
      });
    }
    
    // Update each partner's display order
    for (const item of partners) {
      await Partner.update(
        { displayOrder: item.displayOrder },
        { where: { id: item.id } }
      );
    }
    
    return res.status(200).json({
      success: true,
      message: 'Display order updated successfully'
    });
  } catch (error) {
    console.error('Error updating display order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update display order',
      error: error.message
    });
  }
};
