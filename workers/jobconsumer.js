const JobProcessor = require('./jobprocessor');
const SqsConsumer = require('../util/sqsconsumer');
const sleep = require('../util/sleep');

module.exports = (sqs, queueUrl) => {
    const jobProcessor = JobProcessor();
    const sqsConsumer = SqsConsumer(sqs, queueUrl, jobProcessor);

    const receiveMessages = async () => {
        while (true) {
            try {
                sqsConsumer.consumeSqsMessages();
            } catch (err) {
                console.log("jobConsumer error!", err);
            }

            // For now, slow down processing for easier debugging.
            await sleep.sleepPromise(1000);
        }
    };

    return {
        receiveMessages,
    };
};