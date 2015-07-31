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
	id: String, 
	root_id: String, 
	seen: {
		type: Boolean, 
		default: false
	},
	url: {
		type: String,
		default: '',
		required: 'Please fill Url in process name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('UrlInProcess', UrlInProcessSchema);