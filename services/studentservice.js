const logger = require('../util/basic-logger');
const { to }  = require('../util/util');  
const db = require('../models').Student;
const BlobClient = require('../util/blobclient');

module.exports = () => {
  const blobClient = BlobClient();

  const create = async (student, photoPath, photoExt) => {
    let err, createdStudent;

    let photoUrl = '';
    if ( photoPath && photoExt ) {
        [err, photoUrl] = await to(blobClient.putFile(photoPath, photoExt));
          if (err) { logger.err('studentService photo blob upload error: ', err.message); throw err; }
    }

    student.photoUrl = photoUrl;

    [err, createdStudent] = await to(db.create(student));
      if (err) { logger.err('studentService create error', err.message); throw err; }

    logger.info("created student: ", createdStudent.get({plain: true}));
    return createdStudent;
  };

  const get = async (id) => {
    var err, student;
  
    [err, student] = await to(db.findByPk(id));
      if (err) { logger.err('studentService get error: ', err.message); throw err; }
  
    return student;
  };

  const getAll = async () => {
  	let err, students;

    [err, students] = await to(
      db.findAll(
        { order: [ ['lastName', 'ASC'], ['firstName', 'ASC'] ] }
      ));
        if (err) { logger.err('studentService getAll error: ', err.message); throw err; }

    return students;
  };

  const update = async (student, newData) => {
    student.set(newData);
    
    let err, updatedStudent;
    [err, updatedStudent] = await to(student.save());
      if (err) { logger.err('studentService update error: ', err.message); throw err; }

    return updatedStudent;
  };

  const remove = async (student) => {
    student.destroy();
  };

  return {
    create,
    get,
    getAll,
    update,
    remove
  };
};