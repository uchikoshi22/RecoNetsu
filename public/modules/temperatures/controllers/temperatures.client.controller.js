'use strict';

// Temperatures controller
angular.module('temperatures').controller('TemperaturesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Temperatures',
	function($scope, $stateParams, $location, Authentication, Temperatures) {
		$scope.authentication = Authentication;

		// Create new Temperature
		$scope.create = function() {
			// Create new Temperature object
			var temperature = new Temperatures ({
				name: this.name
			});

			// Redirect after save
			temperature.$save(function(response) {
				$location.path('temperatures/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Temperature
		$scope.remove = function(temperature) {
			if ( temperature ) { 
				temperature.$remove();

				for (var i in $scope.temperatures) {
					if ($scope.temperatures [i] === temperature) {
						$scope.temperatures.splice(i, 1);
					}
				}
			} else {
				$scope.temperature.$remove(function() {
					$location.path('temperatures');
				});
			}
		};

		// Update existing Temperature
		$scope.update = function() {
			var temperature = $scope.temperature;

			temperature.$update(function() {
				$location.path('temperatures/' + temperature._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Temperatures
		$scope.find = function() {
			$scope.temperatures = Temperatures.query();
		};

		// Find existing Temperature
		$scope.findOne = function() {
			$scope.temperature = Temperatures.get({ 
				temperatureId: $stateParams.temperatureId
			});
		};
	}
]);