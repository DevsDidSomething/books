'use strict';
module.exports = function(sequelize, DataTypes) {
  var Mix = sequelize.define('Mix', {
    name: DataTypes.STRING,
    webstring: DataTypes.STRING,
    uid: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Mix.belongsToMany(models.Book, {through: 'BookMix'})
        Mix.belongsTo(models.User, {
          onDelete: 'CASCADE'
        })
      }
    }
  });
  return Mix;
};
