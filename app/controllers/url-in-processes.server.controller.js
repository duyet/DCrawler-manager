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
	urlInProcess.user = req.user;

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

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;


	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start: (page - 1) * count,
		count: count
	};

	if (req.query.sorting) {
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;
	}
	else {
		sortObject.desc = '_id';
	}

	sort = {
		sort: sortObject
	};


	UrlInProcess
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, urlInProcesses){
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
