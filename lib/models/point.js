'use strict';

module.exports = function (sequelize, DataTypes) {
  var Point = sequelize.define('Point', {
    latitude: DataTypes.DECIMAL(20, 10),
    longitude: DataTypes.DECIMAL(20, 10)
  }, {
    classMethods: {
      associate: function (models) {
        Point.belongsTo(models.Ride);
      }
    }
  });

  return Point;
};
