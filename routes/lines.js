var express = require('express');
var router = express();
var Line;
var _ = require('underscore');
var handleError;

var lineFunctions = require('../lineFunctions.js');

// Routing
/*
Suppose we want to find places within a distance d=1000 km from M=(lat, lon)=(1.3963, -0.6981) in a database. 

Given that we have a table named Places with columns Lat and Lon that hold the coordinates in radians, then we could use this SQL query:
SELECT * FROM Places WHERE acos(sin(1.3963) * sin(Lat) + cos(1.3963) * cos(Lat) * cos(Lon - (-0.6981))) * 6371 <= 1000;
*/
router.route('/')
	.get(function(req, res, next) { lineFunctions.getLines(Line, req, res); })
	.post(function(req, res, next) { lineFunctions.getLines(Line, req, res); });
	
	// TODO: Delete toevoegen

// Export
module.exports = function (mongoose, errCallback){
	// console.log('Initializing lines routing module');
	Line = mongoose.model('Line');
	handleError = errCallback;
	return router;
};