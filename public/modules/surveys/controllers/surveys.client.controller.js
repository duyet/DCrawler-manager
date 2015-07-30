'use strict';

// Surveys controller
angular.module('surveys').controller('SurveysController', ['$scope', '$stateParams', '$location', 'Authentication', 'Surveys',
	function($scope, $stateParams, $location, Authentication, Surveys) {
		$scope.authentication = Authentication;

		$scope.publish_modes = [
			{key: 'public', name: 'Public'},
			{key: 'only_have_link', name: 'Only have URL'},
			{key: 'private', name: 'Private'},
		];

		// Create new Survey
		$scope.create = function() {
			// Create new Survey object
			var survey = new Surveys ({
				name: this.name,
				description: this.description,
				publish_mode: this.publishmode
			});

			// Redirect after save
			survey.$save(function(response) {
				$location.path('surveys/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Survey
		$scope.remove = function(survey) {
			if ( survey ) { 
				survey.$remove();

				for (var i in $scope.surveys) {
					if ($scope.surveys [i] === survey) {
						$scope.surveys.splice(i, 1);
					}
				}
			} else {
				$scope.survey.$remove(function() {
					$location.path('surveys');
				});
			}
		};

		// Update existing Survey
		$scope.update = function() {
			var survey = $scope.survey;

			survey.$update(function() {
				$location.path('surveys/' + survey._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Surveys
		$scope.find = function() {
			$scope.surveys = Surveys.query();
		};

		// Find existing Survey
		$scope.findOne = function() {
			$scope.survey = Surveys.get({ 
				surveyId: $stateParams.surveyId
			});
		};
	}
]);