


/**
 * for now expecting calling function to manage error handling
 * and additional logging
 */
module.exports.receiveQueuedMessage =
    async (sqs, queueUrl) => {
        const params = {
                AttributeNames: [
                  "SentTimestamp"
                ],
                MaxNumberOfMessages: 1,
                MessageAttributeNames: [
                  "All"
                ],
                QueueUrl: queueUrl,
                VisibilityTimeout: 20,
                WaitTimeSeconds: 0
              };
        return await sqs.receiveMessage(params).promise();
    };