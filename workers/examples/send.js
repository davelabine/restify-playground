// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-west-2'});
AWS.config.logger = console;

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
var queueURL = "https://sqs.us-west-2.amazonaws.com/962985931788/Resterapp_q";

var params = {
 DelaySeconds: 0,
 MessageAttributes: {
  "Title": {
    DataType: "String",
    StringValue: "The Whistler"
   },
  "Author": {
    DataType: "String",
    StringValue: "John Grisham"
   },
  "WeeksOn": {
    DataType: "Number",
    StringValue: "6"
   }
 },
 MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
 QueueUrl: queueURL
};

sqs.sendMessage(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("SendMessage Success - ", data);
  }
});