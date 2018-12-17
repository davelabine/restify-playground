const jobClient = require('../util/jobclient');
const logger = require('../util/basic-logger');
const sleep = require('../util/sleep');

module.exports = () => {
    const processMessage = async (message) => {
        const id = message.MessageAttributes.id.StringValue;
        const sqsMessageId = message.MessageId;
        const messageBody = JSON.parse(message.Body);
        logger.info("processing message id = %s!  body = %s, sqsMessageId = %s, ", id, message.Body, sqsMessageId);

        try {
            if (messageBody.napTime) {
                logger.info("Taking a nap for %s ms... ", messageBody.napTime);
                await sleep.sleepPromise(messageBody.napTime);
                logger.info("Ahhhh... that's better!");
            }
            await jobClient.putJobProcessed(id);
            logger.info("Processing complete.");
        } catch (err) {
            logger.error("jobclient error!". err);
        }

    }

    return {
        processMessage,
    };
};