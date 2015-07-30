'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Queue link Schema
 */
var QueueLinkSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Queue link name',
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

mongoose.model('QueueLink', QueueLinkSchema);