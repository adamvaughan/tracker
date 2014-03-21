(function () {
  'use strict';

  var app = angular.module('trackerApp');

  app.controller('RideCtrl', ['$scope', '$route', '$http', '$window', '$timeout', 'rideStorage',
    function ($scope, $route, $http, $window, $timeout, rideStorage) {
      $scope.routeLoaded = false;

      $timeout(function () {
        $window.location.reload(true);
      }, 600000);

      rideStorage.get($route.current.params.id)
        .then(function (ride) {
          $scope.ride = ride;
          loadTrack();
        });

      var loadTrack = function () {
        rideStorage.getTrack($scope.ride)
          .then(function (track) {
            $scope.track = track;
            loadRoute();
          });
      };

      var loadRoute = function () {
        rideStorage.getRoute($scope.ride)
          .then(function (route) {
            $scope.route = route;
          })
          .finally(function () {
            $scope.routeLoaded = true;
          });
      };

      $scope.uploadFile = function (file) {
        var formData = new FormData();
        var xhr = new XMLHttpRequest();

        var readyStateChanged = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 204) {
              loadRoute();
            } else {
              console.log('Upload failed: (' + xhr.status + ' ' + xhr.statusText + ') ' + xhr.responseText);
            }
          }
        };

        formData.append('file', file);

        xhr.addEventListener('readystatechange', readyStateChanged, false);

        xhr.open('POST', '/api/rides/' + $scope.ride.id + '/route');
        xhr.send(formData);
      };
    }]);
})();
