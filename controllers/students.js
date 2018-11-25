const logger = require('../basic-logger');
const Student = require('../models').Student;
const errors = require('restify-errors');     
const { to, TE }  = require('../services/util');  

const create = async function (req, res, next) {
    let err, student;
	
	[err, student] = await to(Student.create(req.body));
      if(err) return next(new errors.UnprocessableEntityError(err.message));

	res.statusCode = 201; // created
	res.json({
		message: 'Student created!',
        result: student
    });

	return next();
};
module.exports.create = create;

const get = async function(req, res, next){
	let err, student;
	let id = req.query.id;

	[err, student] = await to(Student.findAll({
		where: {
		  id: id
		}
	}));
	  if(err) return next(new errors.ServiceUnavailableError(err.message));

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


