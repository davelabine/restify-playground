const JobProcessor = require('./jobprocessor');
const SqsConsumer = require('../util/sqsconsumer');

module.exports = (sqs, queueUrl) => {
    const jobProcessor = JobProcessor();
    const sqsConsumer = SqsConsumer(sqs, queueUrl, jobProcessor);

    const receiveMessages = async () => {
        while (true) {
            try {
                await sqsConsumer.consumeSqsMessages();
            } catch (err) {
                console.log("jobConsumer error!", err);
            }
        }
    };

    return {
        receiveMessages,
    };
};