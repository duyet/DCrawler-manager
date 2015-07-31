'use strict';

// Configuring the Articles module
angular.module('queue-roots').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Queue roots', 'queue-roots', 'dropdown', '/queue-roots(/create)?');
		Menus.addSubMenuItem('topbar', 'queue-roots', 'List Queue roots', 'queue-roots');
		Menus.addSubMenuItem('topbar', 'queue-roots', 'New Queue root', 'queue-roots/create');
	}
]);