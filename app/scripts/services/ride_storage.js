(function () {
  'use strict';

  var app = angular.module('trackerApp');

  app.factory('rideStorage', ['$http', '$q', '$log',
    function ($http, $q, $log) {
      var getAll = function () {
        var deferred = $q.defer();

        $http.get('/api/rides')
          .then(function (response) {
            deferred.resolve(response.data);
          })
          .catch(function (response) {
            $log.error('Failed to load rides');
            $log.error(response);
            deferred.reject(response);
          });

        return deferred.promise;
      };

      var getOne = function (id) {
        var deferred = $q.defer();

        $http.get('/api/rides/' + id)
          .then(function (response) {
            deferred.resolve(response.data);
          })
          .catch(function (response) {
            $log.error('Failed to load ride');
            $log.error(response);
            deferred.reject(response);
          });

        return deferred.promise;
      };

      var create = function (ride) {
        var deferred = $q.defer();

        $http.post('/api/rides', { ride: ride })
          .then(function () {
            deferred.resolve(ride);
          })
          .catch(function (response) {
            $log.error('Failed to create ride');
            $log.error(response);
            deferred.reject(response);
          });

        return deferred.promise;
      };

      var update = function (ride) {
        var deferred = $q.defer();

        $http.put('/api/rides/' + ride.id, { ride: ride })
          .then(function () {
            deferred.resolve(ride);
          })
          .catch(function (response) {
            $log.error('Failed to update ride');
            $log.error(response);
            deferred.reject(response);
          });

        return deferred.promise;
      };

      var destroy = function (ride) {
        var deferred = $q.defer();

        $http.delete('/api/rides/' + ride.id)
          .then(function () {
            deferred.resolve(ride);
          })
          .catch(function (response) {
            $log.error('Failed to delete ride');
            $log.error(response);
            deferred.reject(response);
          });

        return deferred.promise;
      };

      var getRoute = function (ride) {
        var deferred = $q.defer();

        $http.get('/api/rides/' + ride.id + '/route')
          .then(function (response) {
            deferred.resolve(response.data);
          })
          .catch(function (response) {
            $log.error('Failed to load route');
            $log.error(response);
            deferred.reject(response);
          });

        return deferred.promise;
      };

      var getTrack = function (ride) {
        var deferred = $q.defer();

        $http.get('/api/rides/' + ride.id + '/track')
          .then(function (response) {
            deferred.resolve(response.data);
          })
          .catch(function (response) {
            $log.error('Failed to load track');
            $log.error(response);
            deferred.reject(response);
          });

        return deferred.promise;
      };

      return {
        get: function (id) {
          if (angular.isDefined(id)) {
            return getOne(id);
          }

          return getAll();
        },

        create: create,

        update: update,

        destroy: destroy,

        getRoute: getRoute,

        getTrack: getTrack
      };
    }]);
})();
