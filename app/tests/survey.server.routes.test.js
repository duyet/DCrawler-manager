'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Survey = mongoose.model('Survey'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, survey;

/**
 * Survey routes tests
 */
describe('Survey CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Survey
		user.save(function() {
			survey = {
				name: 'Survey Name'
			};

			done();
		});
	});

	it('should be able to save Survey instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Survey
				agent.post('/surveys')
					.send(survey)
					.expect(200)
					.end(function(surveySaveErr, surveySaveRes) {
						// Handle Survey save error
						if (surveySaveErr) done(surveySaveErr);

						// Get a list of Surveys
						agent.get('/surveys')
							.end(function(surveysGetErr, surveysGetRes) {
								// Handle Survey save error
								if (surveysGetErr) done(surveysGetErr);

								// Get Surveys list
								var surveys = surveysGetRes.body;

								// Set assertions
								(surveys[0].user._id).should.equal(userId);
								(surveys[0].name).should.match('Survey Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Survey instance if not logged in', function(done) {
		agent.post('/surveys')
			.send(survey)
			.expect(401)
			.end(function(surveySaveErr, surveySaveRes) {
				// Call the assertion callback
				done(surveySaveErr);
			});
	});

	it('should not be able to save Survey instance if no name is provided', function(done) {
		// Invalidate name field
		survey.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Survey
				agent.post('/surveys')
					.send(survey)
					.expect(400)
					.end(function(surveySaveErr, surveySaveRes) {
						// Set message assertion
						(surveySaveRes.body.message).should.match('Please fill Survey name');
						
						// Handle Survey save error
						done(surveySaveErr);
					});
			});
	});

	it('should be able to update Survey instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Survey
				agent.post('/surveys')
					.send(survey)
					.expect(200)
					.end(function(surveySaveErr, surveySaveRes) {
						// Handle Survey save error
						if (surveySaveErr) done(surveySaveErr);

						// Update Survey name
						survey.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Survey
						agent.put('/surveys/' + surveySaveRes.body._id)
							.send(survey)
							.expect(200)
							.end(function(surveyUpdateErr, surveyUpdateRes) {
								// Handle Survey update error
								if (surveyUpdateErr) done(surveyUpdateErr);

								// Set assertions
								(surveyUpdateRes.body._id).should.equal(surveySaveRes.body._id);
								(surveyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Surveys if not signed in', function(done) {
		// Create new Survey model instance
		var surveyObj = new Survey(survey);

		// Save the Survey
		surveyObj.save(function() {
			// Request Surveys
			request(app).get('/surveys')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Survey if not signed in', function(done) {
		// Create new Survey model instance
		var surveyObj = new Survey(survey);

		// Save the Survey
		surveyObj.save(function() {
			request(app).get('/surveys/' + surveyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', survey.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Survey instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Survey
				agent.post('/surveys')
					.send(survey)
					.expect(200)
					.end(function(surveySaveErr, surveySaveRes) {
						// Handle Survey save error
						if (surveySaveErr) done(surveySaveErr);

						// Delete existing Survey
						agent.delete('/surveys/' + surveySaveRes.body._id)
							.send(survey)
							.expect(200)
							.end(function(surveyDeleteErr, surveyDeleteRes) {
								// Handle Survey error error
								if (surveyDeleteErr) done(surveyDeleteErr);

								// Set assertions
								(surveyDeleteRes.body._id).should.equal(surveySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Survey instance if not signed in', function(done) {
		// Set Survey user 
		survey.user = user;

		// Create new Survey model instance
		var surveyObj = new Survey(survey);

		// Save the Survey
		surveyObj.save(function() {
			// Try deleting Survey
			request(app).delete('/surveys/' + surveyObj._id)
			.expect(401)
			.end(function(surveyDeleteErr, surveyDeleteRes) {
				// Set message assertion
				(surveyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Survey error error
				done(surveyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Survey.remove().exec();
		done();
	});
});