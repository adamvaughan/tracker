/* jshint nonew:false */

(function () {
  'use strict';

  var app = angular.module('trackerApp');

  var mapBounds = function (points) {
    var maximumLatitude = Number.NaN;
    var minimumLatitude = Number.NaN;
    var maximumLongitude = Number.NaN;
    var minimumLongitude = Number.NaN;

    _.each(points, function (point) {
      var latitude = parseFloat(point.latitude);
      var longitude = parseFloat(point.longitude);

      if (_.isNaN(maximumLatitude) || maximumLatitude < latitude) {
        maximumLatitude = latitude;
      }

      if (_.isNaN(minimumLatitude) || minimumLatitude > latitude) {
        minimumLatitude = latitude;
      }

      if (_.isNaN(maximumLongitude) || maximumLongitude < longitude) {
        maximumLongitude = longitude;
      }

      if (_.isNaN(minimumLongitude) || minimumLongitude > longitude) {
        minimumLongitude = longitude;
      }
    });

    var centerLatitude = (maximumLatitude + minimumLatitude) / 2;
    var centerLongitude = (maximumLongitude + minimumLongitude) / 2;

    var upperBound = new google.maps.LatLng(minimumLatitude, minimumLongitude);
    var lowerBound = new google.maps.LatLng(maximumLatitude, maximumLongitude);
    var bounds = new google.maps.LatLngBounds(upperBound, lowerBound);

    return {
      centerLatitude: centerLatitude,
      centerLongitude: centerLongitude,
      bounds: bounds
    };
  };

  var mapOptions = function (bounds) {
    return {
      zoom: 4,
      center: new google.maps.LatLng(bounds.centerLatitude, bounds.centerLongitude),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      keyboardShortcuts: false
    };
  };

  var toMapPoints = function (points) {
    return _.map(points, function (point) {
      return new google.maps.LatLng(parseFloat(point.latitude), parseFloat(point.longitude));
    });
  };

  var drawMarker = function (map, point, icon) {
    return new google.maps.Marker({
      flat: true,
      map: map,
      icon: icon,
      position: point
    });
  };

  var drawRoute = function (map, points) {
    points = toMapPoints(points);

    new google.maps.Polyline({
      clickable: false,
      map: map,
      path: points,
      strokeColor: '#ff0000'
    });

    drawMarker(map, _.first(points), 'http://www.google.com/mapfiles/dd-start.png');
    drawMarker(map, _.last(points), 'http://www.google.com/mapfiles/dd-end.png');
  };

  var drawTrack = function (map, points) {
    if (_.isEmpty(points)) {
      return;
    }

    var mapPoints = toMapPoints(points);
    var infoWindow = new google.maps.InfoWindow();
    var regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

    new google.maps.Polyline({
      clickable: false,
      map: map,
      path: mapPoints,
      strokeColor: '#0000ff'
    });

    _.each(mapPoints, function (point, index) {
      var marker = drawMarker(map, point, 'http://labs.google.com/ridefinder/images/mm_20_blue.png');
      point = points[index];

      google.maps.event.addListener(marker, 'click', function () {
        var matches = point.dateTime.match(regex);
        var date = new Date(parseFloat(matches[1]), parseFloat(matches[2]) - 1, parseFloat(matches[3]), parseFloat(matches[4]), parseFloat(matches[5]), parseFloat(matches[6]));
        var offset = date.getTimezoneOffset() * -1;
        date.addMinutes(offset);

        var content = '<table class="marker-data"><tbody><tr><td><b>Time:</b></td><td>' + date.toString('M/d/yyyy h:mm:ss tt') + '</td></tr><tr><td><b>Latitude:</b></td><td>' + point.latitude + '</td></tr><tr><td><b>Longitude:</b></td><td>' + point.longitude + '</td></tr></tbody></table>';
        infoWindow.close();
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });
    });

    google.maps.event.addListener(map, 'click', function () {
      infoWindow.close();
    });
  };

  app.directive('map', function () {
    return {
      scope: {
        routePoints: '=',
        trackPoints: '='
      },
      link: function (scope, element) {
        var bounds = mapBounds(scope.routePoints);
        var options = mapOptions(bounds);
        var map = new google.maps.Map(element[0], options);
        map.fitBounds(bounds.bounds);

        element.addClass('map');

        scope.$watch('routePoints', function () {
          drawRoute(map, scope.routePoints);
        });

        scope.$watch('trackPoints', function () {
          drawTrack(map, scope.trackPoints);
        });
      }
    };
  });
})();
