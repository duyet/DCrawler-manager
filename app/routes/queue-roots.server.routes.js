'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var queueRoots = require('../../app/controllers/queue-roots.server.controller');

	// Queue roots Routes
	app.route('/queue-roots')
		.get(queueRoots.list)
		.post(users.requiresLogin, queueRoots.create);

	app.route('/queue-roots/:queueRootId')
		.get(queueRoots.read)
		.put(users.requiresLogin, queueRoots.hasAuthorization, queueRoots.update)
		.delete(users.requiresLogin, queueRoots.hasAuthorization, queueRoots.delete);

	// Finish by binding the Queue root middleware
	app.param('queueRootId', queueRoots.queueRootByID);
};
