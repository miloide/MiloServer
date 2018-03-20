var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var configAuth = require('./credentials');
var LocalStrategy = require('passport-local').Strategy;
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development';

module.exports = function(passport){
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : NODE_ENV=='development'? configAuth.googleAuth.devCallback:configAuth.googleAuth.prodCallback,
    },
    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            User.findOne({'googleID' : profile.id}, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.googleID    = profile.id;
                    newUser.name = profile.displayName;
                    newUser.token = token;
                    newUser.email = profile.emails[0].value; // pull the first email
                    newUser.username  = newUser.email;
                    if (configAuth.googleAuth.whiteList != undefined) {
                        if (configAuth.googleAuth.whiteList[newUser.email]==undefined){
                            return done(null,false);
                        }
                    }

                    // save the user
                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });

    }));
};
