'use strict';
module.exports = (sequelize, DataTypes) => {
    var issue = sequelize.define('issue' , {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    }, {
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
        underscored: true
    });
    return issue;
};