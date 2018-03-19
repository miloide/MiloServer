var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

var userController = {};

userController.home = function(req, res) {
  res.render('ide', { user : req.user });
};