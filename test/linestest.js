var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');

var express = require('express');
var app = express();
require('../models/line')(mongoose);
var lines = require('../routes/lines')(mongoose, handleError);
app.use('/lines', lines);

function makeGetRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

function makePostRequest(route, statusCode, done){
	request(app)
		.post(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

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
	describe('GET', function(){
		// Tests without params
		describe('without params', function(){
			describe('error tests', function(){
				// Should not return statuscode 200 tests
				// it('should return 404 when line is used as route', function(done){
				// 	makeGetRequest('/line', 404, done);
				// });
			});
			describe('normal tests', function(){
				// Should return statuscode 200 tests
				it('should return an array', function(){
					makeGetRequest('/lines', 200, function(err, res){
						if(err){ return done(err); }

						expect(res.body).should.be.an.instanceOf(Array);
						expect(res.body).to.not.be.undefined;

						done();
					});
				});
				it('should return messages of all users', function(){
					makeGetRequest('/lines', 200, function(err, res){
						if(err){ return done(err); }

						expect(res.body).to.have.property('User');

						expect(res.body.User).to.have.property('Role');
						expect(res.body.User.Role).to.equal('Admin');

						done();
					});
				});
				it('should return lines', function(){
					makeGetRequest('/lines', 200, function(err, res){
						if(err){ return done(err); }
						expect(res.body).should.be.an.instanceOf(Array);

						$.each(res.body, function(index, value) {
							 expect(value).to.have.property('Body');
							 expect(value).to.not.have.property('RadiusM');
						});

						done();
					});
				});
				it('should return message', function(){
					makeGetRequest('/lines', 200, function(err, res){
						if(err){ return done(err); }
						expect(res.body).should.be.an.instanceOf(Array);

						$.each(res.body, function(index, value) {
							 expect(value).to.have.property('Body');
							 expect(value).to.not.be.undefined;
						});

						done();
					});
				});
			});
		});
	});
	describe('POST', function(){
		// Tests without params
		describe('without params', function(){
			// Should not return statuscode 200 tests
			describe('error tests', function(){	
				
			});
			// Should return statuscode 200 tests
			describe('normal tests', function(){
				makePostRequest('/lines', 200, function(err, res){
					if(err){ return done(err); }

					var Line = mongoose.model('Line');
					var line = new Line();

					done();
				});
			});
		});
		// Tests with params
		describe('with params', function(){
			// Should not return statuscode 200 tests
			describe('error tests', function(){
				
			});
			// Should return statuscode 200 tests
			describe('normal tests', function(){
				
			});
		});
	});
});