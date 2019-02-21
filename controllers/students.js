const fs = require('fs');
const path = require('path');
const logger = require('../util/basic-logger');
let studentService = require('../services/studentservice');

const errors = require('restify-errors');     
const { to, RE, ReS }  = require('../util/util');  

function getFileInfo(req) {
	let fileKey, filePath = '', fileExt ='';
	fileKey = Object.keys(req.files)[0];
	if (fileKey) {
		filePath = req.files[fileKey].path;
		fileExt = path.extname(req.files[fileKey].name);
	}
	return [fileKey, filePath, fileExt];
}

function deleteFile(req, fileKey) {
	if (fileKey) {
	  fs.unlink(req.files[fileKey].path, (err) => {
			if (err) { logger.error("failed to delete local image: " + err); }
		});
	}
}

const setStudentService = async function (newStudentService) {
	studentService = newStudentService;
}
module.exports.setStudentService = setStudentService;

const create = async function (req, res, next) {
	let fileKey, filePath, fileExt;
	[fileKey, filePath, fileExt] = getFileInfo(req);

	let err, student;
	[err, student] = await to(studentService.create(req.body, filePath, fileExt));
		if (err) return next(RE(new errors.UnprocessableEntityError(err.message)));

	// Make sure to delete the temp uploaded file
	deleteFile(req, fileKey);
	
	// res.header("id", student.id);	
	ReS(req, res, {message:'Created new student', student: student}, 201);
	return next();
};
module.exports.create = create;

const getAll = async function(req, res, next) {
	let err, students;

	[err, students] = await to(studentService.getAll());
	    if(err) return next(RE(new errors.UnprocessableEntityError(err.message)));

	ReS(req, res, {message:'Get all students', students: students});
  next();
}
module.exports.getAll = getAll;

const get = async function(req, res, next) {
	let err, student;

	[err, student] = await to(studentService.get(req.params.id));
		if(err) return next(RE(new errors.UnprocessableEntityError(err.message)));
		logger.info('student fun - ', student);
		if(!student) return next(RE(new errors.NotFoundError()));
		
	ReS(req, res, {message:'Get student', student: student});  	
	next();
}
module.exports.get = get;

const update = async function (req, res, next) {
	let err, student 
	[err, student] = await to(studentService.get(req.params.id));
	  if(err) return next(RE(new errors.UnprocessableEntityError(err.message)));
		if(!student) return next(RE(new errors.NotFoundError()));
		
	let fileKey, filePath, fileExt;
	[fileKey, filePath, fileExt] = getFileInfo(req);
		
	[err, student] = await to(studentService.update(student, req.body, filePath, fileExt));
	  if(err) return next(RE(new errors.UnprocessableEntityError(err.message)));

	// Make sure to delete the temp uploaded file
	deleteFile(req, fileKey);

	ReS(req, res, {message:'Updated student', student: student});
	next();
};
module.exports.update = update;

const remove = async function (req, res, next) {
	let student = await studentService.get(req.params.id);
		if(!student) return next(RE(new errors.NotFoundError()));

	studentService.remove(student);
	  
	ReS(req, res, {message:'Deleted student'}, 204);
	next();
};
module.exports.remove = remove;


