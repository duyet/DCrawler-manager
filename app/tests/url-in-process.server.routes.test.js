'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UrlInProcess = mongoose.model('UrlInProcess'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, urlInProcess;

/**
 * Url in process routes tests
 */
describe('Url in process CRUD tests', function() {
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

		// Save a user to the test db and create new Url in process
		user.save(function() {
			urlInProcess = {
				name: 'Url in process Name'
			};

			done();
		});
	});

	it('should be able to save Url in process instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Url in process
				agent.post('/url-in-processes')
					.send(urlInProcess)
					.expect(200)
					.end(function(urlInProcessSaveErr, urlInProcessSaveRes) {
						// Handle Url in process save error
						if (urlInProcessSaveErr) done(urlInProcessSaveErr);

						// Get a list of Url in processes
						agent.get('/url-in-processes')
							.end(function(urlInProcessesGetErr, urlInProcessesGetRes) {
								// Handle Url in process save error
								if (urlInProcessesGetErr) done(urlInProcessesGetErr);

								// Get Url in processes list
								var urlInProcesses = urlInProcessesGetRes.body;

								// Set assertions
								(urlInProcesses[0].user._id).should.equal(userId);
								(urlInProcesses[0].name).should.match('Url in process Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Url in process instance if not logged in', function(done) {
		agent.post('/url-in-processes')
			.send(urlInProcess)
			.expect(401)
			.end(function(urlInProcessSaveErr, urlInProcessSaveRes) {
				// Call the assertion callback
				done(urlInProcessSaveErr);
			});
	});

	it('should not be able to save Url in process instance if no name is provided', function(done) {
		// Invalidate name field
		urlInProcess.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Url in process
				agent.post('/url-in-processes')
					.send(urlInProcess)
					.expect(400)
					.end(function(urlInProcessSaveErr, urlInProcessSaveRes) {
						// Set message assertion
						(urlInProcessSaveRes.body.message).should.match('Please fill Url in process name');
						
						// Handle Url in process save error
						done(urlInProcessSaveErr);
					});
			});
	});

	it('should be able to update Url in process instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Url in process
				agent.post('/url-in-processes')
					.send(urlInProcess)
					.expect(200)
					.end(function(urlInProcessSaveErr, urlInProcessSaveRes) {
						// Handle Url in process save error
						if (urlInProcessSaveErr) done(urlInProcessSaveErr);

						// Update Url in process name
						urlInProcess.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Url in process
						agent.put('/url-in-processes/' + urlInProcessSaveRes.body._id)
							.send(urlInProcess)
							.expect(200)
							.end(function(urlInProcessUpdateErr, urlInProcessUpdateRes) {
								// Handle Url in process update error
								if (urlInProcessUpdateErr) done(urlInProcessUpdateErr);

								// Set assertions
								(urlInProcessUpdateRes.body._id).should.equal(urlInProcessSaveRes.body._id);
								(urlInProcessUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Url in processes if not signed in', function(done) {
		// Create new Url in process model instance
		var urlInProcessObj = new UrlInProcess(urlInProcess);

		// Save the Url in process
		urlInProcessObj.save(function() {
			// Request Url in processes
			request(app).get('/url-in-processes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Url in process if not signed in', function(done) {
		// Create new Url in process model instance
		var urlInProcessObj = new UrlInProcess(urlInProcess);

		// Save the Url in process
		urlInProcessObj.save(function() {
			request(app).get('/url-in-processes/' + urlInProcessObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', urlInProcess.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Url in process instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Url in process
				agent.post('/url-in-processes')
					.send(urlInProcess)
					.expect(200)
					.end(function(urlInProcessSaveErr, urlInProcessSaveRes) {
						// Handle Url in process save error
						if (urlInProcessSaveErr) done(urlInProcessSaveErr);

						// Delete existing Url in process
						agent.delete('/url-in-processes/' + urlInProcessSaveRes.body._id)
							.send(urlInProcess)
							.expect(200)
							.end(function(urlInProcessDeleteErr, urlInProcessDeleteRes) {
								// Handle Url in process error error
								if (urlInProcessDeleteErr) done(urlInProcessDeleteErr);

								// Set assertions
								(urlInProcessDeleteRes.body._id).should.equal(urlInProcessSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Url in process instance if not signed in', function(done) {
		// Set Url in process user 
		urlInProcess.user = user;

		// Create new Url in process model instance
		var urlInProcessObj = new UrlInProcess(urlInProcess);

		// Save the Url in process
		urlInProcessObj.save(function() {
			// Try deleting Url in process
			request(app).delete('/url-in-processes/' + urlInProcessObj._id)
			.expect(401)
			.end(function(urlInProcessDeleteErr, urlInProcessDeleteRes) {
				// Set message assertion
				(urlInProcessDeleteRes.body.message).should.match('User is not logged in');

				// Handle Url in process error error
				done(urlInProcessDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		UrlInProcess.remove().exec();
		done();
	});
});