'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var surveys = require('../../app/controllers/surveys.server.controller');

	// Surveys Routes
	app.route('/surveys')
		.get(surveys.list)
		.post(users.requiresLogin, surveys.create);

	app.route('/surveys/:surveyId')
		.get(surveys.read)
		.put(users.requiresLogin, surveys.hasAuthorization, surveys.update)
		.delete(users.requiresLogin, surveys.hasAuthorization, surveys.delete);

	// Finish by binding the Survey middleware
	app.param('surveyId', surveys.surveyByID);
};
