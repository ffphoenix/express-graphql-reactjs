'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [{
          username: 'admin',
          password: '$2b$10$iFG7yQS37DhUUcUtOU4AEujb4OMDYUpNeY0UzYe86xHPUOgHJdKBi',
          email: 'freeflyingphoenix@gmail.com'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
  }
};
