'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('issues', {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          project_id: {
              type: Sequelize.INTEGER,
              defaultValue: false,
              allowNull: false
          },
          title: {
              type: Sequelize.STRING,
              defaultValue: false,
              allowNull: false
          },
          description: {
              type: Sequelize.STRING,
              defaultValue: false,
              allowNull: false
          },
          type: {
              type: Sequelize.ENUM,
              values: ['bug', 'task', 'feature'],
              defaultValue: 'task',
              allowNull: false
          },
          status: {
              type: Sequelize.ENUM,
              values: ['new', 'inprogress', 'reopen', 'feedback', 'testready', 'closed'],
              defaultValue: 'new',
              allowNull: false
          },
          priority: {
              type: Sequelize.ENUM,
              values: ['low', 'normal', 'hight', 'urgent', 'immediate'],
              defaultValue: 'normal',
              allowNull: false
          },
          created_user_id: {
              type: Sequelize.INTEGER,
              defaultValue: false,
              allowNull: false
          },
          assigned_user_id: {
              type: Sequelize.INTEGER,
              defaultValue: false,
              allowNull: false
          },
          start_dt: {
              type: Sequelize.DATE
          },
          due_dt: {
              type: Sequelize.DATE
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
      return queryInterface.dropTable('issues');
  }
};
