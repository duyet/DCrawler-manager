'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UrlInProcess = mongoose.model('UrlInProcess');

/**
 * Globals
 */
var user, urlInProcess;

/**
 * Unit tests
 */
describe('Url in process Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			urlInProcess = new UrlInProcess({
				name: 'Url in process Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return urlInProcess.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			urlInProcess.name = '';

			return urlInProcess.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		UrlInProcess.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
