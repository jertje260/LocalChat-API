var express = require('express');
var router = express.Router();
var _ = require('underscore');
var handleError;
var pi = 3.14159265358979323846264338327950288419716939937510;
var events = require('events');
var bus = require('../sockets/bus');

var Line;
var User;

// Routing
router.route('/')
	.get(getLine)
	.post(postLine);

// Functions
function getLine(req, res, next) {
	if(req.query.Latitude != undefined && !isNaN(req.query.Latitude) && req.query.Longitude != undefined && !isNaN(req.query.Longitude) && req.query.Radius != undefined && !isNaN(req.query.Radius)){
		// Magic calculation for circle

		var Radius = (req.query.Radius/1000) /* radius in km */, Long = req.query.Longitude * (pi/180),
			Lat = req.query.Latitude * (pi/180), r = Radius/6371 /* angular radius */,
			Latmin = Lat - r, Latmax = Lat + r, latT = Math.asin(Math.sin(Lat)/Math.cos(r)),
			DeltaLong = Math.acos((Math.cos(r)-Math.sin(latT)*Math.sin(Lat))/(Math.cos(latT)*Math.cos(Lat))),
			LongMax = Long + DeltaLong, LongMin = Long - DeltaLong;
			
		// Paging enabled?
		if(req.query.Page != null && isInteger(parseInt(req.query.Page))){
			var Amount;
			var Page = req.query.Page;
			if(req.query.Amount != null && isInteger(parseInt(req.query.Amount))) {
				Amount = req.query.Amount;
			} else {
				Amount = 20;
			}
			Line.find().where('Latitude').gte(Latmin).lte(Latmax)
			.where('Longitude').gte(LongMin).lte(LongMax)
			.populate('User').sort({Datetime: 'desc'}).skip((Page -1)*Amount).limit(Amount).exec(function(err, result){
			if(err){
				res.send(err);
			} else {
				res.json(result);
			}
		});
		} else {
			// Now only checking in a squarish pattern for the messages
			Line.find().where('Latitude').gte(Latmin).lte(Latmax)
				.where('Longitude').gte(LongMin).lte(LongMax)
				.populate('User').sort({Datetime: 'desc'}).exec(function(err, result) { if(err) { res.send(err); } else { res.json(result); } });
		}
	} else {
		// Paging enabled?
		if(req.query.Page != null && isInteger(parseInt(req.query.Page))){
			var Amount;
			var Page = req.query.Page;
			if(req.query.Amount != null && isInteger(parseInt(req.query.Amount))) {
				Amount = req.query.Amount;
			} else {
				Amount = 20;
			}
			Line.find().populate('User').sort({Datetime: 'desc'}).skip((Page -1)*Amount).limit(Amount).exec(function(err, result) { res.json(result); });
		} else {
		Line.find().populate('User').sort({Datetime: 'desc'}).exec(function(err, result) { res.json(result); });
		}
	}
}

function postLine(req, res, next) {
	var line = new Line({
		Body : req.body.Body,
		Longitude : req.body.Longitude * (pi/180),
		Latitude : req.body.Latitude * (pi/180),
		User : req.body.User
	});
	line.save(function(err, line) {
		if(err) { res.send(err); }
		else { bus.emit('bus chat msg', line._id); res.send({ msg: "" + line.Body + ": was send." }); } 
	});
}

function isInteger(x) {
    return Math.round(x) === x;
}

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing lines routing module');
	Line = mongoose.model('Line');
	User = mongoose.model('User');
	handleError = errCallback;
	return router;
};