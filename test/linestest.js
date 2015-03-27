var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');

var express = require('express');
var app = express();
require('../models/line')(mongoose);
var lines = require('../routes/lines')(mongoose, handleError);
app.use('/lines', lines);

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }
			console.log(res);
			done(null, res);
		});
};

function handleError(req, res, statusCode, message){
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);
    res.json(message);
};

// ----- Wat moet er getest worden -----
// Een user ingelogd is als admin
// Welke berichten moeten worden weergegeven(d.m.v. radius en longitude en latitude)


describe('Testing lines route', function(){
	describe('without params', function(){
		// Tests without params
		it('should return an array', function(done){
			makeRequest('/lines', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).should.be.an.instanceOf(Array);
				expect(res.body).to.not.be.undefined;

				done();
			});
		});

		it('should return messages of all users', function(done){
			makeRequest('/lines', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('User');

				expect(res.body.User).to.have.property('Role');
				expect(res.body.User.Role).to.equal('Admin');

				done();
			});
		});

		it('should return lines', function(done){
			makeRequest('/lines', 200, function(err, res){
				if(err){ return done(err); }
				expect(res.body).should.be.an.instanceOf(Array);

				$.each(res.body, function(index, value) {
					 expect(value).to.have.property('Body');
					 expect(value).to.not.have.property('RadiusM');
				});

				done();
			});
		});

		// Body: {type: String, required: true},
		// User: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		// Longitude: {type: Number, required: true}, //in radians
		// Latitude: {type: Number, required: true}, //in radians
		// Datetime: {type: Date, default: Date.now}
	});

	describe('with params', function(){
		// Tests with params
		// it('should return messages of user', function(done){
		// 	makeRequest('/lines/username', 200, function(err, res){
		// 		if(err){ return done(err); }

		// 		expect(res.body).to.have.property('User');

		// 		expect(res.body.User).to.have.property('Role');
		// 		expect(res.body.User.Role).to.equal('User');

		// 		expect(res.body.User).to.have.property('UserName');
		// 		expect(res.body.User.UserName).to.equal(req.params.username);
		// 		done();
		// 	});
		// });
	});
});