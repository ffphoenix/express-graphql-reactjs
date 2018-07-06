'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('images', {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          path: {
              type: Sequelize.STRING,
              defaultValue: false,
              allowNull: false
          },
          name: {
              type: Sequelize.STRING,
              defaultValue: false,
              allowNull: false
          },
          type: {
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
          }
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('images');
  }
};
