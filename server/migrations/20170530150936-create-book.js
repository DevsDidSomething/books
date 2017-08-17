'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      subtitle: {
        type: Sequelize.STRING
      },
      pageCount: {
        type: Sequelize.INTEGER
      },
      author: {
        type: Sequelize.STRING
      },
      categories: {
        type: Sequelize.STRING
      },
      publishedDate: {
        type: Sequelize.STRING
      },
      small_image_src: {
        type: Sequelize.STRING
      },
      large_image_src: {
        type: Sequelize.STRING
      },
      google_id: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Books', {cascade: true});
  }
};
