function init(mongoose){
	console.log('Initializing line schema');
	require('./user');
	var lineSchema = new mongoose.Schema({
		Body: {type: String, required: true},
		User: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		Longitude: {type: Number, required: true}, //in radians
		Latitude: {type: Number, required: true}, //in radians
		Datetime: {type: Date, default: Date.now}

	});

	module.exports = mongoose.model('Line', lineSchema);
}

module.exports = init;