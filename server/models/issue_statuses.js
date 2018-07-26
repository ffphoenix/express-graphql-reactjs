'use strict';
import moment from 'moment';

module.exports = (sequelize, DataTypes) => {
    var issue_statuses = sequelize.define('issue_statuses' , {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                message: 'Title must be unique.',
                fields: [sequelize.fn('lower', sequelize.col('title'))]
            },
            validate: {
                notEmpty: true,
            }
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        create_date: {
            type: new DataTypes.VIRTUAL(DataTypes.DATE, ['created_at']),
            get: function() {
                const date = new Date(this.get('created_at'));
                return moment(date, moment.ISO_8601).format('MM/DD/YY HH:mm:ss');
            }
        }
    }, {
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
        underscored: true
    });
    return issue_statuses;
};