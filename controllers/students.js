const path = require('path');
const logger = require('../util/basic-logger');
const Student = require('../models').Student;
const BlobClient = require('../util/blobclient');
const blobClient = BlobClient();
const errors = require('restify-errors');     
const { to, TE, ReS }  = require('../util/util');  

const create = async function (req, res, next) {
	let err, student;
	
	let photoUrl = '';
	const fileKey = Object.keys(req.files)[0];
	if (fileKey) {
		const file = req.files[fileKey];
		[err, photoUrl] = await to(blobClient.putFile(file.path, path.extname(file.name)));
		  if (err) { logger.err('student photo multipart handling error: ', err.message); }
  }

	req.body.photoUrl = photoUrl;
	[err, student] = await to(Student.create(req.body));
      if(err) return next(new errors.UnprocessableEntityError(err.message));
	
	res.header("id", student.id);	
	ReS(req, res, {message:'Created new student', student: student}, 201);
	return next();
};
module.exports.create = create;

const getAll = async function(req, res, next){
	let err, students;

	[err, students] = await to(
		Student.findAll(
			{ order: [ ['lastName', 'ASC'], ['firstName', 'ASC'] ] }
		));
	    if(err) return next(new errors.UnprocessableEntityError(err.message));
	    if(!students) return next(new errors.NotFoundError());
  
	ReS(req, res, {message:'Get all students', students: students});
  next();
}
module.exports.getAll = getAll;

const getStudent = async function(req, res, next) {
	var err, student;

	[err, student] = await to(Student.findByPk(req.params.id));
	  if(err) return next(new errors.UnprocessableEntityError(err.message));
	  if(!student) return next(new errors.NotFoundError());

	return student;
}

const get = async function(req, res, next){
	let student = await getStudent(req,res,next);
	  if(!student) return;

	ReS(req, res, {student: student});  	
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

	ReS(req, res, {message:'Updated student', student: student});
	next();
};
module.exports.update = update;

const remove = async function (req, res, next) {
	let student = await getStudent(req,res,next);
	  if(!student) return;
	
	student.destroy();
	  
	ReS(req, res, {message:'Deleted student'}, 204);
	next();
};
module.exports.remove = remove;


