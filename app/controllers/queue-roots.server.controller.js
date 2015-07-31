'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	QueueRoot = mongoose.model('QueueRoot'),
	_ = require('lodash');

/**
 * Create a Queue root
 */
exports.create = function(req, res) {
	var queueRoot = new QueueRoot(req.body);
	queueRoot.user = req.user;

	queueRoot.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(queueRoot);
		}
	});
};

/**
 * Show the current Queue root
 */
exports.read = function(req, res) {
	res.jsonp(req.queueRoot);
};

/**
 * Update a Queue root
 */
exports.update = function(req, res) {
	var queueRoot = req.queueRoot ;

	queueRoot = _.extend(queueRoot , req.body);

	queueRoot.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(queueRoot);
		}
	});
};

/**
 * Delete an Queue root
 */
exports.delete = function(req, res) {
	var queueRoot = req.queueRoot ;

	queueRoot.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(queueRoot);
		}
	});
};

/**
 * List of Queue roots
 */
exports.list = function(req, res) { 
	QueueRoot.find().sort('-created').populate('user', 'displayName').exec(function(err, queueRoots) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(queueRoots);
		}
	});
};

/**
 * Queue root middleware
 */
exports.queueRootByID = function(req, res, next, id) { 
	QueueRoot.findById(id).populate('user', 'displayName').exec(function(err, queueRoot) {
		if (err) return next(err);
		if (! queueRoot) return next(new Error('Failed to load Queue root ' + id));
		req.queueRoot = queueRoot ;
		next();
	});
};

/**
 * Queue root authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.queueRoot.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
