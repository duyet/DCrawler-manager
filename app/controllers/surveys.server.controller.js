'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Survey = mongoose.model('Survey'),
	_ = require('lodash');

/**
 * Create a Survey
 */
exports.create = function(req, res) {
	var survey = new Survey(req.body);
	survey.user = req.user;

	survey.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(survey);
		}
	});
};

/**
 * Show the current Survey
 */
exports.read = function(req, res) {
	res.jsonp(req.survey);
};

/**
 * Update a Survey
 */
exports.update = function(req, res) {
	var survey = req.survey ;

	survey = _.extend(survey , req.body);

	survey.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(survey);
		}
	});
};

/**
 * Delete an Survey
 */
exports.delete = function(req, res) {
	var survey = req.survey ;

	survey.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(survey);
		}
	});
};

/**
 * List of Surveys
 */
exports.list = function(req, res) { 
	Survey.find().sort('-created').populate('user', 'displayName').exec(function(err, surveys) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(surveys);
		}
	});
};

/**
 * Survey middleware
 */
exports.surveyByID = function(req, res, next, id) { 
	Survey.findById(id).populate('user', 'displayName').exec(function(err, survey) {
		if (err) return next(err);
		if (! survey) return next(new Error('Failed to load Survey ' + id));
		req.survey = survey ;
		next();
	});
};

/**
 * Survey authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.survey.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
