module.exports = {
	// Users
	getUsers: function(User, req, res) {
		User.find(function(err, result){
			res.json(result); // Returns all users
		});
	},
	getUser: function(User, req, res) {
		console.log("getUser");
		User.findOne({UserName:req.params.UserName} ,function(err, user){
			res.send(user); 
		});
	},
	postUser: function(User, req, res) {
		console.log('new user');
		var user = new User();
		user.UserName = req.body.UserName;
		user.set('password', req.body.password);
		console.log(req.body.DisplayName);
		if(req.body.DisplayName == undefined)
		{
			user.DisplayName = user.UserName;
		} else {
			user.DisplayName = req.body.DisplayName;
		}
		if(req.body.Radius != undefined){
			user.RadiusM = req.body.Radius;
		}
		if(req.body.Role != undefined){ // might wanna remove this because of security issues.
			user.Role = req.body.Role;
		}

		console.log(user);
		console.log(user.DisplayName);
		
		user.save(function(err){
			if(err){
				res.send(err + user);
			}
			else{
				res.send(user);
			}
		});
	},
	putUser: function(User, req, res) {
		console.log("putUser");
		User.findOne({UserName:req.params.UserName} ,function(err, user){
			if(req.body.DisplayName != undefined){
				user.DisplayName = req.body.DisplayName;
			}
			if(req.body.password != undefined || req.body.password != ""){
				user.password = req.body.password;
			}
			if(req.body.RadiusM != undefined ){
				user.RadiusM = req.body.RadiusM;
			}
			if(req.body.Role != undefined){
				user.Role = req.body.Role;
			}
			user.save(function(err){
				if(!err) { res.send(user); } else { console.log(err); }
			});
		});
	},
	deleteUser: function(User, req, res) {
		console.log("deleteUser");
		User.findOne({UserName:req.params.UserName} ,function(err, user){
			user.remove(function(err){
				if(!err) { res.send(''); } else { console.log(err); }
			});
		});
	}
	// Lines
};