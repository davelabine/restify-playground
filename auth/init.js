const logger = require('../util/basic-logger');
const passport = require('passport-restify');
const User = require('../models').User;

module.exports = function() {

  passport.serializeUser(function(user, done) {
    let serializedUser = user.get({plain: true})
    logger.info("serializeUser - ", serializedUser);
    done(null, serializedUser);
  });

  passport.deserializeUser(function(data, done) {
    logger.info("DEserializeUser - ", data);
    if (!data.id) {
        let error = "passport cannot deserialize user - no id defined!";
        logger.error(error);
        done(error);
    }
    try {
        User.findByPk(data.id)
        .then(user => {
          logger.info("findByPk pulled - ", user.get({plain: true}));
          done(null, user);
        });
    } catch (e) {
        logger.error(e);
    }
  });

};