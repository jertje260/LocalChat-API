function init(mongoose){
	console.log('Initializing line schema');
	require('./user');
	require('./location');
	var lineSchema = new mongoose.Schema({
		Body: {type: String, required: true},
		User: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		Location: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'}
	});

	module.exports = mongoose.model('Line', lineSchema);
}

module.exports = init;