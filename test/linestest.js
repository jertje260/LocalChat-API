var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');

var app = require('express')();
var lines = require('../routes/lines');

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

// ----- Wat moet er getest worden -----
// Een user ingelogd is als admin
// Welke berichten moeten worden weergegeven(d.m.v. radius en longitude en latitude)


describe('Testing lines route', function(){
	describe('without params', function(){
		// Tests without params
		it('should return an array', function(){
			makeRequest('/lines', 200, function(err, res){
				console.log(err);
				if(err){ return done(err); }

				expect(res.body).should.be.an.instanceOf(Array);

				done();
			});
		});

		it('should return messages of all users', function(){
			makeRequest('/lines', 200, function(err, res){
				console.log(err);
				if(err){ return done(err); }

				expect(res.body).to.have.property('User');

				expect(res.body.User).to.have.property('Role');
				expect(res.body.User.Role).to.equal('Admin');
				done();
			});
		});

		it('should return lines', function(){
			makeRequest('/lines', 200, function(err, res){
				console.log(err);
				if(err){ return done(err); }
				
				expect(res.body).should.be.an.instanceOf(Array);

				$.each(res.body, function(index, value) {
					expect(value).to.have.property('Body');
					expect(value).to.have.property('RadiusM');
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
		it('should return messages of user', function(){
			makeRequest('/lines/username', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('User');

				expect(res.body.User).to.have.property('Role');
				expect(res.body.User.Role).to.equal('User');

				expect(res.body.User).to.have.property('UserName');
				expect(res.body.User.UserName).to.equal(req.params.username);
				done();
			});
		});
	});
});