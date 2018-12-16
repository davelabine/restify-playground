const jobClient = require('../util/jobclient');

module.exports = () => {
    const processMessage = async (message) => {
        const id = message.MessageAttributes.id.StringValue;
        const sqsMessageId = message.MessageId;
        console.log("processing message id = %s!  sqsMessage = %s", id, sqsMessageId);

        try {
            await jobClient.putJobProcessed(id);
            console.log("processing complete!");
        } catch (err) {
            console.log("jobclient error!". err);
        }

    }

    return {
        processMessage,
    };
};