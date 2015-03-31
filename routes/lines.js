var express = require('express');
var router = express.Router();
var _ = require('underscore');
var handleError;
var pi = 3.14159265358979323846264338327950288419716939937510;
var events = require('events');
var bus = require('../sockets/bus');

var Line;

// Routing
/*
Suppose we want to find places within a distance d=1000 km from M=(lat, lon)=(1.3963, -0.6981) in a database. 

Given that we have a table named Places with columns Lat and Lon that hold the coordinates in radians, then we could use this SQL query:
SELECT * FROM Places WHERE acos(sin(1.3963) * sin(Lat) + cos(1.3963) * cos(Lat) * cos(Lon - (-0.6981))) * 6371 <= 1000;
*/
router.route('/')
	.get(function(req, res, next){
		if(req.query.Latitude != undefined && req.query.Longitude != undefined && req.query.Radius != undefined){
			// Magic calculation for circle

			var Radius = (req.query.Radius/1000) /* radius in km */, Long = req.query.Longitude * (pi/180),
				Lat = req.query.Latitude * (pi/180), r = Radius/6371 /* angular radius */,
				Latmin = Lat - r, Latmax = Lat + r, latT = Math.asin(Math.sin(Lat)/Math.cos(r)),
				DeltaLong = Math.acos((Math.cos(r)-Math.sin(latT)*Math.sin(Lat))/(Math.cos(latT)*Math.cos(Lat))),
				LongMax = Long + DeltaLong, LongMin = Long - DeltaLong;

			// Now only checking in a squarish pattern for the messages, the commented part needs to be changed, so it checks in a circle.
			Line.find().where('Latitude').gte(Latmin).lte(Latmax)
				.where('Longitude').gte(LongMin).lte(LongMax)
				.populate('User').exec(function(err, result){
				if(err){
					res.send(err);
				} else {
					res.json(result);
				}
			});
		} else {
			Line.find().populate('User').exec(function(err, result) { res.json(result); });
		}
	})
	.post(function(Line, req, res) {
		var line = new Line({
			Body: req.body.Body,
			Longitude: req.body.Longitude * (pi/180),
			Latitude: req.body.Latitude * (pi/180),
			User: req.body.User
		});
		bus.emit('bus chat msg', { "msg" : req.body.Body, "date" : Date.now(), "DisplayName" : line.User.DisplayName});
		
		line.save(function(err, line) { if(err) { res.send(err); } else { res.send({ msg: "" + line.Body + ": was send." }); } });
	});


// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing lines routing module');
	Line = mongoose.model('Line');
	handleError = errCallback;
	return router;
};