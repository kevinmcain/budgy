'use strict';

/**
 * @ngdoc overview
 * @name Budgy App
 * @description
 * # Envelope System
 *
 * Main module of the application.
 */
(function(){

	var app = angular.module('budgyApp');

	app.controller('EnvelopesCtrl', [
		'$scope', 
		'$rootScope',
		'$http', 
		function($scope,  $rootScope, $http) {
		
			$scope.getEnvelopes = function() {

				var url = '/envelopes/' + $rootScope.budgetId;
			
				$http.get(url).success(function(data, status, headers, config) {
					$scope.envelopes = data;
				});
			};
			
			// proof of concept
			$scope.udpateEnvelope = function() {
				
				var url = '/envelopes/' + $scope.envelopes[0]._id;

				$scope.envelopes[0].amount = 444;
				
				$http.put(url, $scope.envelopes[0]).
					success(function(response, status, headers, config){
    
    
    
				}).error(function(response, status, headers, config){
					$scope.error_message = response.error_message;
				});
			};
			
			// proof of concept
			$scope.createEnvelope = function() {
				
				var url = '/envelopes/';
				
				$http.post(url, $scope.envelopes[0]).
					success(function(response, status, headers, config){
    
    
    
				}).error(function(response, status, headers, config){
					$scope.error_message = response.error_message;
				});
			};
		}
	]);
  
	app.controller('ModalDemoCtrl', function ($scope, $modal, $log) {
	
		$scope.items = ['item1', 'item2', 'item3'];

		$scope.animationsEnabled = true;

		$scope.open = function (size) {

			var modalInstance = $modal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				size: size,
				
				resolve: {
					items: function () {
						return $scope.items;
					}
				}
			});
			

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		$scope.toggleAnimation = function () {
			$scope.animationsEnabled = !$scope.animationsEnabled;
		};
		
		};

	});
	
	// Please note that $modalInstance represents a modal window (instance) dependency.
	// It is not the same as the $modal service used above.

	app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

	  $scope.items = items;
	  $scope.selected = {
		item: $scope.items[0]
	  };

	  $scope.ok = function () {
		$modalInstance.close($scope.selected.item);
	  };

	  $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	  };
	});

})();