'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var temperatures = require('../../app/controllers/temperatures.server.controller');

	// Temperatures Routes
	app.route('/temperatures')
		.get(temperatures.list)
		.post(users.requiresLogin, temperatures.create);

	app.route('/temperatures/:temperatureId')
		.get(temperatures.read)
		.put(users.requiresLogin, temperatures.hasAuthorization, temperatures.update)
		.delete(users.requiresLogin, temperatures.hasAuthorization, temperatures.delete);

	// Finish by binding the Temperature middleware
	app.param('temperatureId', temperatures.temperatureByID);
};
