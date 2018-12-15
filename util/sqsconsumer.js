
/**
 * for now expecting calling function to manage error handling
 * and additional logging
 */
module.exports = (sqs, queueUrl, messageProcessor) => {

    const processMessage = async (message) => {
        let toDelete = false;
        try {
            //await messageProcessor(message);
            console.log("Message processed!" - message);
            toDelete = true;
        } catch (err) {
            console.log("processMessage error!" - err);
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
                VisibilityTimeout: 20,
                WaitTimeSeconds: 0
            };
            const data = await sqs.receiveMessage(params).promise();
            console.log("receiveMessage - ", data);
            if (data && data.Messages && data.Messages.length > 0) {
                return data.Messages;
            }
            return [];
        }
        catch (err) {
            console.log("consumeSqsMessages error! - ", err);
        }
    };

    const deleteMessage = async (receiptHandle, messageId) => {
        const deleteParams = {
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle,
        };
        try {
            const data = await sqs.deleteMessage(deleteParams).promise();
        } catch (err) {
            console.log("deleteSqsMessages error! - ", err);
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