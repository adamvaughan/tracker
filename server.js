'use strict';

var express = require('express');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');
var app = express();
var db = require('./lib/models');

require('./lib/config/express')(app);
require('./lib/routes')(app);

db.sequelize
  .sync()
  .complete(function (err) {
    if (err) {
      throw err;
    }

    app.listen(config.port, function () {
      console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
    });
  });

exports = module.exports = app;
