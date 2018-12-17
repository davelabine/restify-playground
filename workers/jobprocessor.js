const jobClient = require('../util/jobclient');
const sleep = require('../util/sleep');

module.exports = () => {
    const processMessage = async (message) => {
        const id = message.MessageAttributes.id.StringValue;
        const sqsMessageId = message.MessageId;
        const messageBody = JSON.parse(message.Body);
        console.log("processing message id = %s!  body = %s, sqsMessageId = %s, ", id, message.Body, sqsMessageId);

        try {
            if (messageBody.napTime) {
                console.log("Taking a nap for %s ms... ", messageBody.napTime);
                await sleep.sleepPromise(messageBody.napTime);
                console.log("Ahhhh... that's better!");
            }
            await jobClient.putJobProcessed(id);
            console.log("Processing complete.");
        } catch (err) {
            console.log("jobclient error!". err);
        }

    }

    return {
        processMessage,
    };
};