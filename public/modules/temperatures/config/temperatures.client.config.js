'use strict';

// Configuring the Articles module
angular.module('temperatures').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Temperatures', 'temperatures', 'dropdown', '/temperatures(/create)?');
		Menus.addSubMenuItem('topbar', 'temperatures', 'List Temperatures', 'temperatures');
		Menus.addSubMenuItem('topbar', 'temperatures', 'New Temperature', 'temperatures/create');
	}
]);