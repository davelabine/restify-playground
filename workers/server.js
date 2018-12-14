const AWS = require('aws-sdk');
const {receiveQueuedMessage} = require('../util/sqsconsumer');

// Set the region 
AWS.config.update({region: 'us-west-2'});
// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const jobQueueUrl = "https://sqs.us-west-2.amazonaws.com/962985931788/Resterapp_q";

const jobConsumer = async () => {
    while (true) {
        try {
            let message = await receiveQueuedMessage(sqs,jobQueueUrl);
            console.log("Received message! - ", message);
        } catch (err) {
            console.log("jobConsumer error!", err);
        }
    }
};

function startWorker() {
    try {
        jobConsumer();
    } catch (err) {
        console.log("startWorker error!");
    }
}

startWorker();