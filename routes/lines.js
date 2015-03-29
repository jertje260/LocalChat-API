var express = require('express');
var router = express();
var Line;
var _ = require('underscore');
var handleError;
var pi = 3.14159265358979323846264338327950288419716939937510;



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

			var Radius = (req.query.Radius/1000); //radius in km
			var Long = req.query.Longitude * (pi/180);
			var Lat = req.query.Latitude * (pi/180);
			var r = Radius/6371; // angular radius
			var Latmin = Lat - r;
			var Latmax = Lat + r;
			var latT = Math.asin(Math.sin(Lat)/Math.cos(r));
			console.log('latT is calculated: ' + latT);
			var DeltaLong = Math.acos((Math.cos(r)-Math.sin(latT)*Math.sin(Lat))/(Math.cos(latT)*Math.cos(Lat)));
			var LongMax = Long + DeltaLong;
			var LongMin = Long - DeltaLong;
			console.log('Longitude min and max are calculated: ' + LongMin + ': ' + LongMax);

			// Now only checking in a squarish pattern for the messages, the commented part needs to be changed, so it checks in a circle.
			Line.find().where('Latitude').gt(Latmin).lt(Latmax)
				.where('Longitude').gte(LongMin).lte(LongMax)
				.populate('User').exec(function(err, result){
				if(err){
					res.send(err);
				} else {
					/*console.log(result.length);
					var realResult = [];
					for(var i =0 ; i > result.length; i++){
						var item = result[i];
						if(Math.acos(Math.sin(Lat) * Math.sin(item.Latitude) + Math.cos(Lat) * 
							Math.cos(item.Latitude) * Math.cos(item.Longitude - (Long))) * 6371 <= (Radius/1000)){
							realResult.add(item);
						}
					}*/
					
					res.json(result);
				}
			});
		} else {
			Line.find().populate('User').exec(function(err, result){
				res.json(result); // Returns all lines
			});
		}
	})
	.post(function(req, res, next){ //add new line
		var line = new Line(req.body.line);
		line.Body = req.body.Body;
		line.Longitude = req.body.Longitude * (pi/180);
		line.Latitude = req.body.Latitude * (pi/180);
		line.User = req.body.User;
		console.log(line);
		line.save(function(err, line){
			if(err){
				res.send(err);
			} else {
				res.send({msg: "" + line.Body + ": was send."});
			}
		});
	});
	// TODO: Delete toevoegen




// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing lines routing module');
	Line = mongoose.model('Line');
	handleError = errCallback;
	return router;
};