'use strict';

//Setting up route
angular.module('queue-roots').config(['$stateProvider',
	function($stateProvider) {
		// Queue roots state routing
		$stateProvider.
		state('listQueueRoots', {
			url: '/queue-roots',
			templateUrl: 'modules/queue-roots/views/list-queue-roots.client.view.html'
		}).
		state('createQueueRoot', {
			url: '/queue-roots/create',
			templateUrl: 'modules/queue-roots/views/create-queue-root.client.view.html'
		}).
		state('viewQueueRoot', {
			url: '/queue-roots/:queueRootId',
			templateUrl: 'modules/queue-roots/views/view-queue-root.client.view.html'
		}).
		state('editQueueRoot', {
			url: '/queue-roots/:queueRootId/edit',
			templateUrl: 'modules/queue-roots/views/edit-queue-root.client.view.html'
		});
	}
]);