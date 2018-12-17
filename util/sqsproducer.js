

/**
 * for now expecting calling function to manage error handling
 * and additional logging
 */
module.exports = (sqs, sqsQueueUrl) => {

    const queueStandardMessage = async (id, messageBody) => {
        const params = {
            DelaySeconds: 0,
            MessageAttributes: {
                id: {
                    DataType: 'String',
                    StringValue: id,
                },
            },
            MessageBody: messageBody,
            QueueUrl: sqsQueueUrl,
        };
        return await sqs.sendMessage(params).promise();
    };

    return {
        queueStandardMessage,
    };
};
