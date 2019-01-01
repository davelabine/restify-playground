const logger = require('../util/basic-logger');

var passportGoogle= require('../auth/google');

const login = async function(req, res, next){
    logger.info("login controller - ", req);
    res.send("Go back and register!!");
    next();
}
module.exports.login = login;

module.exports.authGoogle = passportGoogle.authenticate('google',{scope: 'https://www.googleapis.com/auth/plus.login'});

module.exports.authGoogleCallback = 
    passportGoogle.authenticate('google', { failureRedirect: '/login' },
    function(req, res) {
        // Successful authentication
        logger.info("google auth callback - ", req.user);
        res.json(req.user);
    });
/*
const authGoogleCallback = async function (r)
router.get('/auth/linkedin/callback',
  passportLinkedIn.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    res.json(req.user);
  });
*/