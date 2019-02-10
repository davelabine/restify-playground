require('dotenv').config(); // Instantiate environment variables.
const SqsConsumer = require('../sqsconsumer');
logger = require('../basic-logger');
jest.mock('../basic-logger');

describe('sqsConsumer', () => {
    let mockPromise;
    let receiveMessage;
    let deleteMessage;
    let sqs;
    let queueUrl;
    let messageProcessor;
    let processMessage;

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
        processMessage = jest.fn();
        messageProcessor = {
            processMessage: processMessage
        };
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
        test('it receives no messages by timeout', async () => {
            const response = {};
            const consumer = SqsConsumer(sqs, queueUrl, messageProcessor);
            mockPromise.mockImplementation(() => {
                return response;
            });

            const result = await consumer.receiveMessages();
            expect(receiveMessage).toHaveBeenCalledWith(
                expect.objectContaining(
                    {
                        QueueUrl: queueUrl,
                    }),
            );
            expect(mockPromise).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
        test('it receives empty messages', async () => {
            const response = {
                Messages: [],
            };
            const consumer = SqsConsumer(sqs, queueUrl, messageProcessor);
            mockPromise.mockImplementation(() => {
                return response;
            });

            const result = await consumer.receiveMessages();
            expect(receiveMessage).toHaveBeenCalledWith(
                expect.objectContaining(
                    {
                        QueueUrl: queueUrl,
                    }),
            );
            expect(mockPromise).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
        test('it receives undefined', async () => {
            const consumer = SqsConsumer(sqs, queueUrl, messageProcessor);
            mockPromise.mockImplementation(() => {
                return undefined;
            });

            const result = await consumer.receiveMessages();
            expect(receiveMessage).toHaveBeenCalledWith(
                expect.objectContaining(
                    {
                        QueueUrl: queueUrl,
                    }),
            );
            expect(mockPromise).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
        test('it handles errors and returns undefined', async () => {
            mockPromise.mockImplementation(() => {
                throw new Error();
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
            expect(result).toBeUndefined();
            expect(logger.error).toHaveBeenCalled();
        });
    });
    describe('deleteMessage', () => {
        test('it deletes the message', async () => {
            const data = {};
            const consumer = SqsConsumer(sqs, queueUrl, messageProcessor);
            mockPromise.mockImplementation(() => {
                return data;
            });
            const receiptHandle = 'someguid';
            await consumer.deleteMessage(receiptHandle);
            expect(deleteMessage).toHaveBeenCalledWith(
                expect.objectContaining(
                    {
                        ReceiptHandle: receiptHandle,
                        QueueUrl: queueUrl,
                    }),
            );
            expect(mockPromise).toHaveBeenCalled();
        });
        test('it handles an error', async () => {
            const consumer = SqsConsumer(sqs, queueUrl, messageProcessor);
            mockPromise.mockImplementation(() => {
                throw new Error();
            });
            const receiptHandle = 'someguid';
            const result = await consumer.deleteMessage(receiptHandle);
            expect(deleteMessage).toHaveBeenCalledWith(
                expect.objectContaining(
                    {
                        ReceiptHandle: receiptHandle,
                        QueueUrl: queueUrl,
                    }),
            );
            expect(mockPromise).toHaveBeenCalled();
            expect(result).toBeUndefined();
            expect(logger.error).toHaveBeenCalled();
        });
    });
    describe('consumeSqsMessages', () => {
        test('it receives messages and calls the processor', async () => {
            (messageProcessor.processMessage)
                .mockResolvedValueOnce()
                .mockResolvedValueOnce();
            const Messages = [
                {
                    Body: JSON.stringify({
                        napTime: 5000 
                    }),
                    MessageAttributes: {
                        id: {
                            DataType: 'String',
                            StringValue: 'messageId1',
                        },
                    },
                    MessageId: 'sqsmessageid1',
                    ReceiptHandle: 'receiptHandle1',
                },
                {
                    Body: JSON.stringify({
                        napTime: 5000 
                    }),
                    MessageAttributes: {
                        id: {
                            DataType: 'String',
                            StringValue: 'messageId1',
                        },
                    },
                    MessageId: 'sqsmessageid2',
                    ReceiptHandle: 'receiptHandle2',
                },
            ];
            const response = {
                Messages,
            };
            mockPromise.mockImplementation(() => {
                return response;
            });

            const consumer = SqsConsumer(sqs, queueUrl, messageProcessor);
            await consumer.consumeSqsMessages();

            expect(messageProcessor.processMessage).toHaveBeenCalledWith(Messages[0]);
            expect(messageProcessor.processMessage).toHaveBeenCalledWith(Messages[1]);
            expect(deleteMessage).toHaveBeenCalledTimes(2);
            expect(deleteMessage).toHaveBeenCalledWith(expect.objectContaining(
                { ReceiptHandle: Messages[0].ReceiptHandle }));
            expect(deleteMessage).toHaveBeenCalledWith(expect.objectContaining(
                { ReceiptHandle: Messages[1].ReceiptHandle }));            
        });
        test('it handles an error', async () => {
            (messageProcessor.processMessage)
                .mockRejectedValueOnce(new Error('oops'));
            const Messages = [
                {
                    Body: JSON.stringify({
                        napTime: 5000 
                    }),
                    MessageAttributes: {
                        id: {
                            DataType: 'String',
                            StringValue: 'messageId1',
                        },
                    },
                    MessageId: 'sqsmessageid1',
                    ReceiptHandle: 'receiptHandle1',
                },
            ];
            const response = {
                Messages,
            };
            mockPromise.mockImplementation(() => {
                return response;
            });

            const consumer = SqsConsumer(sqs, queueUrl, messageProcessor);
            await consumer.consumeSqsMessages();

            expect(messageProcessor.processMessage).toHaveBeenCalledWith(Messages[0]);
            expect(logger.error).toHaveBeenCalled();
            expect(deleteMessage).toHaveBeenCalledTimes(0);
        });
    });
});