'use strict';

(function() {
	// Temperatures Controller Spec
	describe('Temperatures Controller Tests', function() {
		// Initialize global variables
		var TemperaturesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Temperatures controller.
			TemperaturesController = $controller('TemperaturesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Temperature object fetched from XHR', inject(function(Temperatures) {
			// Create sample Temperature using the Temperatures service
			var sampleTemperature = new Temperatures({
				name: 'New Temperature'
			});

			// Create a sample Temperatures array that includes the new Temperature
			var sampleTemperatures = [sampleTemperature];

			// Set GET response
			$httpBackend.expectGET('temperatures').respond(sampleTemperatures);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.temperatures).toEqualData(sampleTemperatures);
		}));

		it('$scope.findOne() should create an array with one Temperature object fetched from XHR using a temperatureId URL parameter', inject(function(Temperatures) {
			// Define a sample Temperature object
			var sampleTemperature = new Temperatures({
				name: 'New Temperature'
			});

			// Set the URL parameter
			$stateParams.temperatureId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/temperatures\/([0-9a-fA-F]{24})$/).respond(sampleTemperature);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.temperature).toEqualData(sampleTemperature);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Temperatures) {
			// Create a sample Temperature object
			var sampleTemperaturePostData = new Temperatures({
				name: 'New Temperature'
			});

			// Create a sample Temperature response
			var sampleTemperatureResponse = new Temperatures({
				_id: '525cf20451979dea2c000001',
				name: 'New Temperature'
			});

			// Fixture mock form input values
			scope.name = 'New Temperature';

			// Set POST response
			$httpBackend.expectPOST('temperatures', sampleTemperaturePostData).respond(sampleTemperatureResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Temperature was created
			expect($location.path()).toBe('/temperatures/' + sampleTemperatureResponse._id);
		}));

		it('$scope.update() should update a valid Temperature', inject(function(Temperatures) {
			// Define a sample Temperature put data
			var sampleTemperaturePutData = new Temperatures({
				_id: '525cf20451979dea2c000001',
				name: 'New Temperature'
			});

			// Mock Temperature in scope
			scope.temperature = sampleTemperaturePutData;

			// Set PUT response
			$httpBackend.expectPUT(/temperatures\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/temperatures/' + sampleTemperaturePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid temperatureId and remove the Temperature from the scope', inject(function(Temperatures) {
			// Create new Temperature object
			var sampleTemperature = new Temperatures({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Temperatures array and include the Temperature
			scope.temperatures = [sampleTemperature];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/temperatures\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTemperature);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.temperatures.length).toBe(0);
		}));
	});
}());