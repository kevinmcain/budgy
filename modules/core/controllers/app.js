'use strict';

/**
 * @ngdoc overview
 * @name budgy
 * @description
 * # envelope system
 *
 * Main module of the application.
 */
 
(function(){

	var app = angular.module('budgyApp', 
		['ngAnimate',
		'ngAria',
		'ngCookies',
		'ngMessages',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ui.bootstrap'])

	app.config(function ($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'modules/core/views/login.html',
			controller: 'LoginCtrl'
		})
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
	})
	
	app.controller('LoginCtrl', ['$rootScope', function($rootScope) {
		$rootScope.budgetId = "556ffe20761b9d2e6e6d701c";
	}]);
	
})();