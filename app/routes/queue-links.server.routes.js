'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var queueLinks = require('../../app/controllers/queue-links.server.controller');

	// Queue links Routes
	app.route('/queue-links')
		.get(queueLinks.list)
		.post(users.requiresLogin, queueLinks.create);

	app.route('/queue-links/:queueLinkId')
		.get(queueLinks.read)
		.put(users.requiresLogin, queueLinks.hasAuthorization, queueLinks.update)
		.delete(users.requiresLogin, queueLinks.hasAuthorization, queueLinks.delete);

	// Finish by binding the Queue link middleware
	app.param('queueLinkId', queueLinks.queueLinkByID);
};
