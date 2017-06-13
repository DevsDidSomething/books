'use strict';
module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    pageCount: DataTypes.INTEGER,
    author: DataTypes.STRING,
    categories: DataTypes.STRING,
    publishedDate: DataTypes.STRING,
    small_image_src: DataTypes.STRING,
    large_image_src: DataTypes.STRING,
    google_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Book.belongsToMany(models.Mix, {through: 'BookMix'});
      }
    }
  });
  return Book;
};
