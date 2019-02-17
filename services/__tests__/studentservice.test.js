require('dotenv').config(); // Instantiate environment variables.

jest.mock('../../util/basic-logger');
const StudentService = require('../../services/studentservice');

let db = require('../../models');
jest.mock('../../models');


describe('studentService', () => {


    beforeEach(() => {

    });
    describe('createStudent', () => {
        test('creates a student with no photo', async () => {
            
            const reqStudent = {
                'studentId': 'FAKE_ID',
                'firstName': 'FAKE_FIRST_NAME',
                'lastName': 'FAKE_LAST_NAME',
            }; 
            let resStudent;
            resStudent = Object.assign(
                {
                    'id': 'FAKE_KEY',
                    get: jest.fn()
                }, reqStudent);
            
            (db.Student) = {
                create: jest.fn(( () => {
                    return resStudent;
                })),
            };

            
            let studentService = StudentService();
            let createdStudent = await studentService.createStudent(reqStudent);
            expect(createdStudent).toBe(expect.objectContaining(resStudent));
            
        });
    });
});