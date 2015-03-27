var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');

var express = require('express');
var app = express();
var users = require('../routes/users');
app.use('/users', users);

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
// Controleren op wachtwoord + salt

describe('Testing users route', function(){
	describe('without params', function(){
		// Tests without params
		it('should return list of users', function(){
			makeRequest('/users', 200, function(err, res){
				console.log(err);
				if(err){ return done(err); }

				expect(res.body).to.have.property('Admin');
				expect(res.body.Admin).to.be.a('Boolean');
				expect(res.body.Admin).to.be.true;
				done();
			});
		});
		it('should return right password of user');
		it('should return location');
	});

	// describe('with params', function(){
	// 	// Tests with params
		
	// });
});