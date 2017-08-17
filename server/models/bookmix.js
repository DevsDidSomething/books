'use strict';
module.exports = function(sequelize, DataTypes) {
  var BookMix = sequelize.define('BookMix', {
    BookId: DataTypes.INTEGER,
    MixId: DataTypes.INTEGER,
    order: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return BookMix;
};