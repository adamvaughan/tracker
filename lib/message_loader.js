'use strict';

var request = require('request');
var Q = require('q');

exports.load = function (ride) {
  var url = 'https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/' + ride.link + '/message.json';
  var deferred = Q.defer();

  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      deferred.resolve([]);
    } else {
      try {
        var data = JSON.parse(body);
        deferred.resolve(data.response.feedMessageResponse.messages.message);
      } catch (ex) {
        deferred.resolve([]);
      }
    }
  });

  return deferred.promise;
};
