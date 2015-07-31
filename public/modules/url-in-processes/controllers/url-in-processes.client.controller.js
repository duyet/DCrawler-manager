'use strict';

// Url in processes controller
angular.module('url-in-processes').controller('UrlInProcessesController', ['$scope', '$stateParams', '$location', 'Authentication', 'UrlInProcesses', 'TableSettings', 'UrlInProcessesForm',
	function($scope, $stateParams, $location, Authentication, UrlInProcesses, TableSettings, UrlInProcessesForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(UrlInProcesses);
		$scope.urlInProcess = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = UrlInProcessesForm.getFormFields(disabled);
		};


		// Create new Url in process
		$scope.create = function() {
			var urlInProcess = new UrlInProcesses($scope.urlInProcess);

			// Redirect after save
			urlInProcess.$save(function(response) {
				$location.path('url-in-processes/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Url in process
		$scope.remove = function(urlInProcess) {

			if ( urlInProcess ) {
				urlInProcess = UrlInProcesses.get({urlInProcessId:urlInProcess._id}, function() {
					urlInProcess.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.urlInProcess.$remove(function() {
					$location.path('urlInProcesses');
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



		$scope.toViewUrlInProcess = function() {
			$scope.urlInProcess = UrlInProcesses.get( {urlInProcessId: $stateParams.urlInProcessId} );
			$scope.setFormFields(true);
		};

		$scope.toEditUrlInProcess = function() {
			$scope.urlInProcess = UrlInProcesses.get( {urlInProcessId: $stateParams.urlInProcessId} );
			$scope.setFormFields(false);
		};

	}

]);
