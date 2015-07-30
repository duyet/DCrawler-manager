'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	QueueLink = mongoose.model('QueueLink'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, queueLink;

/**
 * Queue link routes tests
 */
describe('Queue link CRUD tests', function() {
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

		// Save a user to the test db and create new Queue link
		user.save(function() {
			queueLink = {
				name: 'Queue link Name'
			};

			done();
		});
	});

	it('should be able to save Queue link instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Queue link
				agent.post('/queue-links')
					.send(queueLink)
					.expect(200)
					.end(function(queueLinkSaveErr, queueLinkSaveRes) {
						// Handle Queue link save error
						if (queueLinkSaveErr) done(queueLinkSaveErr);

						// Get a list of Queue links
						agent.get('/queue-links')
							.end(function(queueLinksGetErr, queueLinksGetRes) {
								// Handle Queue link save error
								if (queueLinksGetErr) done(queueLinksGetErr);

								// Get Queue links list
								var queueLinks = queueLinksGetRes.body;

								// Set assertions
								(queueLinks[0].user._id).should.equal(userId);
								(queueLinks[0].name).should.match('Queue link Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Queue link instance if not logged in', function(done) {
		agent.post('/queue-links')
			.send(queueLink)
			.expect(401)
			.end(function(queueLinkSaveErr, queueLinkSaveRes) {
				// Call the assertion callback
				done(queueLinkSaveErr);
			});
	});

	it('should not be able to save Queue link instance if no name is provided', function(done) {
		// Invalidate name field
		queueLink.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Queue link
				agent.post('/queue-links')
					.send(queueLink)
					.expect(400)
					.end(function(queueLinkSaveErr, queueLinkSaveRes) {
						// Set message assertion
						(queueLinkSaveRes.body.message).should.match('Please fill Queue link name');
						
						// Handle Queue link save error
						done(queueLinkSaveErr);
					});
			});
	});

	it('should be able to update Queue link instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Queue link
				agent.post('/queue-links')
					.send(queueLink)
					.expect(200)
					.end(function(queueLinkSaveErr, queueLinkSaveRes) {
						// Handle Queue link save error
						if (queueLinkSaveErr) done(queueLinkSaveErr);

						// Update Queue link name
						queueLink.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Queue link
						agent.put('/queue-links/' + queueLinkSaveRes.body._id)
							.send(queueLink)
							.expect(200)
							.end(function(queueLinkUpdateErr, queueLinkUpdateRes) {
								// Handle Queue link update error
								if (queueLinkUpdateErr) done(queueLinkUpdateErr);

								// Set assertions
								(queueLinkUpdateRes.body._id).should.equal(queueLinkSaveRes.body._id);
								(queueLinkUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Queue links if not signed in', function(done) {
		// Create new Queue link model instance
		var queueLinkObj = new QueueLink(queueLink);

		// Save the Queue link
		queueLinkObj.save(function() {
			// Request Queue links
			request(app).get('/queue-links')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Queue link if not signed in', function(done) {
		// Create new Queue link model instance
		var queueLinkObj = new QueueLink(queueLink);

		// Save the Queue link
		queueLinkObj.save(function() {
			request(app).get('/queue-links/' + queueLinkObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', queueLink.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Queue link instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Queue link
				agent.post('/queue-links')
					.send(queueLink)
					.expect(200)
					.end(function(queueLinkSaveErr, queueLinkSaveRes) {
						// Handle Queue link save error
						if (queueLinkSaveErr) done(queueLinkSaveErr);

						// Delete existing Queue link
						agent.delete('/queue-links/' + queueLinkSaveRes.body._id)
							.send(queueLink)
							.expect(200)
							.end(function(queueLinkDeleteErr, queueLinkDeleteRes) {
								// Handle Queue link error error
								if (queueLinkDeleteErr) done(queueLinkDeleteErr);

								// Set assertions
								(queueLinkDeleteRes.body._id).should.equal(queueLinkSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Queue link instance if not signed in', function(done) {
		// Set Queue link user 
		queueLink.user = user;

		// Create new Queue link model instance
		var queueLinkObj = new QueueLink(queueLink);

		// Save the Queue link
		queueLinkObj.save(function() {
			// Try deleting Queue link
			request(app).delete('/queue-links/' + queueLinkObj._id)
			.expect(401)
			.end(function(queueLinkDeleteErr, queueLinkDeleteRes) {
				// Set message assertion
				(queueLinkDeleteRes.body.message).should.match('User is not logged in');

				// Handle Queue link error error
				done(queueLinkDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		QueueLink.remove().exec();
		done();
	});
});