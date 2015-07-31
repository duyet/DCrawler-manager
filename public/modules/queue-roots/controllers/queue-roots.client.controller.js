'use strict';

// Queue roots controller
angular.module('queue-roots').controller('QueueRootsController', ['$scope', '$stateParams', '$location', 'Authentication', 'QueueRoots',
	function($scope, $stateParams, $location, Authentication, QueueRoots) {
		$scope.authentication = Authentication;

		// Create new Queue root
		$scope.create = function() {
			// Create new Queue root object
			var queueRoot = new QueueRoots ({
				url: this.url
			});

			// Redirect after save
			queueRoot.$save(function(response) {
				$location.path('queue-roots');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Queue root
		$scope.remove = function(queueRoot) {
			if ( queueRoot ) { 
				queueRoot.$remove();

				for (var i in $scope.queueRoots) {
					if ($scope.queueRoots [i] === queueRoot) {
						$scope.queueRoots.splice(i, 1);
					}
				}
			} else {
				$scope.queueRoot.$remove(function() {
					$location.path('queue-roots');
				});
			}
		};

		// Update existing Queue root
		$scope.update = function() {
			var queueRoot = $scope.queueRoot;

			queueRoot.$update(function() {
				$location.path('queue-roots/' + queueRoot._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Queue roots
		$scope.find = function() {
			$scope.queueRoots = QueueRoots.query();
		};

		// Find existing Queue root
		$scope.findOne = function() {
			$scope.queueRoot = QueueRoots.get({ 
				queueRootId: $stateParams.queueRootId
			});
		};
		
		// ========================
		$scope.rowSelected = false;
		$scope.selectRow = function(item) { $scope.rowSelected = item; }

		$scope.getQueueLinkStatus = function() {
			return false;
		}
	}
]);