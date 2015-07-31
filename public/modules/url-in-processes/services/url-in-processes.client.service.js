'use strict';

//Url in processes service used to communicate Url in processes REST endpoints
angular.module('url-in-processes').factory('UrlInProcesses', ['$resource',
	function($resource) {
		return $resource('url-in-processes/:urlInProcessId', { urlInProcessId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);