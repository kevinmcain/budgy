'use strict'; // <-- what does this mean?

/**
 * @ngdoc overview
 * @name budgy
 * @description
 * # envelope system
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
	  // maybe login page can be integrated into this html file.
      .when('/', {
        templateUrl: 'modules/core/views/login.html'
	  })
      .when('/lists/new', {
        templateUrl: 'modules/lists/views/newList.html',
        controller: 'ListsCtrl'
      })
      .when('/lists/:listId', {
        templateUrl: 'modules/items/views/itemsView.html',
        controller: 'ItemsCtrl'
      })
	  // clicking on home will cause main controller to use this route
	  // and will provide the EnvelopesCtrl
      .when('/envelopes/:budgetId', {
        templateUrl: 'modules/envelopes/views/budget.html',
        controller: 'EnvelopesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });