'use strict';
module.exports = (sequelize, DataTypes) => {
    var issues = sequelize.define('issues' , {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                message: 'Title must be unique.',
                fields: [sequelize.fn('lower', sequelize.col('username'))]
            },
            validate: {
                notEmpty: true,
                is: ["^[a-zA-Z0-9]+$",'i'],
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                message: 'Description must be unique.',
                fields: [sequelize.fn('lower', sequelize.col('username'))]
            },
            validate: {
                notEmpty: true,
                is: ["^[a-zA-Z0-9]+$",'i'],
            }
        },
        type: {
            type: DataTypes.ENUM('bug', 'task', 'feature'),
        },
        status: {
            type: DataTypes.ENUM('new', 'inprogress', 'reopen', 'feedback', 'testready', 'closed'),
        },
        priority: {
            type: DataTypes.ENUM('low', 'normal', 'hight', 'urgent', 'immediate'),
        },
        created_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        assigned_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

    }, {
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
        underscored: true
    });
    return issues;
};