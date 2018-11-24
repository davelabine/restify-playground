'use strict';
// Created with sequelize
// sequelize model:generate --name Student --attributes studentId:string,firstName:string,lastName:string
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    studentId: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {});
  Student.associate = function(models) {
    // associations can be defined here
  };
  return Student;
};