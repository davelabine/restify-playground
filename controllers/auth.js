const logger = require('../util/basic-logger');

var passportGoogle= require('../auth/google');

const loginFailed = async function(req, res, next){
    logger.info("loginFailed controller - ", req);
    res.send("Go back and register!!");
    next();
}
module.exports.loginFailed = loginFailed;

const login = async function(req, res, next){
    logger.info("login controller - ", req.user);
    // Successful authentication
    res.json(req.user);
    next();
}
module.exports.login = login;

module.exports.authGoogle = passportGoogle.authenticate('google',{scope: 'https://www.googleapis.com/auth/plus.login'});

module.exports.authGoogleCallback = passportGoogle.authenticate('google', { failureRedirect: '/api/v1/auth/google/loginFailed' });