function init(mongoose){
	var crypto = require('crypto');
	console.log('Initializing user schema');
	var userSchema = new mongoose.Schema
	({
		UserName: {type: String, required: true, unique: true},
		DisplayName: {type: String, required: true},
		HashedPass: {type: String, required: true},
		Salt: {type: String, required: true},
		Role: {type: String, default: 'User', enum: ['User', 'Admin']},
		RadiusM: {type: Number, default: 500} // radius in meters
	});

	userSchema.virtual('password')
		.set(function(password){
			console.log('setting password');
			this._password = password;
			console.log('making salt');
			this.Salt = this.makeSalt();
			console.log('encrypting password');
			this.HashedPass = this.encryptPassword(password);
		})
		.get(function() { return this._password; });

	userSchema.methods.authenticate =  function authenticate(plainText) {
		return this.encryptPassword(plainText) === this.HashedPass;
	};

	userSchema.methods.makeSalt = function makeSalt() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	};

	userSchema.methods.encryptPassword = function encryptPassword(password){
		return crypto.createHmac('sha1', this.Salt).update(password).digest('hex');
	};

	userSchema.pre('save', function(next) {
		if(this.password == 'undefined'){
			next(new Error('Invalid password'));
		} else {
			next();
		}
	});


	module.exports = mongoose.model('User', userSchema);
}

module.exports = init;