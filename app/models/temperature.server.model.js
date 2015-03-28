'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Temperature Schema
 */
var TemperatureSchema = new Schema({
	temperature: {
		type: Number,
		default: '',
		required: 'Please fill Temperature',
		trim: true
	},
  recorded: {
    type: Date,
    defult: Date.now,
  },
  feeling: {
    type: String,
    default: '',
    trim: false
  },
  memo: {
    type: String,
    default: '',
    trim: false
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

mongoose.model('Temperature', TemperatureSchema);
