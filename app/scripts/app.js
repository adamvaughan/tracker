(function () {
  'use strict';

  var app = angular.module('trackerApp', ['ngRoute']);

  app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/partials/main',
          controller: 'MainCtrl'
        })
        .when('/rides/new', {
          templateUrl: '/partials/ride_form',
          controller: 'RideFormCtrl'
        })
        .when('/rides/:id', {
          templateUrl: '/partials/ride',
          controller: 'RideCtrl'
        })
        .when('/rides/:id/edit', {
          templateUrl: '/partials/ride_form',
          controller: 'RideFormCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider.html5Mode(true);
    }]);
})();
