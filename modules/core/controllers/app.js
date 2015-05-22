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
		.when('/reports/', {
			templateUrl: 'modules/reports/views/report1.html',
			controller: 'ReportsCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
	})
	
	// controls the behaviour of our navigation bar
	app.controller('NavbarCtrl', function() {
		this.tab = 1;
		
		this.selectedTab = function(setTab) {
			this.tab = setTab;
		};
		
		this.isSelected = function(checkTab) {
			return this.tab === checkTab;
		};
	});
	
	// specify a controller for setting the budgetId:
	// we could have a login controller set the budgetId & userId 
	// in the rootScope. Something like the controller below
	app.controller('LoginCtrl', ['$rootScope', function($rootScope) {
		$rootScope.budgetId = 1;
	}]);
	
})();
