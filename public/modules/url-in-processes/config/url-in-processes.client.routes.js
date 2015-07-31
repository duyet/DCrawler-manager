'use strict';

//Setting up route
angular.module('url-in-processes').config(['$stateProvider',
	function($stateProvider) {
		// Url in processes state routing
		$stateProvider.
		state('listUrlInProcesses', {
			url: '/url-in-processes',
			templateUrl: 'modules/url-in-processes/views/list-url-in-processes.client.view.html'
		}).
		state('createUrlInProcess', {
			url: '/url-in-processes/create',
			templateUrl: 'modules/url-in-processes/views/create-url-in-process.client.view.html'
		}).
		state('viewUrlInProcess', {
			url: '/url-in-processes/:urlInProcessId',
			templateUrl: 'modules/url-in-processes/views/view-url-in-process.client.view.html'
		}).
		state('editUrlInProcess', {
			url: '/url-in-processes/:urlInProcessId/edit',
			templateUrl: 'modules/url-in-processes/views/edit-url-in-process.client.view.html'
		});
	}
]);