'use strict';
import moment from 'moment';

module.exports = (sequelize, DataTypes) => {
    var project = sequelize.define('projects' , {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        short_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                message: 'Short Name must be unique.',
                fields: [sequelize.fn('lower', sequelize.col('short_name'))]
            },
            validate: {
                notEmpty: true,
                is: ["^[a-zA-Z0-9]+$",'i'],
            }
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
            allowNull: true,
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
    return project;
};