'use strict';

//Temperatures service used to communicate Temperatures REST endpoints
angular.module('temperatures').factory('Temperatures', ['$resource',
	function($resource) {
		return $resource('temperatures/:temperatureId', { temperatureId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);