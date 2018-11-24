'use strict';

// Skeleton generated with
// sequelize seed:generate --name demo-students
// You need to add data by hand.
// 
// Run the seeds like
// sequelize db:seed:all

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Students', [{
      studentId: '123',
      firstName: 'John',
      lastName: 'Doe'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Students', null, {});
  }
};
