const logger = require('../util/basic-logger');

var passportGoogle= require('../auth/google');

const loginFailed = async function(req, res, next){
    logger.info("loginFailed controller - ", req);
    res.send("Go back and register!!");
    next();
}
module.exports.loginFailed = loginFailed;

const login = async function(req, res, next){
    logger.info("login controller - user id: ", req.user.id);
    // Successful authentication
    res.json(req.user);
    next();
}
module.exports.login = login;

const protected = async function(req, res, next){
    logger.info("protected controller - user id: ", req.user.id);
    // Successful authentication
    res.json({meaningofLife: 42});
    res.send("fun!");
    next();
}
module.exports.protected = protected;

module.exports.authGoogleStart = passportGoogle.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' });

module.exports.authGoogle = passportGoogle.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login', failureRedirect: '/api/v1/auth/google/loginFailed' });