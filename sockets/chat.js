module.exports = function(server){
	var mongoose = require('mongoose');
	var Line = mongoose.model('Line');
	var User = mongoose.model('User');
	var events = require('events');
	var bus = require('./bus');
	var io = require('socket.io').listen(server, { log: false});
	console.log('socket.io created.');

	io.on('connection', function(socket){
		bus.on('bus chat msg', function(msg, date, DisplayName){ 
			console.log(DisplayName + " send at: " + date + " message: " + msg);
			socket.emit('chat msg', { "msg" : msg, "date" : Date.now(), "DisplayName" : DisplayName})
		});

	
		socket.on('join', function(person){
			User
			socket.UserName = person.UserName;
			socket.DisplayName = person.DisplayName;
			io.emit('msg' , person.UserName + " joined the room with " + person.DisplayName + " as name.");
			console.log(socket.UserName + " joined the room with " + person.DisplayName + " as name.");
		});
		
		socket.on('disconnect', function(){
			socket.leave();
			io.emit("admin msg", socket.UserName + " just left.");
		});
	});

	
	return io;
}