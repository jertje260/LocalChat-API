var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var lines = require('../routes/lines');
app.use('/', lines);

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
		it('should return location', function(){
			makeRequest('/lines', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('Longitude');
				expect(res.body.Longitude).to.not.be.undefined;

				expect(res.body).to.have.property('Latitude');
				expect(res.body.Latitude).to.not.be.undefined;
				
				done();
			});
		});
		it('should return messages of specific radius', function(){
			makeRequest('/lines', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('Longitude');
				expect(res.body.Longitude).to.not.be.undefined;

				expect(res.body).to.have.property('Latitude');
				expect(res.body.Latitude).to.not.be.undefined;

				expect(res.body.User).to.have.property('RadiusM');
				expect(res.body.User.RadiusM).to.not.be.undefined;

				expect(res.body.User).to.have.
				done();
			});
		});
	});

	describe('with params', function(){
		// Tests with params
		it('should return messages of all users', function(){
			makeRequest('/lines', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('Admin');
				expect(res.body.Admin).to.be.a('Boolean');
				expect(res.body.Admin).to.equal(true);
				done();
			});
		});
		it('should return messages of user', function(){
			makeRequest('/lines/username', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('User');
				expect(res.body.User).to.have.property('UserName');
				expect(res.body.User.UserName).to.equal('Test'); // Change 'Test' to an UserName from the database
				done();
			});
		});
	});
});