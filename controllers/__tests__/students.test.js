require('dotenv').config(); // Instantiate environment variables.

jest.mock('../../util/basic-logger');

const StudentService = require('../../services/studentservice');
jest.mock('../../services/studentservice');

//const Student = require('../../models').Student;
const studentsController = require('../students');

describe('studentsController', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = jest.fn();
        res = { json: jest.fn() };
        next = jest.fn();
    });
    describe('createStudent', () => {
        test('creates a student with no photo', async () => {
            const reqStudent = {
                'id': 'FAKE_KEY',
                'studentId': 'FAKE_ID',
                'firstName': 'FAKE_FIRST_NAME',
                'lastName': 'FAKE_LAST_NAME',
                'photoUrl': undefined
            }; 
            let resStudent;
            resStudent = Object.assign({}, reqStudent);
            resStudent.photoUrl = '';

            (StudentService).mockImplementation(() => {
                return {
                    createStudent: jest.fn(async (student, path, ext) => {
                        return resStudent
                    })
                }
            });

            req.files = [];
            req.body = reqStudent;
            await studentsController.create(req, res, next);

            expect(res.statusCode).toBe(201);
            expect(res.json).toHaveBeenCalledWith({
                message: expect.any(String),
                request_body: expect.objectContaining(reqStudent),
                request_query: undefined,
                student: expect.objectContaining(resStudent)
            });
        });
    });
    describe('getAllStudents', () => {
        test('returns a list of students', async () => {
            /*
            req.params = {
                serviceId: 'service',
                mobileAppId: 'mobileAppId',
            };
            req.body = {
                platform: 'APNS',
                deviceId: 'device',
                userId: 'user',
            };
            */
            /*
            res.body = {message:'Get all students', students: students}
            
            getAllStudents = jest.fn(() => {
                return [];
            }
            */
            /*
            Student.getAll = jest.fn(() => {
                return [];
            });
            await studentsController.getAll(req, res, next);
            expect(res.json).toBeCalledWith(200, expect.anything());
            */
        });

    });
});