var express = require('express');
var router = express();
var Line;
var _ = require('underscore');
var handleError;

/*
*/
function getLines(req, res){
	var query = {};
	if(req.params.id){
		query._id = req.params.id.toLowerCase();
	}

	if(req.params.id){
		data = data[0];
	}
	res.json(data);
}

// Routing
router.route('/')
	.get(getLines);

router.route('/:id')
	.get(getLines);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing users routing module');
	Line = mongoose.model('Line');
	handleError = errCallback;
	return router;
};