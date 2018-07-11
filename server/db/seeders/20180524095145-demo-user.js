'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [{
          username: 'admin',
          password: '$2b$10$Mb9Opotrh/nlJfuamzn82.se4dgiNvBq.0FHiyHqvIDeGP/nUJmyy',
          email: 'freeflyingphoenix@gmail.com'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
  }
};
