'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Temperature = mongoose.model('Temperature'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, temperature;

/**
 * Temperature routes tests
 */
describe('Temperature CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Temperature
		user.save(function() {
			temperature = {
				name: 'Temperature Name'
			};

			done();
		});
	});

	it('should be able to save Temperature instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Temperature
				agent.post('/temperatures')
					.send(temperature)
					.expect(200)
					.end(function(temperatureSaveErr, temperatureSaveRes) {
						// Handle Temperature save error
						if (temperatureSaveErr) done(temperatureSaveErr);

						// Get a list of Temperatures
						agent.get('/temperatures')
							.end(function(temperaturesGetErr, temperaturesGetRes) {
								// Handle Temperature save error
								if (temperaturesGetErr) done(temperaturesGetErr);

								// Get Temperatures list
								var temperatures = temperaturesGetRes.body;

								// Set assertions
								(temperatures[0].user._id).should.equal(userId);
								(temperatures[0].name).should.match('Temperature Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Temperature instance if not logged in', function(done) {
		agent.post('/temperatures')
			.send(temperature)
			.expect(401)
			.end(function(temperatureSaveErr, temperatureSaveRes) {
				// Call the assertion callback
				done(temperatureSaveErr);
			});
	});

	it('should not be able to save Temperature instance if no name is provided', function(done) {
		// Invalidate name field
		temperature.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Temperature
				agent.post('/temperatures')
					.send(temperature)
					.expect(400)
					.end(function(temperatureSaveErr, temperatureSaveRes) {
						// Set message assertion
						(temperatureSaveRes.body.message).should.match('Please fill Temperature name');
						
						// Handle Temperature save error
						done(temperatureSaveErr);
					});
			});
	});

	it('should be able to update Temperature instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Temperature
				agent.post('/temperatures')
					.send(temperature)
					.expect(200)
					.end(function(temperatureSaveErr, temperatureSaveRes) {
						// Handle Temperature save error
						if (temperatureSaveErr) done(temperatureSaveErr);

						// Update Temperature name
						temperature.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Temperature
						agent.put('/temperatures/' + temperatureSaveRes.body._id)
							.send(temperature)
							.expect(200)
							.end(function(temperatureUpdateErr, temperatureUpdateRes) {
								// Handle Temperature update error
								if (temperatureUpdateErr) done(temperatureUpdateErr);

								// Set assertions
								(temperatureUpdateRes.body._id).should.equal(temperatureSaveRes.body._id);
								(temperatureUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Temperatures if not signed in', function(done) {
		// Create new Temperature model instance
		var temperatureObj = new Temperature(temperature);

		// Save the Temperature
		temperatureObj.save(function() {
			// Request Temperatures
			request(app).get('/temperatures')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Temperature if not signed in', function(done) {
		// Create new Temperature model instance
		var temperatureObj = new Temperature(temperature);

		// Save the Temperature
		temperatureObj.save(function() {
			request(app).get('/temperatures/' + temperatureObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', temperature.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Temperature instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Temperature
				agent.post('/temperatures')
					.send(temperature)
					.expect(200)
					.end(function(temperatureSaveErr, temperatureSaveRes) {
						// Handle Temperature save error
						if (temperatureSaveErr) done(temperatureSaveErr);

						// Delete existing Temperature
						agent.delete('/temperatures/' + temperatureSaveRes.body._id)
							.send(temperature)
							.expect(200)
							.end(function(temperatureDeleteErr, temperatureDeleteRes) {
								// Handle Temperature error error
								if (temperatureDeleteErr) done(temperatureDeleteErr);

								// Set assertions
								(temperatureDeleteRes.body._id).should.equal(temperatureSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Temperature instance if not signed in', function(done) {
		// Set Temperature user 
		temperature.user = user;

		// Create new Temperature model instance
		var temperatureObj = new Temperature(temperature);

		// Save the Temperature
		temperatureObj.save(function() {
			// Try deleting Temperature
			request(app).delete('/temperatures/' + temperatureObj._id)
			.expect(401)
			.end(function(temperatureDeleteErr, temperatureDeleteRes) {
				// Set message assertion
				(temperatureDeleteRes.body.message).should.match('User is not logged in');

				// Handle Temperature error error
				done(temperatureDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Temperature.remove().exec();
		done();
	});
});