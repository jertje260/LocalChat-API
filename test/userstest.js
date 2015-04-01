var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('../models/user')(mongoose);
var users = require('../routes/users')(mongoose, handleError);
app.use('/users', users);

var User = mongoose.model('User');

function makeGetRequest(route, statusCode, done) {
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

function makePostRequest(route, statusCode, data, done) {
    request(app)
		.post(route)
		.send(data)
		.expect(statusCode)
		.end(function(err, res) {
			if (err) { return err; }

			done(null, res);
		});
};

function makePutRequest(route, statusCode, data, done) {
	request(app)
		.put(route)
		.send(data)
		.expect('Content-Type', /json/)
		.expect(statusCode) //Status code
		.end(function(err,res) {
			if (err) { return err; }

			done(null, res);
		});
};

function makeDeleteRequest(route, done) {
	request(app)
		.delete(route)
        .end(function(err, res) {
            if (err) { return err; }

            done(null, res);
        });
}

function handleError(req, res, statusCode, message) {
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);
    res.json(message);
};

describe('Testing users route', function() {
	describe('GET', function() {
		// Tests without params
		describe('without params', function() {
			// Should return statuscode 200 tests
			describe('normal tests', function() {
				it('should return list of users', function() {
					makeGetRequest('/users', 200, function(err, res) {
						if(err){ return done(err); }

						expect(res.body).to.have.property('Admin');
						expect(res.body.Admin).to.be.a('Boolean');
						expect(res.body.Admin).to.be.true;

						done();
					});
				});
			});
		});
		// Tests with params
		describe('with params', function() {
			// Should return statuscode 200 tests
			describe('normal tests', function() {
				it('should return logged in user', function() {
					makeGetRequest('/users/Admin', 200, function(err, res) {
						if(err){ return done(err); }
		
						user = new User();
						user.UserName = res.body.UserName;
						user.DisplayName = res.body.DisplayName;
						user.HashedPass = res.body.HashedPass;
						user.Salt = res.body.Salt;
						user.Role = res.body.Role;

						var password = user.get('password');

						expect(user).to.have.property('UserName');
						expect(user.UserName).to.be.a('String');
						expect(user.UserName).to.be(res.params.UserName);

						expect(password).to.be.a('String');
						expect(password).to.be('admin');

						expect(user).to.have.property('DisplayName');
						expect(user.DisplayName).to.be.a('String');
						expect(user.DisplayName).to.be('Admin');

						expect(user).to.have.property('Salt');
						expect(user.Salt).to.be.a('String');
						expect(user.Salt).to.not.be.undefined;

						expect(user).to.have.property('HashedPass');
						expect(user.HashedPass).to.be.a('String');
						var hash = crypto.createHmac('sha1', user.Salt).update(password).digest('hex');
						expect(user.HashedPass).to.be(hash);

						expect(user).to.have.property('Role');
						expect(user.Role).to.be.a('String');
						expect(user.Role).to.be('Admin');

						done();
					});
				});
			});
		});
	});
	describe('POST', function() {
		// Tests without params
		describe('without params', function() {
			// Should return statuscode 200 tests
			describe('normal tests', function() {
				it('should add user', function() {

					var data = { UserName : "Sam", DisplayName : "Sam", password : "Test" };

					// console.log(data);
					makePostRequest('/users', 200, data, function(err, res) {
						console.log(res);
						if(err){ return done(err); }
						// Should.js fluent syntax applied
						expect(res.body).should.have.property('DisplayName');
						expect(res.body.DisplayName).to.be('Admin');

						var password = data.get('password');

						expect(password).to.be.a('String');
						expect(password).to.be('Test');

						expect(res.body).should.have.property('Role');
						expect(res.body.Role).to.be('User');

						expect(res.body).should.have.property('RadiusM');
						expect(res.body.RadiusM).to.be(500);

						done();
					});
				});
			});
		});
	});
	describe('PUT', function() {
		// Tests with params
		describe('with params', function() {
			// Should return statuscode 200 tests
			describe('normal tests', function() {
				it('should update user', function() {
					var user = { DisplayName : "Admin", "password" : "Test" }

					makePutRequest('/users/Sam', 200, user, function(err, res) {
						if(err){ return done(err); }
						// Should.js fluent syntax applied
						expect(res.body).should.have.property('DisplayName');
						expect(res.body.DisplayName).to.be('Admin');

						var password = user.get('password');

						expect(password).to.be.a('String');
						expect(password).to.be('Test');

						expect(res.body).should.have.property('Role');
						expect(res.body.Role).to.be('User');

						expect(res.body).should.have.property('RadiusM');
						expect(res.body.RadiusM).to.be(500);

						done();
					});
				});
			});
		});
	});
	describe('DELETE', function() {
		// Tests with params
		describe('with params', function() {
			// Should return statuscode 200 tests
			describe('normal tests', function() {
				it('should add user', function() {
					makeDeleteRequest('/users/Sam', function(err, res) {
						if(err){ return done(err); }
						user = User.findOne({UserName:req.params.UserName}, function(err, user) { return user; });

						done();
					});
				});
			});
		});
	});
});