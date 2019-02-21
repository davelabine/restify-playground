require('dotenv').config(); // Instantiate environment variables.

jest.mock('../../util/basic-logger');
const errors = require('restify-errors');   

const studentsController = require('../students');

describe('studentsController', () => {
    let req, res, next;
    let requestStudent, responseStudent;
    let responseStudentFn, errorFn;
    let studentServiceMock;

    beforeEach(() => {
        req = jest.fn();
        req.files = [];
        res = { json: jest.fn() };
        next = jest.fn();

        requestStudent = {
            'studentId': 'FAKE_ID',
            'firstName': 'FAKE_FIRST_NAME',
            'lastName': 'FAKE_LAST_NAME',
        }; 
        responseStudent = Object.assign({'id': 'FAKE_KEY', 'photoUrl': ''}, requestStudent);

        responseStudentFn = jest.fn(async () => {
            return responseStudent;
        });
        errorFn = jest.fn(async () => {
            throw new Error();
        });

        studentServiceMock = {
            create: jest.fn(),
            getAll: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        studentsController.setStudentService(studentServiceMock);
    });
    describe('create', () => {
        test('creates a student with no photo', async () => {
            req.body = requestStudent;
            studentServiceMock.create = responseStudentFn;
            await studentsController.create(req, res, next);

            expect(res.statusCode).toBe(201);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.any(String),
                request_body: expect.objectContaining(requestStudent),
                student: expect.objectContaining(responseStudent)
            });
            expect(next).toHaveBeenCalled();
        });
        test('handles an error', async () => {
            req.body = requestStudent;
            studentServiceMock.create = errorFn;
            await studentsController.create(req, res, next);
            expect(next).toHaveBeenCalledWith(new errors.UnprocessableEntityError(''));
        });
    });
    describe('getAll', () => {
        test('returns a list of students', async () => {
            studentServiceMock.getAll = jest.fn(async () => {
                return [responseStudent]
            });
            await studentsController.getAll(req, res, next);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.any(String),
                students: expect.objectContaining([responseStudent])
            });
        });
        test('handles an error', async () => {
            studentServiceMock.getAll = errorFn;
            await studentsController.getAll(req, res, next);
            expect(next).toHaveBeenCalledWith(new errors.UnprocessableEntityError(''));
        });
    });
    describe('get', () => {
        test('returns student', async () => {
            studentServiceMock.get = responseStudentFn;
            req.params = { id : 'FAKE_ID' };
            await studentsController.get(req, res, next);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.any(String),
                student: expect.objectContaining(responseStudent)
            });
        });
        test('handles an error', async () => {
            req.params = { id : 'FAKE_ID' };
            studentServiceMock.get = errorFn;
            await studentsController.get(req, res, next);
            expect(next).toHaveBeenCalledWith(new errors.UnprocessableEntityError(''));
        });
        test('handles no student found', async () => {
            req.params = { id : 'FAKE_ID' };
            studentServiceMock.get = studentServiceMock.get = jest.fn(async () => {
                return undefined;
            });
            await studentsController.get(req, res, next);
            expect(next).toHaveBeenCalledWith(new errors.NotFoundError(''));
        });
    });
    describe('update', () => {
        test('updates the student', async () => {
            // Doesn't really matter that the student isn't actually updated... 
            // We're not testing that, just the responses
            studentServiceMock.get = responseStudentFn;
            studentServiceMock.update = responseStudentFn;
            req.params = { id : 'FAKE_ID' };
            await studentsController.update(req, res, next);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.any(String),
                student: expect.objectContaining(responseStudent)
            });
        });
        test('handles no student found', async () => {
            req.params = { id : 'FAKE_ID' };
            studentServiceMock.get = jest.fn(async () => {
                return undefined;
            });
            await studentsController.update(req, res, next);
            expect(next).toHaveBeenCalledWith(new errors.NotFoundError(''));
        });
        test('handles an error on get student', async () => {
            req.params = { id : 'FAKE_ID' };
            studentServiceMock.get = errorFn;
            await studentsController.update(req, res, next);
            expect(next).toHaveBeenCalledWith(new errors.UnprocessableEntityError(''));
        });
    });
});