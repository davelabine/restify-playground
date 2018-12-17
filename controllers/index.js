const logger = require('../util/basic-logger');

const getAll = async function(req, res, next){
	res.json({
		message: 'Welcome to API getAll!',
        query: req.query
    });
    next();
}
module.exports.getAll = getAll;

const get = async function (req, res, next) {
	res.json({
		message: `Welcome to API get, ${req.params.name}!`,
		query: req.query
	});
	next();
};
module.exports.get = get;

const post = async function (req, res, next) {
	res.json({
		message: `Welcome to API post, ${req.body.name}!`,
		query: req.query
	});
	next();
};
module.exports.post = post;