'use strict';
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
        }
    }, {
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
        underscored: true
    });
    return users;
};