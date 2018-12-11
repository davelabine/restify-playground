

/**
 * for now expecting calling function to manage error handling
 * and additional logging
 */
module.exports.queueStandardMessage =
    async (sqs, id, messageBody, queueUrl) => {
        const params = {
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
