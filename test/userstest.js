var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');

var app = require('express')();
var users = require('../routes/users');

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

describe('Testing users route', function(){
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
	});

	// describe('with params', function(){
	// 	// Tests with params
		
	// });
});