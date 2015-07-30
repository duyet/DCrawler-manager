'use strict';

(function() {
	// Queue links Controller Spec
	describe('Queue links Controller Tests', function() {
		// Initialize global variables
		var QueueLinksController,
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

			// Initialize the Queue links controller.
			QueueLinksController = $controller('QueueLinksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Queue link object fetched from XHR', inject(function(QueueLinks) {
			// Create sample Queue link using the Queue links service
			var sampleQueueLink = new QueueLinks({
				name: 'New Queue link'
			});

			// Create a sample Queue links array that includes the new Queue link
			var sampleQueueLinks = [sampleQueueLink];

			// Set GET response
			$httpBackend.expectGET('queue-links').respond(sampleQueueLinks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.queueLinks).toEqualData(sampleQueueLinks);
		}));

		it('$scope.findOne() should create an array with one Queue link object fetched from XHR using a queueLinkId URL parameter', inject(function(QueueLinks) {
			// Define a sample Queue link object
			var sampleQueueLink = new QueueLinks({
				name: 'New Queue link'
			});

			// Set the URL parameter
			$stateParams.queueLinkId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/queue-links\/([0-9a-fA-F]{24})$/).respond(sampleQueueLink);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.queueLink).toEqualData(sampleQueueLink);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(QueueLinks) {
			// Create a sample Queue link object
			var sampleQueueLinkPostData = new QueueLinks({
				name: 'New Queue link'
			});

			// Create a sample Queue link response
			var sampleQueueLinkResponse = new QueueLinks({
				_id: '525cf20451979dea2c000001',
				name: 'New Queue link'
			});

			// Fixture mock form input values
			scope.name = 'New Queue link';

			// Set POST response
			$httpBackend.expectPOST('queue-links', sampleQueueLinkPostData).respond(sampleQueueLinkResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Queue link was created
			expect($location.path()).toBe('/queue-links/' + sampleQueueLinkResponse._id);
		}));

		it('$scope.update() should update a valid Queue link', inject(function(QueueLinks) {
			// Define a sample Queue link put data
			var sampleQueueLinkPutData = new QueueLinks({
				_id: '525cf20451979dea2c000001',
				name: 'New Queue link'
			});

			// Mock Queue link in scope
			scope.queueLink = sampleQueueLinkPutData;

			// Set PUT response
			$httpBackend.expectPUT(/queue-links\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/queue-links/' + sampleQueueLinkPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid queueLinkId and remove the Queue link from the scope', inject(function(QueueLinks) {
			// Create new Queue link object
			var sampleQueueLink = new QueueLinks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Queue links array and include the Queue link
			scope.queueLinks = [sampleQueueLink];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/queue-links\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleQueueLink);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.queueLinks.length).toBe(0);
		}));
	});
}());