module.exports = {
	getUsers: function(User, req, res) {
		User.find(function(err, result) { res.json(result); });
	},
	getUser: function(User, req, res) {
		User.findOne({UserName:req.params.UserName}, function(err, user) { res.send(user); });
	},
	postUser: function(User, req, res) {
		var user = new User();
		user.UserName = req.body.UserName;
		user.set('password', req.body.password);
		console.log(req.body.DisplayName);
		if(req.body.DisplayName == undefined) { user.DisplayName = user.UserName; } else { user.DisplayName = req.body.DisplayName; }
		if(req.body.Radius != undefined) { user.RadiusM = req.body.Radius; }
		
		user.save(function(err) { if(err) { res.send(err + user); } else { res.send(user); } });
	},
	putUser: function(User, req, res) {
		User.findOne({UserName:req.params.UserName}, function(err, user){
			if(req.body.DisplayName != undefined) { user.DisplayName = req.body.DisplayName; }
			if(req.body.password != undefined || req.body.password != "") { user.password = req.body.password; }
			if(req.body.RadiusM != undefined ) { user.RadiusM = req.body.RadiusM; }
			if(req.body.Role != undefined) { user.Role = req.body.Role; }

			user.save(function(err) { if(!err) { res.send(user); } else { console.log(err); } });
		});
	},
	deleteUser: function(User, req, res) {
		User.findOne({UserName:req.params.UserName}, function(err, user){
			user.remove(function(err) { if(!err) { res.send(''); } else { console.log(err); } });
		});
	},
	setPassword: function(password) {
		if(password != undefined){		
			this._password = password;
			this.Salt = this.makeSalt();
			this.HashedPass = this.encryptPassword(password);
			console.log('setting pass');
		}
	}
};