const logger = require('../util/basic-logger');
const { to }  = require('../util/util');  
const Job = require('../models').SQS_Job;
const AWS = require('aws-sdk');
const {queueStandardMessage} = require('../util/sqsproducer');

// Set the region 
AWS.config.update({region: 'us-west-2'});
// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const jobQueueUrl = "https://sqs.us-west-2.amazonaws.com/962985931788/Resterapp_q";

module.exports.queueJob =
    async () => {
        let err, job;

        // Create the job in the DB
        job = { messageId : "unset" };
        [err, job] = await to(Job.create(job));
          if(err) return logger.error("unable to add job to db", err, err.stack);

        // send to sqs
        const messageBody = JSON.stringify({
            napTime: 5000 // take a nap, in ms
        });
        [err, message] = await to(queueStandardMessage(sqs, JSON.stringify(job.id), messageBody, jobQueueUrl));
          if(err) return logger.error("unable to queue job ${id}", err, err.stack);
        logger.info("Successfully queued message - ", message);  

        job.messageId = message.MessageId;
        [err, job] = await to(job.save());
          if(err) return logger.error("unable update job in db", err, err.stack);
        logger.info("Successfully created job - ", job.id);  

        return job;
    };

