'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('issue_statuses', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: Sequelize.STRING,
                defaultValue: false,
                allowNull: false
            },
            order: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
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
        return queryInterface.dropTable('issue_statuses');
    }
};
