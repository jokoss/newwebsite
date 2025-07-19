const { BlogPost } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

/**
 * Get all published blog posts (public)
 * @route GET /api/blog
 * @access Public
 */
exports.getAllPublishedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: posts } = await BlogPost.findAndCountAll({
      where: { 
        isPublished: true,
        publishedAt: { [Op.not]: null }
      },
      order: [['publishedAt', 'DESC']],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(count / limit);
    
    return res.status(200).json({
      success: true,
      count,
      totalPages,
      currentPage: page,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get single blog post by slug (public)
 * @route GET /api/blog/:slug
 * @access Public
 */
exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await BlogPost.findOne({
      where: { 
        slug,
        isPublished: true,
        publishedAt: { [Op.not]: null }
      }
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all blog posts (admin)
 * @route GET /api/admin/blog
 * @access Private/Admin
 */
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: posts } = await BlogPost.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(count / limit);
    
    return res.status(200).json({
      success: true,
      count,
      totalPages,
      currentPage: page,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get single blog post by ID (admin)
 * @route GET /api/admin/blog/:id
 * @access Private/Admin
 */
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await BlogPost.findByPk(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new blog post (admin)
 * @route POST /api/admin/blog
 * @access Private/Admin
 */
exports.createPost = async (req, res) => {
  const transaction = await BlogPost.sequelize.transaction();
  
  try {
    const { 
      title, 
      content, 
      authorName, 
      isPublished, 
      schemaMarkup,
      slug: customSlug
    } = req.body;
    
    if (!title || !content || !authorName) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, and author name'
      });
    }
    
    // Generate slug from title if not provided
    const slug = customSlug || slugify(title, { 
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
    
    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ 
      where: { slug },
      transaction
    });
    
    if (existingPost) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'A blog post with this slug already exists'
      });
    }
    
    // Handle file upload if present
    let featuredImage = null;
    if (req.file) {
      featuredImage = `/uploads/${req.file.filename}`;
    }
    
    // Set published date if post is published
    const publishedAt = isPublished ? new Date() : null;
    
    // Create blog post
    const post = await BlogPost.create({
      title,
      slug,
      content,
      authorName,
      featuredImage,
      isPublished: isPublished || false,
      publishedAt,
      schemaMarkup
    }, { transaction });
    
    await transaction.commit();
    
    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating blog post:', error);
    
    // Handle specific validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update blog post (admin)
 * @route PUT /api/admin/blog/:id
 * @access Private/Admin
 */
exports.updatePost = async (req, res) => {
  const transaction = await BlogPost.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { 
      title, 
      content, 
      authorName, 
      isPublished, 
      schemaMarkup,
      slug: customSlug
    } = req.body;
    
    // Find post
    const post = await BlogPost.findByPk(id, { transaction });
    
    if (!post) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Generate new slug if title changed and custom slug not provided
    let slug = post.slug;
    if (title && title !== post.title && !customSlug) {
      slug = slugify(title, { 
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
    } else if (customSlug) {
      slug = customSlug;
    }
    
    // Check if new slug already exists (if changed)
    if (slug !== post.slug) {
      const existingPost = await BlogPost.findOne({ 
        where: { 
          slug,
          id: { [Op.ne]: id } // Exclude current post
        },
        transaction
      });
      
      if (existingPost) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'A blog post with this slug already exists'
        });
      }
    }
    
    // Handle file upload if present
    let featuredImage = post.featuredImage;
    if (req.file) {
      // Delete old image if exists
      if (post.featuredImage && post.featuredImage.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', post.featuredImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      featuredImage = `/uploads/${req.file.filename}`;
    }
    
    // Check if publishing status changed
    let publishedAt = post.publishedAt;
    if (isPublished !== undefined && isPublished !== post.isPublished) {
      if (isPublished && !post.isPublished) {
        // If publishing for the first time
        publishedAt = new Date();
      } else if (!isPublished) {
        // If unpublishing
        publishedAt = null;
      }
    }
    
    // Update post
    await post.update({
      title: title || post.title,
      slug,
      content: content || post.content,
      authorName: authorName || post.authorName,
      featuredImage,
      isPublished: isPublished !== undefined ? isPublished : post.isPublished,
      publishedAt,
      schemaMarkup: schemaMarkup !== undefined ? schemaMarkup : post.schemaMarkup
    }, { transaction });
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: post
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating blog post:', error);
    
    // Handle specific validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete blog post (admin)
 * @route DELETE /api/admin/blog/:id
 * @access Private/Admin
 */
exports.deletePost = async (req, res) => {
  const transaction = await BlogPost.sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Find post
    const post = await BlogPost.findByPk(id, { transaction });
    
    if (!post) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Delete featured image if exists
    if (post.featuredImage && post.featuredImage.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', post.featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete post
    await post.destroy({ transaction });
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting blog post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
