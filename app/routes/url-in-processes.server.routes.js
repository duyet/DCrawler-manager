'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var urlInProcesses = require('../../app/controllers/url-in-processes.server.controller');

	// Url in processes Routes
	app.route('/url-in-processes')
		.get(urlInProcesses.list)
		.post(users.requiresLogin, urlInProcesses.create);

	app.route('/url-in-processes/:urlInProcessId')
		.get(urlInProcesses.read)
		.put(users.requiresLogin, urlInProcesses.hasAuthorization, urlInProcesses.update)
		.delete(users.requiresLogin, urlInProcesses.hasAuthorization, urlInProcesses.delete);

	// Finish by binding the Url in process middleware
	app.param('urlInProcessId', urlInProcesses.urlInProcessByID);
};
