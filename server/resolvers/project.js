import {resolver, attributeFields, JSONType} from 'graphql-sequelize';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString,
    getNullableType

} from 'graphql';

import models from '../models';

const projectType = new GraphQLObjectType({
    name: 'Project',
    description: 'A project',
    fields: attributeFields(models.projects)
});

const projectListType = new GraphQLObjectType({
    name: 'ProjectList',
    fields : {
        rows:  {
            type : new GraphQLList(projectType)
        },
        count:  {
            type : GraphQLInt
        }
    }
});

const queries = {
    project: {
        type: projectType,
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        resolve: resolver(models.projects)
    },
    projects: {
        type: projectListType,
        args: {
            limit: {
                type: getNullableType(GraphQLInt)
            },
            order: {
                type: getNullableType(GraphQLString)
            },
            offset: {
                type: getNullableType(GraphQLInt)
            },
            search: {
                type: getNullableType(GraphQLString)
            }
        },
        resolve: function(obj, args, context) {
            args.order = [args.order.split(' ')];
            if (args.search !== undefined && args.search !== '') {
                args.where = {
                    [Op.or]: {projectname : { [Op.like] : '%' + args.search + '%' },
                    email : { [Op.like] : '%' + args.search + '%' }}
                }
            }
            return models.projects.findAndCountAll(args).then( result => {
                return result;
            });
        }
    }
};

const modifProjectType = new GraphQLInputObjectType({
    name: 'modifProjectType',
    fields: attributeFields(models.projects, {only : ['short_name', 'title', 'description']})
});

const createProjectFunc  = {
    type: projectType,
    args: {
        input : {
            type : modifProjectType
        }
    },
    description: 'Create a new project',
    resolve: function(obj, {input}, context) {
        input.created_at = new Date();
        input.updated_at = new Date();
        return models.projects.create(input);
    }

};

const updateProjectFunc  = {
    type: projectType,
    args: {
        id : { type : new GraphQLNonNull(GraphQLInt) },
        input : { type : modifProjectType }
    },
    description: 'Update an existed project',
    resolve: function(obj, args) {
        return models.projects
            .findById(args.id)
            .then((quote) => {
                args.input.updated_at = new Date();
                return quote.update(args.input);
            });
    }

};

const deleteProjectFunc  = {
    type: projectType,
    args: {
        id : { type : new GraphQLNonNull(GraphQLInt) },
    },
    description: 'Update an existed project',
    resolve: function(obj, args) {
        return models.projects
            .findById(args.id)
            .then((quote) => {
                return quote.destroy();
            });
    }

};

const mutations = {
    createProject: createProjectFunc,
    updateProject: updateProjectFunc,
    deleteProject: deleteProjectFunc
};

module.exports =  {'queries' : queries , 'mutations' : mutations };
