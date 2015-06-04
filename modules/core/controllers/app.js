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
        		templateUrl: 'modules/core/views/login.html',
			controller: 'LoginCtrl'
	  	})      
      		// clicking on home will cause main controller to use this route
		// and will provide the EnvelopesCtrl
		.when('/envelopes', {
			templateUrl: 'modules/envelopes/views/budget.html',
			controller: 'EnvelopesCtrl'
		})
		.when('/manageEnvelopes',{
				templateUrl: 'modules/envelopes/views/manageEnvelopes.html',
				controller: 'EnvelopesCtrl'
		})
		.when('/manageTransactions/:envelopeID',{
				templateUrl: 'modules/transactions/views/manageTransactions.html',
				controller: 'TransactionsCtrl'
		})
		.when('/reports/', {
			templateUrl: 'modules/reports/views/report1.html',
			controller: 'ReportsCtrl'
		})
		.otherwise({
        	redirectTo: '/'
      });
  });
//  .controller('LoginCtrl', ['$rootScope', function($rootScope) {
//		$rootScope.budgetId = 1;
//	}]);
