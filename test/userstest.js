var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var users = require('../routes/users');
app.use('/', users);

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

describe('Testing localchat route', function(){
	describe('without params', function(){
		// Tests without params
		it('should return list of users', function(){
			makeRequest('/', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('Admin');
				expect(res.body.Admin).to.be.a('Boolean');
				expect(res.body.Admin).to.equal(true);
				done();
			});
		});
		it('should return location', function(){
			makeRequest('/lines', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('Longitude');
				expect(res.body.User.Longitude).to.not.be.undefined;

				expect(res.body).to.have.property('Latitude');
				expect(res.body.User.Latitude).to.not.be.undefined;
				
				done();
			});
		});
	});

	describe('with params', function(){
		// Tests with params
		
	});
});