'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	QueueRoot = mongoose.model('QueueRoot'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, queueRoot;

/**
 * Queue root routes tests
 */
describe('Queue root CRUD tests', function() {
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

		// Save a user to the test db and create new Queue root
		user.save(function() {
			queueRoot = {
				name: 'Queue root Name'
			};

			done();
		});
	});

	it('should be able to save Queue root instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Queue root
				agent.post('/queue-roots')
					.send(queueRoot)
					.expect(200)
					.end(function(queueRootSaveErr, queueRootSaveRes) {
						// Handle Queue root save error
						if (queueRootSaveErr) done(queueRootSaveErr);

						// Get a list of Queue roots
						agent.get('/queue-roots')
							.end(function(queueRootsGetErr, queueRootsGetRes) {
								// Handle Queue root save error
								if (queueRootsGetErr) done(queueRootsGetErr);

								// Get Queue roots list
								var queueRoots = queueRootsGetRes.body;

								// Set assertions
								(queueRoots[0].user._id).should.equal(userId);
								(queueRoots[0].name).should.match('Queue root Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Queue root instance if not logged in', function(done) {
		agent.post('/queue-roots')
			.send(queueRoot)
			.expect(401)
			.end(function(queueRootSaveErr, queueRootSaveRes) {
				// Call the assertion callback
				done(queueRootSaveErr);
			});
	});

	it('should not be able to save Queue root instance if no name is provided', function(done) {
		// Invalidate name field
		queueRoot.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Queue root
				agent.post('/queue-roots')
					.send(queueRoot)
					.expect(400)
					.end(function(queueRootSaveErr, queueRootSaveRes) {
						// Set message assertion
						(queueRootSaveRes.body.message).should.match('Please fill Queue root name');
						
						// Handle Queue root save error
						done(queueRootSaveErr);
					});
			});
	});

	it('should be able to update Queue root instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Queue root
				agent.post('/queue-roots')
					.send(queueRoot)
					.expect(200)
					.end(function(queueRootSaveErr, queueRootSaveRes) {
						// Handle Queue root save error
						if (queueRootSaveErr) done(queueRootSaveErr);

						// Update Queue root name
						queueRoot.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Queue root
						agent.put('/queue-roots/' + queueRootSaveRes.body._id)
							.send(queueRoot)
							.expect(200)
							.end(function(queueRootUpdateErr, queueRootUpdateRes) {
								// Handle Queue root update error
								if (queueRootUpdateErr) done(queueRootUpdateErr);

								// Set assertions
								(queueRootUpdateRes.body._id).should.equal(queueRootSaveRes.body._id);
								(queueRootUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Queue roots if not signed in', function(done) {
		// Create new Queue root model instance
		var queueRootObj = new QueueRoot(queueRoot);

		// Save the Queue root
		queueRootObj.save(function() {
			// Request Queue roots
			request(app).get('/queue-roots')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Queue root if not signed in', function(done) {
		// Create new Queue root model instance
		var queueRootObj = new QueueRoot(queueRoot);

		// Save the Queue root
		queueRootObj.save(function() {
			request(app).get('/queue-roots/' + queueRootObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', queueRoot.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Queue root instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Queue root
				agent.post('/queue-roots')
					.send(queueRoot)
					.expect(200)
					.end(function(queueRootSaveErr, queueRootSaveRes) {
						// Handle Queue root save error
						if (queueRootSaveErr) done(queueRootSaveErr);

						// Delete existing Queue root
						agent.delete('/queue-roots/' + queueRootSaveRes.body._id)
							.send(queueRoot)
							.expect(200)
							.end(function(queueRootDeleteErr, queueRootDeleteRes) {
								// Handle Queue root error error
								if (queueRootDeleteErr) done(queueRootDeleteErr);

								// Set assertions
								(queueRootDeleteRes.body._id).should.equal(queueRootSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Queue root instance if not signed in', function(done) {
		// Set Queue root user 
		queueRoot.user = user;

		// Create new Queue root model instance
		var queueRootObj = new QueueRoot(queueRoot);

		// Save the Queue root
		queueRootObj.save(function() {
			// Try deleting Queue root
			request(app).delete('/queue-roots/' + queueRootObj._id)
			.expect(401)
			.end(function(queueRootDeleteErr, queueRootDeleteRes) {
				// Set message assertion
				(queueRootDeleteRes.body.message).should.match('User is not logged in');

				// Handle Queue root error error
				done(queueRootDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		QueueRoot.remove().exec();
		done();
	});
});