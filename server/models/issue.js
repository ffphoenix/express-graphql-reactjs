'use strict';
import moment from "moment/moment";
import project from "./project";

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
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('bug', 'task', 'feature'),
        },
        status: {
            type: DataTypes.INTEGER,
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
            allowNull: true
        },
        create_date: {
            type: new DataTypes.VIRTUAL(DataTypes.DATE, ['created_at']),
            get: function() {
                const date = new Date(this.get('created_at'));
                console.log(date);
                return moment(date, moment.ISO_8601).format('MM/DD/YY HH:mm:ss');
            }
        },
        update_date: {
            type: new DataTypes.VIRTUAL(DataTypes.DATE, ['updated_at']),
            get: function() {
                const date = new Date(this.get('updated_at'));
                return moment(date, moment.ISO_8601).format('MM/DD/YY HH:mm:ss');
            }
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

    }, {
        classMethods: {
            associate: function (models) {
                console.log('assoc',models);
                issues.belongsTo(models.projects, {as: 'project', foreignKey : 'project_id'});
            }
        },
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
        underscored: true
    });
    const projects = project(sequelize, DataTypes)
    issues.belongsTo(projects, {as: 'project', foreignKey : 'project_id'});
    return issues;
};