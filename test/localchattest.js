var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var calendar = require('../routes/calendar');
app.use('/', calendar);

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
			makeRequest('/users', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('Admin');
				expect(res.body.Admin).to.be.a('Boolean');
				expect(res.body.Admin).to.equal(true);
				done();
			});
		});
	});
	describe('with params', function(){
		// Tests with params
		it('should return messages of all users', function(){
			makeRequest('/lines', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body.Admin).to.be.a('Boolean');
				expect(res.body.Admin).to.equal(true);
				done();
			});
		});
		it('should return messages of user', function(){
			makeRequest('/lines/username', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('User');
				expect(res.body.User)
				expect(res.body.admin).to.be.a('Boolean');
				expect(res.body.admin).to.equal(true);
				done();
			});
		});
	});
});

// describe('Testing calendar route', function(){
// 	describe('without params', function(){
// 		it('should return todays date', function(done){
// 			var today = new Date();
// 			var expectedString = 
// 				(today.getDate < 10 ? '0' : '') + 
// 				today.getDate() + '-' + 
// 				(today.getMonth() + 1 < 10 ? '0' : '') + 
// 				(today.getMonth() + 1) + '-' + 
// 				today.getFullYear();

// 			makeRequest('/', 200, function(err, res){
// 				if(err){ return done(err); }

// 				expect(res.body).to.have.property('date');
// 				expect(res.body.date).to.not.be.undefined;
// 				expect(res.body.date).to.equal(expectedString);
// 				done();
// 			});
// 		});
// 	});

// 	describe('with invalid params', function(){
// 		it('should return 400 when date is invalid', function(done){
// 			makeRequest('/35/2/2000', 400, done);
// 		});

// 		it('should return 400 when date is not numeric', function(done){
// 			makeRequest('/test/me/now', 400, done);
// 		});
// 	});

// 	describe('with valid params', function(){
// 		it('should return the right date', function(done){
// 			makeRequest('/10/3/2015', 200, function(err, res){
// 				if(err){ return done(err); }

// 				expect(res.body.date).to.not.be.undefined;
// 				expect(res.body.date).to.equal('10-03-2015');
// 				done();
// 			});
// 		});

// 		it('should return the right day name', function(done){
// 			makeRequest('/10/3/2015', 200, function(err, res){
// 				if(err){ return done(err); }

// 				expect(res.body.dayNameNL).to.not.be.undefined;
// 				expect(res.body.dayNameNL).to.equal('Dinsdag');
// 				done();
// 			});
// 		});

// 		it('should return no holiday when on a normal day', function(done){
// 			makeRequest('/10/3/2015', 200, function(err, res){
// 				if(err){ return done(err); }

// 				expect(res.body.isHolidayNL).to.be.a('Boolean');
// 				expect(res.body.isHolidayNL).to.be.false;
// 				expect(res.body.holidayNameNL).to.be.undefined;
// 				done();
// 			});
// 		});
// 	});

// 	describe('on special days', function(){
// 		it('should return Nieuwjaarsdag on 01-01-2014', function(done){
// 			makeRequest('/01/01/2014', 200, function(err, res){
// 				if(err){ return done(err); }

// 				expect(res.body.holidayNameNL).to.not.be.undefined;
// 				expect(res.body.holidayNameNL).to.equal('Nieuwjaarsdag');
// 				done();
// 			});
// 		});
// 		it('should return Koningsdag on 26-04-2015', function(done){
// 			makeRequest('/26/04/2015', 200, function(err, res){
// 				if(err){ return done(err); }
// 				expect(res.body.holidayNameNL).to.not.be.undefined;
// 				expect(res.body.holidayNameNL).to.equal('Koningsdag');
// 				done();
// 			});
// 		});
// 		it('should not return Koningsdag on 27-04-2014', function(done){
// 			makeRequest('/27/04/2014', 200, function(err, res){
// 				if(err){ return done(err); }

// 				expect(res.body.holidayNameNL).to.be.undefined;
// 				done();
// 			});
// 		});
// 		it('should return Koninginnedag on 29-04-2006', function(done){
// 			makeRequest('/29/04/2006', 200, function(err, res){
// 				if(err){ return done(err); }
// 				expect(res.body.holidayNameNL).to.not.be.undefined;
// 				expect(res.body.holidayNameNL).to.equal('Koninginnedag');
// 				done();
// 			});
// 		});
// 		it('should not return Koninginnedag on 30-04-2006', function(done){
// 			makeRequest('/30/04/2006', 200, function(err, res){
// 				if(err){ return done(err); }

// 				expect(res.body.holidayNameNL).to.be.undefined;
// 				done();
// 			});
// 		});
// 		it('should return Bevrijdingsdag on 05-05-2020');
// 		it('should not return Bevrijdingsdag on 05-05-2016', function(done){
// 			makeRequest('/05/05/2016', 200, function(err, res){
// 				if(err){ return done(err); }

// 				expect(res.body.holidayNameNL).to.be.undefined;
// 				done();
// 			});
// 		});
// 		it('should return Eerste Kerstdag on 25-12-2016');
// 		it('should return Tweede Kerstdag on 26-12-2016');
// 		it('should return Eerste Paasdag on 05-04-2015');
// 		it('should return Tweede Paasdag on 02-04-2018');
// 		it('should return Hemelvaartsdag on 18-05-2023');
// 		it('should return Eerste pinksterdag on 09-06-2019');
// 		it('should return Tweede pinksterdag on 05-06-2017');
// 	})
// });