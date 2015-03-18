'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Temperature = mongoose.model('Temperature'),
	_ = require('lodash');

/**
 * Create a Temperature
 */
exports.create = function(req, res) {
	var temperature = new Temperature(req.body);
	temperature.user = req.user;

	temperature.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(temperature);
		}
	});
};

/**
 * Show the current Temperature
 */
exports.read = function(req, res) {
	res.jsonp(req.temperature);
};

/**
 * Update a Temperature
 */
exports.update = function(req, res) {
	var temperature = req.temperature ;

	temperature = _.extend(temperature , req.body);

	temperature.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(temperature);
		}
	});
};

/**
 * Delete an Temperature
 */
exports.delete = function(req, res) {
	var temperature = req.temperature ;

	temperature.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(temperature);
		}
	});
};

/**
 * List of Temperatures
 */
exports.list = function(req, res) { 
	Temperature.find().sort('-created').populate('user', 'displayName').exec(function(err, temperatures) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(temperatures);
		}
	});
};

/**
 * Temperature middleware
 */
exports.temperatureByID = function(req, res, next, id) { 
	Temperature.findById(id).populate('user', 'displayName').exec(function(err, temperature) {
		if (err) return next(err);
		if (! temperature) return next(new Error('Failed to load Temperature ' + id));
		req.temperature = temperature ;
		next();
	});
};

/**
 * Temperature authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.temperature.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
