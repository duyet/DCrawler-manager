'use strict';

// Configuring the Articles module
angular.module('queue-links').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Queue links', 'queue-links', 'dropdown', '/queue-links(/create)?');
		Menus.addSubMenuItem('topbar', 'queue-links', 'List Queue links', 'queue-links');
		Menus.addSubMenuItem('topbar', 'queue-links', 'New Queue link', 'queue-links/create');
	}
]);