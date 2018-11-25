const {to} = require('await-to-js');
const pe = require('parse-error');
const logger = require('../basic-logger');

// Why?
// https://medium.com/front-end-hacking/error-handling-in-node-javascript-suck-unless-you-know-this-2018-aa0a14cfdd9d
module.exports.to = async (promise) => {
    let err, res;
    [err, res] = await to(promise);
    if(err) return [pe(err)];

    return [null, res];
};

module.exports.TE = TE = function(err_message, log){ // TE stands for Throw Error
    if(log === true){
        logger.error(err_message);
    }

    throw new Error(err_message);
};