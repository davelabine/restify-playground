'use strict';
// Originally reated with 
// sequelize model:create --name STUDENT --attributes STUDENT_ID:string,STUDENT_NAME:string
module.exports = (sequelize, DataTypes) => {
  
  const Model = sequelize.define('student1', {
    s_id: DataTypes.STRING,
    s_name: DataTypes.STRING
  }, {});

  Model.associate = function(models) {
    // associations can be defined here
  };

  Model.prototype.toWeb = function(pw) {
    let json = this.toJSON();
    return json;
  };

  // force: true will drop the table if it already exists
  Model.sync({force: true}).then(() => {
    // Table created
    return Model.create({
      s_id: '123',
      s_name: 'Billy Bob'
    });
  });

  return Model;
};
