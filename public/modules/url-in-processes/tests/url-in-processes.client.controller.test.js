'use strict';

(function() {
	// Url in processes Controller Spec
	describe('Url in processes Controller Tests', function() {
		// Initialize global variables
		var UrlInProcessesController,
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

			// Initialize the Url in processes controller.
			UrlInProcessesController = $controller('UrlInProcessesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Url in process object fetched from XHR', inject(function(UrlInProcesses) {
			// Create sample Url in process using the Url in processes service
			var sampleUrlInProcess = new UrlInProcesses({
				name: 'New Url in process'
			});

			// Create a sample Url in processes array that includes the new Url in process
			var sampleUrlInProcesses = [sampleUrlInProcess];

			// Set GET response
			$httpBackend.expectGET('url-in-processes').respond(sampleUrlInProcesses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.urlInProcesses).toEqualData(sampleUrlInProcesses);
		}));

		it('$scope.findOne() should create an array with one Url in process object fetched from XHR using a urlInProcessId URL parameter', inject(function(UrlInProcesses) {
			// Define a sample Url in process object
			var sampleUrlInProcess = new UrlInProcesses({
				name: 'New Url in process'
			});

			// Set the URL parameter
			$stateParams.urlInProcessId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/url-in-processes\/([0-9a-fA-F]{24})$/).respond(sampleUrlInProcess);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.urlInProcess).toEqualData(sampleUrlInProcess);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(UrlInProcesses) {
			// Create a sample Url in process object
			var sampleUrlInProcessPostData = new UrlInProcesses({
				name: 'New Url in process'
			});

			// Create a sample Url in process response
			var sampleUrlInProcessResponse = new UrlInProcesses({
				_id: '525cf20451979dea2c000001',
				name: 'New Url in process'
			});

			// Fixture mock form input values
			scope.name = 'New Url in process';

			// Set POST response
			$httpBackend.expectPOST('url-in-processes', sampleUrlInProcessPostData).respond(sampleUrlInProcessResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Url in process was created
			expect($location.path()).toBe('/url-in-processes/' + sampleUrlInProcessResponse._id);
		}));

		it('$scope.update() should update a valid Url in process', inject(function(UrlInProcesses) {
			// Define a sample Url in process put data
			var sampleUrlInProcessPutData = new UrlInProcesses({
				_id: '525cf20451979dea2c000001',
				name: 'New Url in process'
			});

			// Mock Url in process in scope
			scope.urlInProcess = sampleUrlInProcessPutData;

			// Set PUT response
			$httpBackend.expectPUT(/url-in-processes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/url-in-processes/' + sampleUrlInProcessPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid urlInProcessId and remove the Url in process from the scope', inject(function(UrlInProcesses) {
			// Create new Url in process object
			var sampleUrlInProcess = new UrlInProcesses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Url in processes array and include the Url in process
			scope.urlInProcesses = [sampleUrlInProcess];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/url-in-processes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUrlInProcess);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.urlInProcesses.length).toBe(0);
		}));
	});
}());