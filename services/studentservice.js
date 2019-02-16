const logger = require('../util/basic-logger');
const { to }  = require('../util/util');  
const Student = require('../models').Student;
const BlobClient = require('../util/blobclient');

module.exports = () => {
  const blobClient = BlobClient();

  const createStudent = async (student, photoPath, photoExt) => {
    let err, createdStudent;

    let photoUrl = '';
    if ( photoPath && photoExt ) {
        [err, photoUrl] = await to(blobClient.putFile(photoPath, photoExt));
          if (err) { logger.err('studentService photo blob upload error: ', err.message); throw err; }
    }

    student.photoUrl = photoUrl;
    [err, createdStudent] = await to(Student.create(student));
      if (err) { logger.err('studentService create error', err.message); throw err; }

    logger.info("created student: ", createdStudent.get({plain: true}));
    return createdStudent;
  };

  return {
    createStudent
  };
};