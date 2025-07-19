const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const fs = require('fs');
const path = require('path');

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  altText: {
    type: DataTypes.STRING,
    allowNull: true
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('category', 'test', 'certification', 'general'),
    defaultValue: 'general'
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'images',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeDestroy: async (image) => {
      // Delete the actual file when the image record is deleted
      if (image.filePath && image.filePath.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '..', image.filePath);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
  }
});

module.exports = Image;
