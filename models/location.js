function init(mongoose){
	console.log('Initializing location schema');
	var locationSchema = new mongoose.Schema
	({
		Longitude: {type: Number, required: true}, //in radians
		Latitude: {type: Number, required: true}, //in radians
	});


	module.exports = mongoose.model('Location', locationSchema);
}

module.exports = init;