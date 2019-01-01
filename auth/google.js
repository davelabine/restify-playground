const logger = require('../util/basic-logger');
const passport = require('passport-restify');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models').User;
const init = require('./init');

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       logger.info("GoogleStrategy callback! - ", profile);
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

// serializes the user into the session
init();

module.exports = passport;