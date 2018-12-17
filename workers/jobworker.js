const JobConsumer = require('./jobconsumer');
const logger = require('../util/basic-logger');
const AWS = require('aws-sdk');

// Set the region 
AWS.config.update({region: process.env.AWS_REGION});
// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = process.env.SQS_QUEUE_URL;

module.exports.startJobWorker = () => {
    logger.info("startWorker!");
    try {
        const jobConsumer = JobConsumer(sqs, queueUrl);
        jobConsumer.receiveMessages();
    } catch (err) {
        logger.error("startWorker error!", err);
    }
};