'use strict';

/**
 * @ngdoc overview
 * @name Budgy App
 * @description
 * # Budgyy Application
 *
 * Main module of the application.
 */
angular
  .module('budgyApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'modules/core/views/login.html'
	  })      
      .otherwise({
        redirectTo: '/'
      });
  });
