require('dotenv').config(); // Instantiate environment variables.
const SqsConsumer = require('../sqsconsumer');

describe('sqsConsumer', () => {
    let mockPromise;
    let receiveMessage;
    let deleteMessage;
    let sqs;
    let queueUrl;
    let messageProcessor;

    beforeEach(() => {
        mockPromise = jest.fn();
        receiveMessage = jest.fn();
        deleteMessage = jest.fn();
        sqs = {
            receiveMessage,
            deleteMessage,
            promise: mockPromise,
        };
        queueUrl = 'url';
        receiveMessage.mockImplementation(() => sqs);
        deleteMessage.mockImplementation(() => sqs);
        messageProcessor = jest.fn();
    });

    describe('receiveMessages', () => {
        test('it receives messages and returns them to caller', async () => {
            const Messages = [
                { MessageId: '1' },
                { MessageId: '2' },
            ];
            const response = {
                Messages,
            };
            mockPromise.mockImplementation(() => {
                return response;
            });
            const consumer = SqsConsumer(sqs, queueUrl, messageProcessor);

            const result = await consumer.receiveMessages();
            expect(receiveMessage).toHaveBeenCalledWith(
                expect.objectContaining(
                    {
                        QueueUrl: queueUrl,
                    }),
            );
            expect(mockPromise).toHaveBeenCalled();
            expect(result).toEqual(Messages);
        });
    });
});