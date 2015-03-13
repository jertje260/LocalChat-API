var express = require('express');
var router = express.Router();
var _ = require('underscore');
var handleError;

var mongoose = require('mongoose');
var User = mongoose.model('User');

// Routing
router.route('/')
	.get(function(req, res, next){
		User.find(function(err, result){
			res.json(result); // Returns all users
		});
	})
	.post(function(req, res, next){ //register new user
		console.log(req.body.User + " " + req.body.UserName + " " + req.body.password);

		var user = new User(req.body.User);
		user.UserName = req.body.UserName;
		user.password = req.body.password;
		if(req.body.DisplayName != 'undefined')
		{
			user.DisplayName = req.body.DisplayName;
		} else {
			user.DisplayName = user.UserName;
		}
		user.save(function(err, user){
			res.send({msg: "The user " + user.UserName + "has been added successfully."});
		});
	});

router.route('/:id')
	.get(function(req, res, next){
		User.findOne({_id:req.params.id} ,function(err, user){
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