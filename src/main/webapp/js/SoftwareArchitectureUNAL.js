"use strict";
var app = angular.module('SoftwareArchitectureUNAL', ['ngRoute']);



app.controller('HomeController', ['$scope', '$http',  function ($scope, $http) {
}]);

app.controller('LoginController', ['$scope', '$http',  function ($scope, $http) {
}]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeController'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        })

        .otherwise({redirectTo: '/'});

    //html5mode causes several issues when the front end is embedded with the web service.
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
}]);