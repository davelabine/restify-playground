const AWS = require('aws-sdk');
const {receiveQueuedMessage} = require('../util/sqsconsumer');

// Set the region 
AWS.config.update({region: 'us-west-2'});
// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const jobQueueUrl = "https://sqs.us-west-2.amazonaws.com/962985931788/Resterapp_q";

receiveQueuedMessage.then(function(message) {
    console.log(message); // "Success!"
    throw 'oh, no!';
}).catch(function(e) {
    console.log(e); // "oh, no!"
});