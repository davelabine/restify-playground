// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'REGION'});

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var queueURL = "https://sqs.us-west-2.amazonaws.com/962985931788/Resterapp_q";

var params = {
  AttributeNames: [
    "SentTimestamp"
  ],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: [
    "All"
  ],
  QueueUrl: queueURL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0
};

const receiveMessage = async (message) => {
  while (true) {
    try {
      const data = await sqs.receiveMessage(params).promise();
      if (data && data.Messages && data.Messages.length > 0) {
        console.log("Message Received - ", data.Messages[0]);
        var deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function(err, data) {
          if (err) {
            console.log("Delete Error", err);
          } else {
            console.log("Message Deleted", data);
          }
        });
      } 
    } catch (err) {
      console.log("Receive Error", err);
    }
  }
};

receiveMessage().then("done!");