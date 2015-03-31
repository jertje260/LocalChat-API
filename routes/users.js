var express = require('express');
var router = express.Router();
var _ = require('underscore');
var handleError;

var mongoose = require('mongoose');
var User = mongoose.model('User');

var userFunctions = require('../userFunctions.js');

// Routing
router.route('/')
	.get(function(req, res, next) { userFunctions.getUsers(User, req, res); })
	.post(function(req, res, next) { userFunctions.postUser(User, req, res); });
	

router.route('/:UserName')
	.get(function(req, res, next) { userFunctions.getUser(User, req, res); })
	.put(function(req, res, next) { userFunctions.putUser(User, req, res); })
	.delete(function(req, res,next) { userFunctions.deleteUser(User, req, res); });


// Export
module.exports = function (mongoose, errCallback){
	// console.log('Initializing users routing module');
	User = mongoose.model('User');
	handleError = errCallback;
	return router;
};