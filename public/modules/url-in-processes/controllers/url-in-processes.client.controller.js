'use strict';

// Url in processes controller
angular.module('url-in-processes').controller('UrlInProcessesController', ['$scope', '$stateParams', '$location', 'Authentication', 'UrlInProcesses',
	function($scope, $stateParams, $location, Authentication, UrlInProcesses) {
		$scope.authentication = Authentication;

		// Create new Url in process
		$scope.create = function() {
			// Create new Url in process object
			var urlInProcess = new UrlInProcesses ({
				url: this.url
			});

			// Redirect after save
			urlInProcess.$save(function(response) {
				$location.path('url-in-processes');

				// Clear form fields
				$scope.url = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Url in process
		$scope.remove = function(urlInProcess) {
			if ( urlInProcess ) { 
				urlInProcess.$remove();

				for (var i in $scope.urlInProcesses) {
					if ($scope.urlInProcesses [i] === urlInProcess) {
						$scope.urlInProcesses.splice(i, 1);
					}
				}
			} else {
				$scope.urlInProcess.$remove(function() {
					$location.path('url-in-processes');
				});
			}
		};

		// Update existing Url in process
		$scope.update = function() {
			var urlInProcess = $scope.urlInProcess;

			urlInProcess.$update(function() {
				$location.path('url-in-processes/' + urlInProcess._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Url in processes
		$scope.find = function() {
			$scope.urlInProcesses = UrlInProcesses.query();
		};

		// Find existing Url in process
		$scope.findOne = function() {
			$scope.urlInProcess = UrlInProcesses.get({ 
				urlInProcessId: $stateParams.urlInProcessId
			});
		};
	}
]);