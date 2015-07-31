'use strict';

//Queue roots service used to communicate Queue roots REST endpoints
angular.module('queue-roots').factory('QueueRoots', ['$resource',
	function($resource) {
		return $resource('queue-roots/:queueRootId', { queueRootId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);