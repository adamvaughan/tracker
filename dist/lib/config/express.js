'use strict';

var express = require('express');
var path = require('path');
var config = require('./config');

module.exports = function (app) {
  app.configure('development', function () {
    app.use(require('connect-livereload')());

    // disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'app')));
    app.use(express.errorHandler());
    app.set('views', path.join(config.root, 'app', 'views'));
  });

  app.configure('production', function () {
    app.use(express.static(path.join(config.root, 'public')));
    app.set('views', path.join(config.root, 'views'));
  });

  app.configure(function () {
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(app.router);
  });
};
