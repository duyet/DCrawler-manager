'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Queue root Schema
 */
var QueueRootSchema = new Schema({
	id: {
		type: String, 
		index: {unique: true}
	},
	url: {
		type: String,
		default: '',
		required: 'Please fill Queue root name',
		trim: true
	},
	status : { 
		type: Number, 
		default: 1 
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	last_run: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('QueueRoot', QueueRootSchema);