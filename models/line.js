function init(mongoose){
	console.log('Initializing line schema');
	require('./user');
	var lineSchema = new mongoose.Schema({
		lineString: {type: String, required: true},
		User: {[mongoose.model('User')], required: true},
		Longitude: {type: double, required: true},
		Latitude: {type: double, required: true}

	});

	return mongoose.model('Line', lineSchema);
}

module.exports = init;