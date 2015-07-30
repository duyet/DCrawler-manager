'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Survey Schema
 */
var SurveySchema = new Schema({
	key: {
		type: String,
		default: '',
		trim: true
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Survey name',
		trim: true
	},
	description: {
		type: String,
		default: '',
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Survey', SurveySchema);