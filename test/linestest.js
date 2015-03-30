var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');

var express = require('express');
var app = express();
require('../models/line')(mongoose);
require('../models/user')(mongoose);
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

function makePostRequest(route, data){ 
    request(app)
      .post(route)
      .send(data)
      .expect(200);
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
			// Should return statuscode 200 tests
			describe('normal tests', function(){
				it('should add message', function(){
					var Line = mongoose.model('Line');
					var line = new Line();

					line.Body = "Dit is een bericht";
					line.Longitude = 51.5649986;
					line.Latitude = 5.0671802;

					var User = mongoose.model('User');
					var user = User();

					User.findOne({ 'UserName': 'Admin' }, 'name occupation', function (err, userVal) {
						if (err) return handleError(err);
						user = userVal;
					});

					line.User = user;

					makePostRequest('/lines', line, function() {
						done();
					});
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