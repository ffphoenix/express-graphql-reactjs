import {resolver, attributeFields, JSONType} from 'graphql-sequelize';
import { Op } from 'sequelize';
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
let cache = {};
const issueType = new GraphQLObjectType({
    name: 'Issue',
    description: 'A issue',
    fields: attributeFields(models.issues, {cache: cache})
});
const issueListType = new GraphQLObjectType({
    name: 'IssueList',
    fields : {
        rows:  {
            type : new GraphQLList(issueType)
        },
        count:  {
            type : GraphQLInt
        }
    }
});

const queries = {
    issue: {
        type: issueType,
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        resolve: resolver(models.issues)
    },
    issues: {
        type: issueListType,
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
                    [Op.or]: {title : { [Op.like] : '%' + args.search + '%' },
                        description : { [Op.like] : '%' + args.search + '%' }}
                }
            }
            return models.issues.findAndCountAll(args).then( result => {
                return result;
            });
        }
    }

};
const modifIssueType = new GraphQLInputObjectType({
    name: 'modifIssueType',
    fields: attributeFields(models.issues, {exclude : ['created_at', 'updated_at', 'deleted_at', 'created_user_id'], cache: cache})
});


const createIssueFunc  = {
    type: issueType,
    args: {
        input : {
            type : modifIssueType
        }
    },
    description: 'Create a new issue',
    resolve: function(obj, {input}, context) {
        input.created_at = new Date();
        input.updated_at = new Date();
        return models.issues.create(input);
    }

};

const updateIssueFunc  = {
    type: issueType,
    args: {
        id : { type : new GraphQLNonNull(GraphQLInt) },
        input : { type : modifIssueType }
    },
    description: 'Update an existed issue',
    resolve: function(obj, args) {
        return models.issues
            .findById(args.id)
            .then((quote) => {
                args.input.updated_at = new Date();
                return quote.update(args.input);
            });
    }

};

const deleteIssueFunc  = {
    type: issueType,
    args: {
        id : { type : new GraphQLNonNull(GraphQLInt) },
    },
    description: 'Update an existed issue',
    resolve: function(obj, args) {
        return models.issues
            .findById(args.id)
            .then((quote) => {
                return quote.destroy();
            });
    }

};

const mutations = {
    createIssue: createIssueFunc,
    updateIssue: updateIssueFunc,
    deleteIssue: deleteIssueFunc
};

module.exports =  {'queries' : queries , 'mutations' : mutations };
