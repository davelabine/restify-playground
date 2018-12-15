const JobConsumer = require('./jobconsumer');
const AWS = require('aws-sdk');

// Set the region 
AWS.config.update({region: 'us-west-2'});
// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = "https://sqs.us-west-2.amazonaws.com/962985931788/Resterapp_q";

module.exports.startJobWorker = () => {
    console.log("startWorker!");
    try {
        const jobConsumer = JobConsumer(sqs, queueUrl);
        jobConsumer.receiveMessages();
    } catch (err) {
        console.log("startWorker error!" - err);
    }
};