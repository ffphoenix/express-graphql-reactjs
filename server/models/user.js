'use strict';
import moment from 'moment';

module.exports = (sequelize, DataTypes) => {
    var users = sequelize.define('users' , {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                message: 'Username must be unique.',
                fields: [sequelize.fn('lower', sequelize.col('username'))]
            },
            validate: {
                notEmpty: true,
                is: ["^[a-zA-Z0-9]+$",'i'],
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                message: 'Email must be unique.',
                fields: [sequelize.fn('lower', sequelize.col('email'))]
            },
            validate: {
                notEmpty: true,
                isEmail: true
            }
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
    return users;
};