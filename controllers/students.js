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

const getAll = async function(req, res, next){
	let err, student;

	[err, student] = await to(Student.findAll());
	  if(err) return next(new errors.UnprocessableEntityError(err.message));
	  if(!student) return next(new errors.NotFoundError());

	res.json({
		message: 'Welcome to student getAll!',
        result: student
    });
    next();
}
module.exports.getAll = getAll;

const getStudent = async function(req, res, next) {
	var err, student;

	[err, student] = await to(Student.findById(req.params.id));
	  if(err) return next(new errors.UnprocessableEntityError(err.message));
	  if(!student) return next(new errors.NotFoundError());

	return student;
}

const get = async function(req, res, next){
	let student = await getStudent(req,res,next);
	  if(!student) return;

	res.json({
		message: 'Welcome to student get!',
        params: req.params.id,
        result: student
    });
    next();
}
module.exports.get = get;

const update = async function (req, res, next) {
	let student = await getStudent(req,res,next);
	  if(!student) return;

	let err;
	student.set(req.body);
  
	[err, student] = await to(student.save());
	  if(err) return next(new errors.UnprocessableEntityError(err.message));

	res.json({
		message: 'Welcome to student put!',
		query: req.query,
		body: req.body,
		student: student
	});
	next();
};
module.exports.update = update;

const remove = async function (req, res, next) {
	let student = await getStudent(req,res,next);
	  if(!student) return;
	
	student.destroy();
	  
	res.json({
		message: 'Welcome to student delete!',
        query: req.query
    });
	next();
};
module.exports.remove = remove;


