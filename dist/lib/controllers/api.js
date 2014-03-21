'use strict';

var formidable = require('formidable');
var models = require('../models');
var routeParser = require('../route_parser');
var Ride = models.Ride;
var Point = models.Point;
var MessageLoader = require('../message_loader');

exports.rides = function (req, res) {
  Ride.all()
    .success(function (rides) {
      res.json(rides);
    })
    .error(function () {
      console.log('error finding rides');
      res.send(400, 'Bad Request');
    });
};

exports.ride = function (req, res) {
  Ride.find(req.params.id, { include: [Point] })
    .success(function (ride) {
      res.json(ride);
    })
    .error(function () {
      console.log('error finding ride');
      res.send(400, 'Bad Request');
    });
};

exports.createRide = function (req, res) {
  Ride.create(req.body.ride, { fields: ['name', 'link'] })
    .success(function () {
      res.send(204);
    })
    .error(function () {
      console.log('error creating ride');
      res.send(400, 'Bad Request');
    });
};

exports.updateRide = function (req, res) {
  Ride.find(req.params.id)
    .success(function (ride) {
      return ride.updateAttributes(req.body.ride, { fields: ['name', 'link'] });
    })
    .success(function () {
      res.send(204);
    })
    .error(function () {
      console.log('error updating ride');
      res.send(400, 'Bad Request');
    });
};

exports.deleteRide = function (req, res) {
  Ride.find(req.params.id)
    .success(function (ride) {
      return ride.destroy();
    })
    .success(function () {
      res.send(204);
    })
    .error(function () {
      console.log('error deleting ride');
      res.send(400, 'Bad Request');
    });
};

exports.route = function (req, res) {
  Point.findAll({ where: { RideId: req.params.id } })
    .success(function (points) {
      if (points.length > 0) {
        res.json(points);
      } else {
        res.send(404, 'Not Found');
      }
    })
    .error(function () {
      console.log('error finding route');
      res.send(400, 'Bad Request');
    });
};

exports.uploadRoute = function (req, res, next) {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err);
    }

    if (!files) {
      return res.send(400, 'Bad Request');
    }

    Ride.find(req.params.id)
      .success(function (ride) {
        routeParser.parse(ride, files.file.path)
          .then(function (points) {
            Point.bulkCreate(points)
              .success(function () {
                res.send(204);
              })
              .error(function () {
                console.log('error uploading route');
                res.send(400, 'Bad Request');
              });
          })
          .catch(function () {
            console.log('error uploading route');
            res.send(400, 'Bad Request');
          });
      })
      .error(function () {
        console.log('error uploading route');
        res.send(400, 'Bad Request');
      });
  });
};

exports.track = function (req, res) {
  Ride.find(req.params.id)
    .success(function (ride) {
      MessageLoader.load(ride)
        .then(function (messages) {
          res.json(messages);
        })
        .catch(function () {
          console.log('error finding track');
          res.send(400, 'Bad Request');
        });
    })
    .error(function () {
      console.log('error finding track');
      res.send(400, 'Bad Request');
    });
};
