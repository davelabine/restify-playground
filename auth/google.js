const logger = require('../util/basic-logger');
const passport = require('passport-restify');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models').User;
const { to } = require('../util/util');  
const init = require('./init');

// newlines sneaking into these values, so trim()
const clientID = process.env.GOOGLE_CLIENT_ID.trim();
const clientSecret = process.env.GOOGLE_CLIENT_SECRET.trim();


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:8080/api/v1/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    logger.info("GoogleStrategy callback! - ", profile.id);
    
    let err, user;
    try {
        User
          .findOrCreate({ where: { googleId: profile.id }, defaults: { name: profile.displayName } })
          .spread((user, created) => {
              logger.info("User findOrCreate -  id: %s, name: %s, googleId: %s, created: %s ", 
                user.id, user.name, user.googleId, created);
              done(null, user);
          });
    } catch (error) {
        logger.error(error);
        done(error);
    }
  }
));

// serializes the user into the session
init();

module.exports = passport;