var express = require('express');
var router = express.Router();
var passport;

function load(){
    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('home.handlebars');
    });

    /* GET users page. */
    router.get('/management', function(req, res, next) {
      res.render('users');
    });

    /* GET chat page. */
    router.get('/chat', function(req, res, next) {
      res.render('chat');
    });

    /* GET login page. */
    router.get('/login', function(req, res, next) {
      res.render('login');
    });

    /* POST login page */
    router.post('/login', 
      passport.authenticate('local-login',  {
        successRedirect : '/profile',
        failureRedirect : '/login'
    }));


    /* GET signup page */
    router.get('/signup', function(req, res, next) {
        res.render('signup');
    });

    /* POST signup page */
    router.post('/signup', passport.authenticate('local-signup',  {
        successRedirect : '/profile',
        failureRedirect : '/signup'
    }));

    /* GET profile page*/
    router.get('/profile', isLoggedIn, function(req, res, next) {
        res.render('profile');
    });

    /* LOGOUT */
    router.get('/logout', function(req, res, next) {
        req.logout();
        res.redirect('/');
    });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}




module.exports = function(pass){
  passport = pass;
  load();
  console.log('initializing default routing module');
  return router;
}