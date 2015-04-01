var mongoose = require('mongoose');
var Line = mongoose.model('Line');
var User = mongoose.model('User');
var events = require('events');
var bus = require('./bus');

var pi = 3.14159265358979323846264338327950288419716939937510;

module.exports = function(server){

	var io = require('socket.io').listen(server, { log: false});
	var sock;
	console.log('socket.io created.');

	io.on('connection', function(socket){
		sock = socket;
		socket.on('join', function(UserName){

			User.findOne({UserName:UserName}, function(err, user) { 
					if(!err){
						socket.user = user;
						io.sockets.emit('join', socket.user);
						console.log(socket.user.UserName + " joined with " + socket.user.DisplayName + " as name.");
					}
				});
		});

		socket.on('send msg', function(body, userid, lat, lon){
			var line = new Line();
			line.Body = body;
			line.Longitude = lon * (pi/180);
			line.Latitude = lat * (pi/180);
			line.User = userid;
			line.save(function(err, line) { 
				if(!err) { 
					bus.emit('bus chat msg', line._id);
				} 
				else {
					console.log(err);
				}
			});

		});
		
		socket.on('disconnect', function(){
			var message = "An user disconnected";
			console.log(message);
			io.sockets.emit("disconnect", message);
		});
	});

	bus.on('bus chat msg', function(lineId){
		Line.findById(lineId).populate('User').exec(function(err, result){
			if(!err) {
				io.sockets.emit('msg', result);
				console.log('Message from ' + result.User.DisplayName + ': ' + result.Body);
			}
		});		
	});
}