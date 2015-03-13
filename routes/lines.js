var express = require('express');
var router = express();
var Line;
var _ = require('underscore');
var handleError;



// Routing
router.route('/')
	.get(function(req, res, next){
		Line.find(function(err, result){
			res.json(result); // Returns all lines
		});
	})
	.post(function(req, res, next){ //add new line
		var line = new Line(req.body.line);
		line.Body = req.body.Body;
		// line.Longitude = req.body.Longitude;
		// line.Latitude = req.body.Latitude;
		// line.User = req.body.User;
		console.log(line);
		line.save(function(err, line){
			res.send({msg: "" + line.Body + ": was send."});
		});
	});


// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing users routing module');
	Line = mongoose.model('Line');
	handleError = errCallback;
	return router;
};