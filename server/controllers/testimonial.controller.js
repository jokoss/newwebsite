const { Testimonial } = require('../models');
const { Op } = require('sequelize');

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [['displayOrder', 'ASC']],
    });
    return res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
};

// Get active testimonials for public display
exports.getActiveTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isActive: true },
      order: [['displayOrder', 'ASC']],
    });
    return res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching active testimonials:', error);
    return res.status(500).json({ message: 'Error fetching active testimonials', error: error.message });
  }
};

// Get testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    return res.status(200).json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return res.status(500).json({ message: 'Error fetching testimonial', error: error.message });
  }
};

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, company, quote, avatar, isActive } = req.body;
    
    // Get the highest display order
    const maxOrderResult = await Testimonial.findOne({
      attributes: [
        [Testimonial.sequelize.fn('MAX', Testimonial.sequelize.col('displayOrder')), 'maxOrder']
      ],
      raw: true
    });
    
    const maxOrder = maxOrderResult.maxOrder || 0;
    const newDisplayOrder = maxOrder + 1;
    
    const testimonial = await Testimonial.create({
      name,
      role,
      company,
      quote,
      avatar,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: newDisplayOrder
    });
    
    return res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return res.status(500).json({ message: 'Error creating testimonial', error: error.message });
  }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, company, quote, avatar, isActive, displayOrder } = req.body;
    
    const testimonial = await Testimonial.findByPk(id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    await testimonial.update({
      name: name || testimonial.name,
      role: role || testimonial.role,
      company: company || testimonial.company,
      quote: quote || testimonial.quote,
      avatar: avatar !== undefined ? avatar : testimonial.avatar,
      isActive: isActive !== undefined ? isActive : testimonial.isActive,
      displayOrder: displayOrder !== undefined ? displayOrder : testimonial.displayOrder
    });
    
    return res.status(200).json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return res.status(500).json({ message: 'Error updating testimonial', error: error.message });
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    
    const testimonial = await Testimonial.findByPk(id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    await testimonial.destroy();
    
    return res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
  }
};

// Update display order of testimonials
exports.updateDisplayOrder = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds must be an array' });
    }
    
    // Update each testimonial's display order
    for (let i = 0; i < orderedIds.length; i++) {
      await Testimonial.update(
        { displayOrder: i + 1 },
        { where: { id: orderedIds[i] } }
      );
    }
    
    // Get the updated testimonials
    const updatedTestimonials = await Testimonial.findAll({
      order: [['displayOrder', 'ASC']],
    });
    
    return res.status(200).json(updatedTestimonials);
  } catch (error) {
    console.error('Error updating display order:', error);
    return res.status(500).json({ message: 'Error updating display order', error: error.message });
  }
};
