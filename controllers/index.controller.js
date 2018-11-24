const logger = require('../basic-logger');
const Student = require('./../models').Student;

const getAll = async function(req, res, next){
    let student = await Student.findOne();
    logger.info(student);

	res.json({
		message: 'Welcome to API getAll!',
        query: req.query,
        result: student
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