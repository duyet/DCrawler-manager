'use strict';

//Queue links service used to communicate Queue links REST endpoints
angular.module('queue-links').factory('QueueLinks', ['$resource',
	function($resource) {
		return $resource('queue-links/:queueLinkId', { queueLinkId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);