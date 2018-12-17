const {to} = require('await-to-js');
const pe = require('parse-error');
const logger = require('./basic-logger');

// Why?
// https://medium.com/front-end-hacking/error-handling-in-node-javascript-suck-unless-you-know-this-2018-aa0a14cfdd9d
module.exports.to = async (promise) => {
    let err, res;
    [err, res] = await to(promise);
    if(err) return [pe(err)];

    return [null, res];
};

module.exports.ReS = function(req, res, data, code){ // Success Web Response
    let send_data = {
		request_query: req.query,
		request_body: req.body
	};

    if(typeof data == 'object'){
        send_data = Object.assign(data, send_data);//merge the objects
    }

    if(typeof code !== 'undefined') res.statusCode = code;

    return res.json(send_data);
};

module.exports.TE = TE = function(err_message, log){ // TE stands for Throw Error
    if(log === true){
        logger.error(err_message);
    }

    throw new Error(err_message);
};