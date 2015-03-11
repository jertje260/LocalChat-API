function init(mongoose){
	console.log('Initializing line schema');
	require('./user');
	var lineSchema = new mongoose.Schema({
		lineString: {type: String, required: true},
		User: [mongoose.model('User')],
		Longitude: {type: Number, required: true},
		Latitude: {type: Number, required: true}

	});

	module.exports = mongoose.model('Line', lineSchema);
}

module.exports = init;