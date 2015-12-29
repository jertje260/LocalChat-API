var mongoose = require('mongoose');
var Line = mongoose.model('Line');
var User = mongoose.model('User');
var Location = mongoose.model('Location');
var events = require('events');
var bus = require('./bus');

var users = require('../routes/users');

var pi = 3.14159265358979323846264338327950288419716939937510;

module.exports = function(server){

	var io = require('socket.io').listen(server, { log: false});
	var sock;
	console.log('socket.io created.');

	io.on('connection', function(socket){
		sock = socket;
		socket.on('join', function(UserName){

			User.findOne({UserName:UserName}, function(err, user) { 
					if(!err && user != null){
						socket.user = user;
						io.sockets.emit('join', socket.user);
						console.log(socket.user.UserName + " joined with " + socket.user.DisplayName + " as name.");
					}
				});
		});

		socket.on('send msg', function(body, userid, lon, lat){
			var location = new Location();
			location.Longitude = lon * (pi/180);
			location.Latitude = lat * (pi/180);

			location.save(function(err, line) {
				if (err) { console.log(err); }
			});

			var line = new Line();
			line.Body = body;
			line.User = userid;
			line.Location = location._id;

			User.findById(userid).populate('Location').exec(function(err, result){
				if(!err) {
					console.log(result);
					console.log('Message from ' + result.User.DisplayName + ': ' + result.Body);
				}
			});

			line.save(function(err, line) { 
				if(!err) { 
					bus.emit('bus chat msg', line._id);
				} else {
					console.log(err);
				}
			});
		});
		
		socket.on('disconnect', function(){
			if(socket.user != null){
				console.log(socket.user.UserName + " disconnected.");
				io.sockets.emit("disconnect", socket.user);
			}
		});

		socket.on('get location', function(lon, lat, callback) {
			var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lon + "&rankby=distance&types=cafe&types=bar&types=restaurant&key=AIzaSyBNDnIEOA-fojCBMtgMRISNzJyG3NAIOew";

	        https.get(url,function(response){
	            var data = '';
	            response.on('data',function(d){
	                data += d;
	            });
	            response.on('end',function(){
	                try {
	                    data = JSON.parse(data);
	                } catch (err) {
	                    return handleError(req, res, 500, err); 
	                }
	                console.log(data);
	                callback(data.results[0]);
	            });
	        });
		});
	});

	bus.on('bus chat msg', function(lineId){
		Line.findById(lineId).populate('User').populate('Location').exec(function(err, result){
			if(!err) {
				console.log(result);
				io.sockets.emit('msg', result);
				console.log('Message from ' + result.User.DisplayName + ': ' + result.Body);
			}
		});
	});
}