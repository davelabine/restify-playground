require('dotenv').config(); // Instantiate environment variables.
const SqsProducer = require('../sqsproducer');
describe('sqsProducer', () => {
    let mockPromise
    let sendMessage;
    let sqs;

    beforeEach(() => {
        mockPromise = jest.fn();
        sendMessage = jest.fn();
        sqs = {
            sendMessage,
            promise: mockPromise,
        };
        sendMessage.mockImplementation(() => sqs);
    });
    describe('queueStandardMessage', () => {
        test('queues the message', async () => {
            const producer = SqsProducer(sqs,'sqsQueueUrl');
            const id = 'jobId';
            const messageBody = JSON.stringify({ key: 'value' });

            const response = {
                MessageId: 'messageid',
            };
            mockPromise.mockImplementation(() => {
                return response;
            });
            const result = await producer.queueStandardMessage(id, messageBody);

            expect(sendMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    MessageBody: messageBody,
                }),
            );
            expect(result).toEqual(response);
        });
    });
});