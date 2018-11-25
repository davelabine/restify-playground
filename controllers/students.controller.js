const logger = require('../basic-logger');
const Student = require('./../models').Student;       

const create = async function (req, res, next) {
	res.json({
		message: 'Welcome to student create!',
		query: req.query,
		body: req.body
	});
	next();
};
module.exports.create = create;

const get = async function(req, res, next){
    let student = await Student.findOne();
    logger.info(student);

	res.json({
		message: 'Welcome to student get!',
        query: req.query,
        result: student
    });
    next();
}
module.exports.get = get;

const update = async function (req, res, next) {
	res.json({
		message: 'Welcome to student put!',
		query: req.query,
		body: req.body
	});
	next();
};
module.exports.update = update;

const remove = async function (req, res, next) {
	/*
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if(err) return ReE(res, 'error occured trying to delete user');

	return ReS(res, {message:'Deleted User'}, 204);
	*/
	res.json({
		message: 'Welcome to student delete!',
        query: req.query
    });
	next();
};
module.exports.remove = remove;


