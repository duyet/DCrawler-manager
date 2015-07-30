'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	QueueLink = mongoose.model('QueueLink'),
	_ = require('lodash');

/**
 * Create a Queue link
 */
exports.create = function(req, res) {
	var queueLink = new QueueLink(req.body);
	queueLink.user = req.user;

	queueLink.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(queueLink);
		}
	});
};

/**
 * Show the current Queue link
 */
exports.read = function(req, res) {
	res.jsonp(req.queueLink);
};

/**
 * Update a Queue link
 */
exports.update = function(req, res) {
	var queueLink = req.queueLink ;

	queueLink = _.extend(queueLink , req.body);

	queueLink.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(queueLink);
		}
	});
};

/**
 * Delete an Queue link
 */
exports.delete = function(req, res) {
	var queueLink = req.queueLink ;

	queueLink.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(queueLink);
		}
	});
};

/**
 * List of Queue links
 */
exports.list = function(req, res) { 
	QueueLink.find().sort('-created').populate('user', 'displayName').exec(function(err, queueLinks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(queueLinks);
		}
	});
};

/**
 * Queue link middleware
 */
exports.queueLinkByID = function(req, res, next, id) { 
	QueueLink.findById(id).populate('user', 'displayName').exec(function(err, queueLink) {
		if (err) return next(err);
		if (! queueLink) return next(new Error('Failed to load Queue link ' + id));
		req.queueLink = queueLink ;
		next();
	});
};

/**
 * Queue link authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.queueLink.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
