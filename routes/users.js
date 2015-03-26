var express = require('express');
var router = express.Router();
var _ = require('underscore');
var handleError;

var mongoose = require('mongoose');
// var User = mongoose.model('User');

// Routing
router.route('/')
	.get(function(req, res, next){
		User.find(function(err, result){
			res.json(result); // Returns all users
		});
	})
	.post(function(req, res, next){ //register new user
		var User = mongoose.model('User');
		
		var user = new User();
		user.UserName = req.body.UserName;
		user.set('password', req.body.password);
		
		if(req.body.DisplayName != 'undefined')
		{
			user.DisplayName = req.body.DisplayName;
		} else {
			user.DisplayName = user.UserName;
		}
		console.log(user);
		console.log(user.UserName);
		user.save(function(err){
			if(err){
				res.send(err + user);
			}
			else{
				res.send(user);
			}
		});
	});

router.route('/:UserName')
	.get(function(req, res, next){
		console.log(req.params.UserName);
		User.findOne({UserName:req.params.UserName} ,function(err, user){
			res.send(user); 
		});
	});


// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing users routing module');
	User = mongoose.model('User');
	handleError = errCallback;
	return router;
};