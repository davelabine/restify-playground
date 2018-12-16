const jobClient = require('../util/jobclient');

module.exports = () => {
    const processMessage = async (message) => {
        const id = message.MessageAttributes.id.StringValue;
        const sqsMessageId = message.MessageId;
        console.log("processing message id = %s!  sqsMessage = %s \n", id, sqsMessageId, message);

        jobClient.putJobProcessed(id);
        console.log("processing complete!");
    }

    return {
        processMessage,
    };
};