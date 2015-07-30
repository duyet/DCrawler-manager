'use strict';

(function() {
	// Surveys Controller Spec
	describe('Surveys Controller Tests', function() {
		// Initialize global variables
		var SurveysController,
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

			// Initialize the Surveys controller.
			SurveysController = $controller('SurveysController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Survey object fetched from XHR', inject(function(Surveys) {
			// Create sample Survey using the Surveys service
			var sampleSurvey = new Surveys({
				name: 'New Survey'
			});

			// Create a sample Surveys array that includes the new Survey
			var sampleSurveys = [sampleSurvey];

			// Set GET response
			$httpBackend.expectGET('surveys').respond(sampleSurveys);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.surveys).toEqualData(sampleSurveys);
		}));

		it('$scope.findOne() should create an array with one Survey object fetched from XHR using a surveyId URL parameter', inject(function(Surveys) {
			// Define a sample Survey object
			var sampleSurvey = new Surveys({
				name: 'New Survey'
			});

			// Set the URL parameter
			$stateParams.surveyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/surveys\/([0-9a-fA-F]{24})$/).respond(sampleSurvey);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.survey).toEqualData(sampleSurvey);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Surveys) {
			// Create a sample Survey object
			var sampleSurveyPostData = new Surveys({
				name: 'New Survey'
			});

			// Create a sample Survey response
			var sampleSurveyResponse = new Surveys({
				_id: '525cf20451979dea2c000001',
				name: 'New Survey'
			});

			// Fixture mock form input values
			scope.name = 'New Survey';

			// Set POST response
			$httpBackend.expectPOST('surveys', sampleSurveyPostData).respond(sampleSurveyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Survey was created
			expect($location.path()).toBe('/surveys/' + sampleSurveyResponse._id);
		}));

		it('$scope.update() should update a valid Survey', inject(function(Surveys) {
			// Define a sample Survey put data
			var sampleSurveyPutData = new Surveys({
				_id: '525cf20451979dea2c000001',
				name: 'New Survey'
			});

			// Mock Survey in scope
			scope.survey = sampleSurveyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/surveys\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/surveys/' + sampleSurveyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid surveyId and remove the Survey from the scope', inject(function(Surveys) {
			// Create new Survey object
			var sampleSurvey = new Surveys({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Surveys array and include the Survey
			scope.surveys = [sampleSurvey];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/surveys\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSurvey);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.surveys.length).toBe(0);
		}));
	});
}());