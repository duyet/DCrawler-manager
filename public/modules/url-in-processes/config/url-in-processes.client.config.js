'use strict';

// Configuring the new module
angular.module('url-in-processes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Url in processes', 'url-in-processes', 'dropdown', '/url-in-processes(/create)?');
		Menus.addSubMenuItem('topbar', 'url-in-processes', 'List Url in processes', 'url-in-processes');
		Menus.addSubMenuItem('topbar', 'url-in-processes', 'New Url in process', 'url-in-processes/create');
	}
]);
