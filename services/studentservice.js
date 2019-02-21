const logger = require('../util/basic-logger');
const { to }  = require('../util/util');  
const db = require('../models').Student;
const BlobClient = require('../util/blobclient');
const blobClient = BlobClient();

async function uploadPhoto(photoPath, photoExt) {
  let photoUrl = '', err;
  if ( photoPath && photoExt ) {
    [err, photoUrl] = await to(blobClient.putFile(photoPath, photoExt));
      if (err) { logger.err('studentService photo blob upload error: ', err.message); throw err; }
  }

  return photoUrl;
}

function deletePhoto(photoUrl) {
  if (photoUrl) {
    blobClient.deleteFile(photoUrl);
  }
}

const create = async (student, photoPath, photoExt) => {
  let err, createdStudent;

  student.photoUrl = await uploadPhoto(photoPath, photoExt);

  [err, createdStudent] = await to(db.create(student));
    if (err) { logger.err('studentService create error', err.message); throw err; }

  logger.info("created student: ", createdStudent.get({plain: true}));
  return createdStudent;
};
module.exports.create = create;

const get = async (id) => {
  var err, student;

  [err, student] = await to(db.findByPk(id));
    if (err) { logger.error('studentService get error: ', err.message); throw err; }

  return student;
};
module.exports.get = get;

const getAll = async () => {
  let err, students;

  [err, students] = await to(
    db.findAll(
      { order: [ ['lastName', 'ASC'], ['firstName', 'ASC'] ] }
    ));
      if (err) { logger.error('studentService getAll error: ', err.message); throw err; }

  return students;
};
module.exports.getAll = getAll;

const update = async (student, newData, photoPath, photoExt) => {
  deletePhoto(student.photoUrl);
  newData.photoUrl = await uploadPhoto(photoPath, photoExt);

  student.set(newData);
  
  let err, updatedStudent;
  [err, updatedStudent] = await to(student.save());
    if (err) { logger.error('studentService update error: ', err.message); throw err; }

  return updatedStudent;
};
module.exports.update = update;

const remove = async (student) => {
  deletePhoto(student.photoUrl);
  student.destroy();
};
module.exports.remove = remove;