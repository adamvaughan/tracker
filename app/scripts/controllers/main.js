(function () {
  'use strict';

  var app = angular.module('trackerApp');

  app.controller('MainCtrl', ['$scope', 'rideStorage',
    function ($scope, rideStorage) {
      rideStorage.get().then(function (rides) {
        $scope.rides = rides;
      });
    }]);
})();
