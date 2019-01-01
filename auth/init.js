const logger = require('../util/basic-logger');
const passport = require('passport-restify');
const User = require('../models').User;


module.exports = function() {

  passport.serializeUser(function(user, done) {
    logger.info("serializeUser - ", user);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    logger.info("DEserializeUser - id: ", id);  
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

};