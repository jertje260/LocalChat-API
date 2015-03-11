function init(mongoose){
	console.log('Initializing user schema');
	var userSchema = new mongoose.Schema
	({
		UserName: {type: String, required: true, unique: true},
		DisplayName: {type: String, required: true},
		HashedPass: {type: String, required: true},
		Salt: {type: String, required: true},
		RadiusM: {type: Number, default: 500}

	});

	userSchema.virtual('password')
		.set(function(password){
			this._password = password;
			this.salt = this.makeSalt();
			this.HashedPass = this.encryptPassword(password);
		})
		.get(function() { return this._password; });

	userSchema.method('authenticate', function(plainText) {
		return this.encryptPassword(plainText) === this.HashedPass;
	});

	userSchema.method('makeSalt', function() {
		return Math.round((new Date.valueOf() * Math.random())) + '';
	});

	userSchema.method('encryptPassword', function(password){
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
	});

	userSchema.pre('save', function(next) {
		if(!validatePresenceOf(this.password)){
			next(new Error('Invalid password'));
		} else {
			next();
		}
	});


	module.exports = mongoose.model('User', userSchema);
}

module.exports = init;