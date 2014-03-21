'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var config = require('../config/config');
var Sequelize = require('sequelize');
var db = {};
var files = fs.readdirSync(__dirname);
var sequelize = new Sequelize(config.database.name, config.database.username, config.database.password, {
  host: config.database.host,
  port: config.database.port,
  dialect: 'postgres'
});

_.each(files, function (file) {
  if (file.indexOf('.') !== 0 && file !== 'index.js') {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  }
});

_.each(db, function (model) {
  if ('associate' in model) {
    model.associate(db);
  }
});

module.exports = _.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);
