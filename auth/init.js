const logger = require('../util/basic-logger');
const passport = require('passport-restify');
const User = require('../models').User;

module.exports = function() {

  passport.serializeUser(function(user, done) {
    let serializedUser = user.get({plain: true})
    logger.info("serializeUser id - ", serializedUser.id);
    done(null, serializedUser);
  });

  passport.deserializeUser(function(data, done) {
    if (!data.id) {
        let error = "passport cannot deserialize user - no id defined!";
        logger.error(error);
        done(error);
    }
    logger.info("DEserializeUser - ", data.id);
    try {
        User.findByPk(data.id)
        .then(user => {
          logger.info("findByPk pulled user id: ", user.id);
          done(null, user);
        });
    } catch (e) {
        logger.error(e);
    }
  });

};