module.exports = {
	getLines: function(Line, req, res) {
		if(req.query.Latitude != undefined && req.query.Longitude != undefined && req.query.Radius != undefined) {
			// Magic calculation for circle
			var pi = 3.14159265358979323846264338327950288419716939937510,
				Radius = (req.query.Radius/1000) /* radius in km */, Long = req.query.Longitude * (pi/180),
				Lat = req.query.Latitude * (pi/180), r = Radius/6371 /* angular radius */,
				Latmin = Lat - r, Latmax = Lat + r, latT = Math.asin(Math.sin(Lat)/Math.cos(r)),
				DeltaLong = Math.acos((Math.cos(r)-Math.sin(latT)*Math.sin(Lat))/(Math.cos(latT)*Math.cos(Lat))),
				LongMax = Long + DeltaLong, LongMin = Long - DeltaLong;

			Line.find().where('Latitude').gt(Latmin).lt(Latmax)
				.where('Longitude').gte(LongMin).lte(LongMax)
				.populate('User').exec(function(err, result){
				if(err) { res.send(err); } else { res.json(result); }
			});
		} else {
			Line.find().populate('User').exec(function(err, result) { res.json(result); });
		}
	},
	postLine: function(User, req, res) {
		var line = new Line({
			Body: req.body.Body,
			Longitude: req.body.Longitude * (pi/180),
			Latitude: req.body.Latitude * (pi/180),
			User: req.body.User
		});
		
		line.save(function(err, line) { if(err) { res.send(err); } else { res.send({ msg: "" + line.Body + ": was send." }); } });
	}
};
