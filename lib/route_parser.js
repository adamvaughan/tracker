'use strict';

var fs = require('fs');
var Q = require('q');
var XmlStream = require('xml-stream');

exports.parse = function (ride, path) {
  var stream = fs.createReadStream(path);
  var xml = new XmlStream(stream);
  var deferred = Q.defer();
  var points = [];

  xml.on('updateElement: trkpt', function (trackpoint) {
    points.push({
      RideId: ride.id,
      latitude: parseFloat(trackpoint.$.lat),
      longitude: parseFloat(trackpoint.$.lon)
    });
  });

  xml.on('end', function () {
    deferred.resolve(points);
  });

  return deferred.promise;
};
