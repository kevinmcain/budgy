'use strict'; // <-- what does this mean?

/**
 * @ngdoc overview
 * @name budgy
 * @description
 * # envelope system
 *
 * Main module of the application.
 */
 
// wrapping your javascript in closure is a good habit
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
		// maybe login page can be integrated into this html file.
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
	})

	
})();
