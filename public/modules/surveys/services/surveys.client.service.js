'use strict';

//Surveys service used to communicate Surveys REST endpoints
angular.module('surveys').factory('Surveys', ['$resource',
	function($resource) {
		return $resource('surveys/:surveyId', { surveyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);