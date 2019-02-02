'use strict';
// Created with sequelize
// sequelize model:generate --name Student --attributes studentId:string,firstName:string,lastName:string

module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    studentId: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    photoUrl: DataTypes.STRING
  }, { 
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false 
  });
  Student.associate = function(models) {
    // associations can be defined here
  };
  return Student;
};