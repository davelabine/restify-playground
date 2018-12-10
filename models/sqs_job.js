'use strict';
module.exports = (sequelize, DataTypes) => {
  const SQS_Job = sequelize.define('SQS_Job', {
    messageId: DataTypes.STRING,
    processed: DataTypes.BOOLEAN
  }, {});
  SQS_Job.associate = function(models) {
    // associations can be defined here
  };
  return SQS_Job;
};