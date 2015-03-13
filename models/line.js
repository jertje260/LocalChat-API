function init(mongoose){
	console.log('Initializing line schema');
	require('./user');
	var lineSchema = new mongoose.Schema({
		Body: {type: String, required: true},
		User: [mongoose.model('User')],
		Longitude: {type: Number, required: true},
		Latitude: {type: Number, required: true},
		Datetime: {type: Date, default: Date.now}

	});

	module.exports = mongoose.model('Line', lineSchema);
}

module.exports = init;