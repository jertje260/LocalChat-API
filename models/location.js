function init(mongoose){
	console.log('Initializing line schema');
	var locationSchema = new mongoose.Schema({
		Longitude: {type: Number, required: true}, //in radians
		Latitude: {type: Number, required: true}, //in radians
		Datetime: {type: Date, default: Date.now}
	});

	module.exports = mongoose.model('Location', locationSchema);
}

module.exports = init;