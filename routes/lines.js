var express = require('express');
var router = express.Router();
var _ = require('underscore');
var handleError;
var pi = 3.14159265358979323846264338327950288419716939937510;
var events = require('events');
var bus = require('../sockets/bus');

var Line;
var User;
var Location;

// Routing
router.route('/')
	.get(getLine)
	.post(postLine);

// Functions
function getLine(req, res, next) {
	if(req.query.Latitude != undefined && !isNaN(req.query.Latitude) && req.query.Longitude != undefined && !isNaN(req.query.Longitude) && req.query.Radius != undefined && !isNaN(req.query.Radius)){
		// Magic calculation for circle

		var Radius = (req.query.Radius/1000) /* radius in km */, Long = req.query.Location.Longitude * (pi/180),
			Lat = req.query.Location.Latitude * (pi/180), r = Radius/6371 /* angular radius */,
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
			Line.find().where('Location.Latitude').gte(Latmin).lte(Latmax)
			.where('Location.Longitude').gte(LongMin).lte(LongMax)
			.populate('User').populate('Location').sort({Datetime: 'desc'}).skip((Page -1)*Amount).limit(Amount).exec(function(err, result){
			if(err){
				res.send(err);
			} else {
				result.forEach(function(line){
					line.Latitude = (line.Latitude / (pi/180));
					line.Longitude = (line.Longitude / (pi/180));
				});	
				
				res.json(result);
			}
		});
		} else {
			// Now only checking in a squarish pattern for the messages
			Line.find().where('Location.Latitude').gte(Latmin).lte(Latmax)
				.where('Location.Longitude').gte(LongMin).lte(LongMax)
				.populate('User').populate('Location').sort({Datetime: 'desc'}).exec(function(err, result) { if(err) { res.send(err); } else { 
					result.forEach(function(line){
					line.Location.Latitude = (line.Location.Latitude / (pi/180));
					line.Location.Longitude = (line.Location.Longitude / (pi/180));
				});	
				
					res.json(result); 
				} 
			});
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
			Line.find().populate('User').sort({Datetime: 'desc'}).skip((Page -1)*Amount).limit(Amount).exec(function(err, result) { 
				result.forEach(function(line){
					line.Latitude = (line.Latitude / (pi/180));
					line.Longitude = (line.Longitude / (pi/180));
				});	
				res.json(result); 
			});
		} else {
		Line.find().populate('User').sort({Datetime: 'desc'}).exec(function(err, result) { 
			result.forEach(function(line){
					line.Latitude = (line.Latitude / (pi/180));
					line.Longitude = (line.Longitude / (pi/180));
				});	
			res.json(result); });
		}
	}
}

function postLine(req, res, next) {
	var location = new Location();
	location.Longitude = req.body.Longitude * (pi/180);
	location.Latitude = req.body.Latitude * (pi/180);

	location.save(function(err, line) {
		if (err) { console.log(err); }
	});
	var line = new Line({
		Body : req.body.Body,
		User : req.body.User,
		Location : location._id
	});
	line.save(function(err, line) {
		if(err) { res.send(err); }
		else { bus.emit('bus chat msg', line._id); res.send(line); } 
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
	Location = mongoose.model('Location');
	handleError = errCallback;
	return router;
};