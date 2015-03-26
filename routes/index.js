var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('/views/index.handlebars');
});

/* GET users page. */
router.get('/UserManaging', function(req, res, next) {
  res.render('users');
});

/* GET chat page. */
router.get('/Chat', function(req, res, next) {
  res.render('chat');
});

module.exports = router;
