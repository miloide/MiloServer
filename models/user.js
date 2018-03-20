var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  token: {
    type: String,
    required: false
  },
  googleID: {
    type: String,
    required: false,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
},{collection: 'UserAuth'});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

