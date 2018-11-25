'use strict';

// Skeleton generated with
// sequelize seed:generate --name demo-students
// You need to add data by hand.
// 
// Run the seeds like
// sequelize db:seed:all

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Students', [
    {
      studentId: '111111',
      firstName: 'John',
      lastName: 'Doe'
    },
    {
      studentId: '222222',
      firstName: 'Homer',
      lastName: 'Simpson'
    },    
    {
      studentId: '333333',
      firstName: 'Bart',
      lastName: 'Simpson'
    },
    {
      studentId: '444444',
      firstName: 'Marge',
      lastName: 'Bouvier'
    },    
  ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Students', null, {});
  }
};
