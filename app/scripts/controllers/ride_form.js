(function () {
  'use strict';

  var app = angular.module('trackerApp');

  app.controller('RideFormCtrl', ['$scope', '$route', '$location', 'rideStorage',
    function ($scope, $route, $location, rideStorage) {
      if ($route.current.params.id) {
        rideStorage.get($route.current.params.id)
          .then(function (ride) {
            $scope.ride = ride;
          });
      } else {
        $scope.ride = {};
      }

      $scope.save = function () {
        if ($scope.ride.id) {
          rideStorage.update($scope.ride)
            .then(function () {
              $location.path('/rides/' + $scope.ride.id);
            });
        } else {
          rideStorage.create($scope.ride)
            .then(function () {
              $location.path('/');
            });
        }
      };

      $scope.destroy = function () {
        rideStorage.destroy($scope.ride)
          .then(function () {
            $location.path('/');
          });
      };
    }]);
})();
