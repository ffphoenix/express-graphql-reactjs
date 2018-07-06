'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('projects', {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          short_name: {
              type: Sequelize.STRING,
              defaultValue: false,
              allowNull: false
          },
          title: {
              type: Sequelize.STRING,
              defaultValue: false,
              allowNull: false
          },
          image_id: {
              type: Sequelize.STRING,
              defaultValue: false,
              allowNull: false
          },
          description: {
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
      return queryInterface.dropTable('projects');
  }
};
