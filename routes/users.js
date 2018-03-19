var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcrypt');

router.get('/register', function(req, res){
  res.render('register');
});

router.get('/login', function(req, res){
  res.render('login');
});

router.post('/register', function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  console.log(name, username);
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if(errors){
    res.render('register');
  }  else {
    User.register(new User({ 
          username: username,
          email: email,
          name: name,
      }),
      password, function(err, account) {
        if (err) {
          
          return res.status(500).json({
            err: err
          });
        }
        passport.authenticate('local')(req, res, function () {
          return res.redirect('/');
        });
    });
  }
});

router.post('/login',passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function getSaltedHash(plaintext){
  var passwordHash;
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(plaintext, salt, function(err, hash) {
          passwordHash = hash;
      });
  });
  return passwordHash;
}


router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

module.exports = router;
