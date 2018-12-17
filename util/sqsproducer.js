

/**
 * for now expecting calling function to manage error handling
 * and additional logging
 */
module.exports.queueStandardMessage =
    async (sqs, id, messageBody, queueUrl) => {
        const params = {
            DelaySeconds: 0,
            MessageAttributes: {
                id: {
                    DataType: 'String',
                    StringValue: id,
                },
            },
            MessageBody: messageBody,
            QueueUrl: queueUrl,
        };
        return await sqs.sendMessage(params).promise();
    };
