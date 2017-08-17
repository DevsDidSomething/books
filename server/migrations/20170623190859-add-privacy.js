'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Mixes', 'isPrivate', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Mixes', 'isPrivate');
  }
};
