const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Test = require('./Test');
const Certification = require('./Certification');
const Image = require('./Image');
const Partner = require('./Partner');
const BlogPost = require('./BlogPost');

// Define associations
Category.hasMany(Test, {
  foreignKey: 'categoryId',
  as: 'tests'
});

Test.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

// Note: Self-referential relationships for Category are defined in the Category model

// Export models
const models = {
  User,
  Category,
  Test,
  Certification,
  Image,
  Partner,
  BlogPost,
  sequelize
};

// Call the associate method for each model that has one
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
