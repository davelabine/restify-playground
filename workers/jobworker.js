const {receiveQueuedMessage} = require('../util/sqsconsumer');

module.exports.jobWorker = (sqs, queueUrl) => {
    var sqs = sqs;
    var queueUrl = queueUrl;

    jobConsumer: async () => {
        while (true) {
            try {
                let message = await receiveQueuedMessage(sqs,queueUrl);
                console.log("Received message! - ", message);
            } catch (err) {
                console.log("jobConsumer error!", err);
            }
        }
    }

    startWorker: () => {
        try {
            jobConsumer();
        } catch (err) {
            console.log("startWorker error!" - err);
        }
    }

}