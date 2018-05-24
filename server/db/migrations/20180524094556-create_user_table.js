'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          username: {
              type: Sequelize.STRING,
              defaultValue: false,
              allowNull: false
          },
          password: {
              type: Sequelize.STRING,
              defaultValue: false,
              allowNull: false
          },
          email: {
              type: Sequelize.STRING,
              defaultValue: false,
              allowNull: false
          },
          created_at: {
              type: Sequelize.DATE
          },
          updated_at: {
              type: Sequelize.DATE
          },
          deleted_at: {
              type: Sequelize.DATE
          },
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('users');
  }
};
