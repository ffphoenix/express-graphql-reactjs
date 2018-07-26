module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('issue_statuses', [
            {id: 1, title: 'New',order: 1},
            {id: 2, title: 'In Progress',order: 2},
            {id: 3, title: 'Reopen',order: 3},
            {id: 4, title: 'Feedback',order: 4},
            {id: 5, title: 'Ready for Test',order: 5},
            {id: 6, title: 'Closed',order: 6},
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('issue_statuses', null, {});
    }
};
