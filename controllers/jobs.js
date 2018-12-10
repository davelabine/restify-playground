const logger = require('../basic-logger');
const Job = require('../models').SQS_Job;
const errors = require('restify-errors');     
const { to, TE, ReS }  = require('../services/util');  

const create = async function (req, res, next) {
    let err, job;
    
    let messageId = "fun-" + Math.random();
    job = {
        messageId : messageId
    }
    
    logger.info(job);

	[err, job] = await to(Job.create(job));
      if(err) return next(new errors.UnprocessableEntityError(err.message));

    ReS(req, res, {message:'Created new job', job: job}, 201);
	return next();
};
module.exports.create = create;

const getAll = async function(req, res, next){
	let err, jobs;

	[err, jobs] = await to(Job.findAll());
	  if(err) return next(new errors.UnprocessableEntityError(err.message));
	  if(!jobs) return next(new errors.NotFoundError());

	ReS(req, res, {message:'Get all jobs', jobs: jobs});
    next();
}
module.exports.getAll = getAll;

const getJob = async function(req, res, next) {
	var err, job;

	[err, job] = await to(Job.findById(req.params.id));
	  if(err) return next(new errors.UnprocessableEntityError(err.message));
	  if(!job) return next(new errors.NotFoundError());

	return job;
}

const get = async function(req, res, next){
	let job = await getJob(req,res,next);
	  if(!job) return;

	ReS(req, res, {job: job});  	
    next();
}
module.exports.get = get;

const update = async function (req, res, next) {
	let job = await getJob(req,res,next);
	  if(!job) return;

	let err;
	job.set(req.body);
  
	[err, job] = await to(job.save());
	  if(err) return next(new errors.UnprocessableEntityError(err.message));

	ReS(req, res, {message:'Updated job', job: job});
	next();
};
module.exports.update = update;

const remove = async function (req, res, next) {
	let job = await getJob(req,res,next);
	  if(!job) return;
	
	job.destroy();
	  
	ReS(req, res, {message:'Deleted job'}, 204);
	next();
};
module.exports.remove = remove;

