const logger = require('../util/basic-logger');

const login = async function(req, res, next){
    res.send("Go back and register!!");
    next();
}
module.exports.login = login;