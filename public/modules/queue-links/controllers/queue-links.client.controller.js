'use strict';

// Queue links controller
angular.module('queue-links').controller('QueueLinksController', ['$scope', '$stateParams', '$location', 'Authentication', 'QueueLinks',
	function($scope, $stateParams, $location, Authentication, QueueLinks) {
		$scope.authentication = Authentication;

		// Create new Queue link
		$scope.create = function() {
			// Create new Queue link object
			var queueLink = new QueueLinks ({
				name: this.name
			});

			// Redirect after save
			queueLink.$save(function(response) {
				$location.path('queue-links/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Queue link
		$scope.remove = function(queueLink) {
			if ( queueLink ) { 
				queueLink.$remove();

				for (var i in $scope.queueLinks) {
					if ($scope.queueLinks [i] === queueLink) {
						$scope.queueLinks.splice(i, 1);
					}
				}
			} else {
				$scope.queueLink.$remove(function() {
					$location.path('queue-links');
				});
			}
		};

		// Update existing Queue link
		$scope.update = function() {
			var queueLink = $scope.queueLink;

			queueLink.$update(function() {
				$location.path('queue-links/' + queueLink._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Queue links
		$scope.find = function() {
			$scope.queueLinks = QueueLinks.query();
		};

		// Find existing Queue link
		$scope.findOne = function() {
			$scope.queueLink = QueueLinks.get({ 
				queueLinkId: $stateParams.queueLinkId
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