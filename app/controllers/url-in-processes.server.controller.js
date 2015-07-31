'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	UrlInProcess = mongoose.model('UrlInProcess'),
	_ = require('lodash');

/**
 * Create a Url in process
 */
exports.create = function(req, res) {
	var urlInProcess = new UrlInProcess(req.body);
	
	urlInProcess.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(urlInProcess);
		}
	});
};

/**
 * Show the current Url in process
 */
exports.read = function(req, res) {
	res.jsonp(req.urlInProcess);
};

/**
 * Update a Url in process
 */
exports.update = function(req, res) {
	var urlInProcess = req.urlInProcess ;

	urlInProcess = _.extend(urlInProcess , req.body);

	urlInProcess.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(urlInProcess);
		}
	});
};

/**
 * Delete an Url in process
 */
exports.delete = function(req, res) {
	var urlInProcess = req.urlInProcess ;

	urlInProcess.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(urlInProcess);
		}
	});
};

/**
 * List of Url in processes
 */
exports.list = function(req, res) { 
	UrlInProcess.find().sort('-created').populate('user', 'displayName').exec(function(err, urlInProcesses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(urlInProcesses);
		}
	});
};

/**
 * Url in process middleware
 */
exports.urlInProcessByID = function(req, res, next, id) { 
	UrlInProcess.findById(id).populate('user', 'displayName').exec(function(err, urlInProcess) {
		if (err) return next(err);
		if (! urlInProcess) return next(new Error('Failed to load Url in process ' + id));
		req.urlInProcess = urlInProcess ;
		next();
	});
};

/**
 * Url in process authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.urlInProcess.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
