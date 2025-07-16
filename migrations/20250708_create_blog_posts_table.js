'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BlogPosts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      authorName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      featuredImage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      publishedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      schemaMarkup: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON-LD schema markup for the article'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BlogPosts');
  }
};
