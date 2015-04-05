var express = require('express');
var router = express.Router();
var _ = require('underscore');
var handleError;

var User;

// Routing
router.route('/')
	.get(getUsers)
	.post(postUser);

router.route('/login')
	.post(login);
	
router.route('/:UserName')
	.get(getUser)
	.put(putUser)
	.delete(deleteUser);

// Functions
function getUsers(req, res, next) {
	console.log(req.query.UserName);
	if(req.query.UserName != null){
		res.redirect('/users/' + req.query.UserName + '');
	} else {
		// console.log(User);
		User.find(function(err, result) {  res.json(result); });
	}
}

function postUser(req, res, next) {
	// console.log(req.route);
	var user = new User();
	user.UserName = req.body.UserName;
	user.set('password', req.body.password);
	
	// console.log(user);

	if(req.body.DisplayName != undefined) { user.DisplayName = req.body.DisplayName; } else { user.DisplayName = user.UserName; }
	if(req.body.RadiusM != undefined) { user.RadiusM = req.body.RadiusM; }
	
	user.save(function(err) { if(err) { res.send(err + user); } else { res.send(user); } });
}

// Route with params
function getUser(req, res, next) {
	User.findOne({UserName:req.params.UserName}, function(err, user) { res.send(user); });
}

function putUser(req, res, next) {
	User.findOne({UserName:req.params.UserName}, function(err, user){
		if(req.body.DisplayName != undefined) { user.DisplayName = req.body.DisplayName; }
		if(req.body.password != undefined || req.body.password != "") { user.password = req.body.password; }
		if(req.body.RadiusM != undefined ) { user.RadiusM = req.body.RadiusM; }
		if(req.body.Role != undefined) { user.Role = req.body.Role; }

		user.save(function(err) { if(!err) { res.send(user); } else { console.log(err); } });
	});
}

function deleteUser(req, res, next) {
	User.findOne({UserName:req.params.UserName}, function(err, user){
		user.remove(function(err) { if(!err) { res.send(''); } else { console.log(err); } });
	});
}

function login(req, res, next) {
	var tempuser;
	User.findOne({UserName:req.body.UserName} , function(err, user){
		if(err){
			res.send("User not found");
		}
		else {
			if(!user.authenticate(req.body.password)){
				res.send("Password incorrect");
			} else {
				res.send(user);
			}
		}
	});
}

	
	


// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing users routing module');
	User = mongoose.model('User');
	handleError = errCallback;
	return router;
};