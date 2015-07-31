'use strict';

(function() {
	// Queue roots Controller Spec
	describe('Queue roots Controller Tests', function() {
		// Initialize global variables
		var QueueRootsController,
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

			// Initialize the Queue roots controller.
			QueueRootsController = $controller('QueueRootsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Queue root object fetched from XHR', inject(function(QueueRoots) {
			// Create sample Queue root using the Queue roots service
			var sampleQueueRoot = new QueueRoots({
				name: 'New Queue root'
			});

			// Create a sample Queue roots array that includes the new Queue root
			var sampleQueueRoots = [sampleQueueRoot];

			// Set GET response
			$httpBackend.expectGET('queue-roots').respond(sampleQueueRoots);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.queueRoots).toEqualData(sampleQueueRoots);
		}));

		it('$scope.findOne() should create an array with one Queue root object fetched from XHR using a queueRootId URL parameter', inject(function(QueueRoots) {
			// Define a sample Queue root object
			var sampleQueueRoot = new QueueRoots({
				name: 'New Queue root'
			});

			// Set the URL parameter
			$stateParams.queueRootId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/queue-roots\/([0-9a-fA-F]{24})$/).respond(sampleQueueRoot);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.queueRoot).toEqualData(sampleQueueRoot);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(QueueRoots) {
			// Create a sample Queue root object
			var sampleQueueRootPostData = new QueueRoots({
				name: 'New Queue root'
			});

			// Create a sample Queue root response
			var sampleQueueRootResponse = new QueueRoots({
				_id: '525cf20451979dea2c000001',
				name: 'New Queue root'
			});

			// Fixture mock form input values
			scope.name = 'New Queue root';

			// Set POST response
			$httpBackend.expectPOST('queue-roots', sampleQueueRootPostData).respond(sampleQueueRootResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Queue root was created
			expect($location.path()).toBe('/queue-roots/' + sampleQueueRootResponse._id);
		}));

		it('$scope.update() should update a valid Queue root', inject(function(QueueRoots) {
			// Define a sample Queue root put data
			var sampleQueueRootPutData = new QueueRoots({
				_id: '525cf20451979dea2c000001',
				name: 'New Queue root'
			});

			// Mock Queue root in scope
			scope.queueRoot = sampleQueueRootPutData;

			// Set PUT response
			$httpBackend.expectPUT(/queue-roots\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/queue-roots/' + sampleQueueRootPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid queueRootId and remove the Queue root from the scope', inject(function(QueueRoots) {
			// Create new Queue root object
			var sampleQueueRoot = new QueueRoots({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Queue roots array and include the Queue root
			scope.queueRoots = [sampleQueueRoot];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/queue-roots\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleQueueRoot);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.queueRoots.length).toBe(0);
		}));
	});
}());