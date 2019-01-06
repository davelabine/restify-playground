const logger = require('../util/basic-logger');
const passport = require('passport-restify');
const User = require('../models').User;


module.exports = function() {

  passport.serializeUser(function(user, done) {
    logger.info("serializeUser - ", user);
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    logger.info("DEserializeUser - id: ", id);  
    done(null, {user: '555555'});
    /*
    User.findById(id, function (err, user) {
      done(err, user);
    });
    */
  });

};