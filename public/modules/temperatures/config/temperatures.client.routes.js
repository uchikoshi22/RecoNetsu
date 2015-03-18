'use strict';

//Setting up route
angular.module('temperatures').config(['$stateProvider',
	function($stateProvider) {
		// Temperatures state routing
		$stateProvider.
		state('listTemperatures', {
			url: '/temperatures',
			templateUrl: 'modules/temperatures/views/list-temperatures.client.view.html'
		}).
		state('createTemperature', {
			url: '/temperatures/create',
			templateUrl: 'modules/temperatures/views/create-temperature.client.view.html'
		}).
		state('viewTemperature', {
			url: '/temperatures/:temperatureId',
			templateUrl: 'modules/temperatures/views/view-temperature.client.view.html'
		}).
		state('editTemperature', {
			url: '/temperatures/:temperatureId/edit',
			templateUrl: 'modules/temperatures/views/edit-temperature.client.view.html'
		});
	}
]);