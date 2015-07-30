'use strict';

//Setting up route
angular.module('queue-links').config(['$stateProvider',
	function($stateProvider) {
		// Queue links state routing
		$stateProvider.
		state('listQueueLinks', {
			url: '/queue-links',
			templateUrl: 'modules/queue-links/views/list-queue-links.client.view.html'
		}).
		state('createQueueLink', {
			url: '/queue-links/create',
			templateUrl: 'modules/queue-links/views/create-queue-link.client.view.html'
		}).
		state('viewQueueLink', {
			url: '/queue-links/:queueLinkId',
			templateUrl: 'modules/queue-links/views/view-queue-link.client.view.html'
		}).
		state('editQueueLink', {
			url: '/queue-links/:queueLinkId/edit',
			templateUrl: 'modules/queue-links/views/edit-queue-link.client.view.html'
		});
	}
]);