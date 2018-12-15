const SqsConsumer = require('../util/sqsconsumer');
const sleep = require('../util/sleep').sleep;

module.exports = (sqs, queueUrl) => {
    const sqsConsumer = SqsConsumer(sqs, queueUrl);

    const receiveMessages = async () => {
        while (true) {
            try {
                let message = sqsConsumer.consumeSqsMessages();
            } catch (err) {
                console.log("jobConsumer error!", err);
            }

            // For now, slow down processing for easier debugging.
            console.log("sleeping...");
            await sleep(1000);
            console.log("waking up!");
        }
    };

    return {
        receiveMessages,
    };
};