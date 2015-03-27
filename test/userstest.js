var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');

var express = require('express');
var app = express();
require('../models/user')(mongoose);
var users = require('../routes/users')(mongoose, handleError);
app.use('/users', users);

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			console.log("Error: " + err);
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
// Controleren op wachtwoord + salt

describe('Testing users route', function(){
	describe('without params', function(){
		// Tests without params
		it('should return list of users', function(done){
			makeRequest('/users', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('Admin');
				expect(res.body.Admin).to.be.a('Boolean');
				expect(res.body.Admin).to.be.true;
				done();
			});
		});
		it('should return right user', function(done){
			makeRequest('/users', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('UserName');
				expect(res.body.UserName).to.equal(req.params.username);
				done();
			});
		});
		// it('should return location', function(done){
		it('should return location', function(){
			makeRequest('/users', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('RadiusM');
				expect(res.body.RadiusM).to.be.a('Number');
				expect(res.body.Admin).to.be(500);
				done();
			});
		});
	});

	// describe('with params', function(){
	// 	// Tests with params
		
	// });
});