'use strict';

module.exports = function (sequelize, DataTypes) {
  var Ride = sequelize.define('Ride', {
    name: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Ride.hasMany(models.Point);
      }
    }
  });

  return Ride;
};
