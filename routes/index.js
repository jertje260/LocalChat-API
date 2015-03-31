var express = require('express');
var router = express.Router();
var passport;

function load(){
    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('home');
    });

    /* GET users page. */
    router.get('/management', isLoggedIn, isAdmin, function(req, res, next) {
      res.render('users', {user : req.user});
    });

    /* GET chat page. */
    router.get('/chat', isLoggedIn, function(req, res, next) {
      res.render('chat' , {user : req.user});
    });

    /* GET login page. */
    router.get('/login', function(req, res, next) {
        res.render('login' , { message: req.flash('loginMessage')});

    });

    /* POST login page */
    router.post('/login', 
      passport.authenticate('local-login',  {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash: true
    }));


    /* GET signup page */
    router.get('/signup', function(req, res, next) {
        res.render('signup', { message: req.flash('signupMessage') });
    });

    /* POST signup page */
    router.post('/signup', passport.authenticate('local-signup',  {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash: true
    }));

    /* GET profile page*/
    router.get('/profile', isLoggedIn, function(req, res, next) {
        res.render('profile', {user : req.user});
    });


    /* LOGOUT */
    router.get('/logout', function(req, res, next) {
        req.logout();
        res.redirect('/');
    });

        // route middleware to make sure a user is logged in
        function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        req.flash('loginMessage', 'You are not logged in!');
        res.redirect('/login');
}
    function isAdmin(req, res, next) {
        if (req.user && req.user.Role === 'Admin'){
          return next();
      }
        else    
            req.flash('loginMessage' , 'You are not authorized to access that page!')
            res.redirect('/login');
      }
    
}






module.exports = function(pass){
  passport = pass;
  load();
  console.log('initializing default routing module');
  return router;
}