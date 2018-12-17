logger = require('./basic-logger');
/**
 * for now expecting calling function to manage error handling
 * and additional logging
 */
module.exports = (sqs, queueUrl, messageProcessor) => {

    const processMessage = async (message) => {
        let toDelete = false;
        try {
            await messageProcessor.processMessage(message);
            toDelete = true;
        } catch (err) {
            logger.error("processMessage error!" - err);
        } finally {
            if (toDelete) {
                await deleteMessage(message.ReceiptHandle, message.MessageId);
            }
        }
    };
    
    const receiveMessages = async () => {
        try {
            const params = {
                AttributeNames: [
                  "SentTimestamp"
                ],
                MaxNumberOfMessages: 1,
                MessageAttributeNames: [
                  "All"
                ],
                QueueUrl: queueUrl,
                VisibilityTimeout: process.env.SQS_VISIBILITY_TIMEOUT,
                WaitTimeSeconds: 0
            };
            const data = await sqs.receiveMessage(params).promise();
            if (data && data.Messages && data.Messages.length > 0) {
                return data.Messages;
            }
            return [];
        }
        catch (err) {
            logger.error("consumeSqsMessages error! - ", err);
        }
    };

    const deleteMessage = async (receiptHandle) => {
        const deleteParams = {
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle,
        };
        try {
            const data = await sqs.deleteMessage(deleteParams).promise();
            logger.info("Deleted message.");
        } catch (err) {
            logger.error("deleteSqsMessages error! - ", err);
        }
    };

    const consumeSqsMessages = async () => {
        const messages = await receiveMessages();
        for (const message of messages) {
            await processMessage(message);
        }
    };

    return {
        consumeSqsMessages,
        receiveMessages,
        deleteMessage
    };
};