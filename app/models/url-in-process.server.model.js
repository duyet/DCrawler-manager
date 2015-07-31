'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Url in process Schema
 */
var UrlInProcessSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Url in process name',
		trim: true
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

mongoose.model('UrlInProcess', UrlInProcessSchema);