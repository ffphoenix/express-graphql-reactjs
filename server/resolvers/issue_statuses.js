import {resolver, attributeFields, JSONType} from 'graphql-sequelize';
import { PubSub } from 'graphql-subscriptions';
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

const pubsub = new PubSub();
const issueStatusType = new GraphQLObjectType({
    name: 'IssueStatus',
    description: 'A issueStatus',
    fields: attributeFields(models.issue_statuses)
});

const issueStatusListType = new GraphQLObjectType({
    name: 'IssueStatusList',
    fields : {
        rows:  {
            type : new GraphQLList(issueStatusType)
        },
        count:  {
            type : GraphQLInt
        }
    }
});

const queries = {
    issueStatus: {
        type: issueStatusType,
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        resolve: resolver(models.issue_statuses)
    },
    issueStatuses: {
        type: issueStatusListType,
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
                    [Op.or]: {issueStatusname : { [Op.like] : '%' + args.search + '%' },
                    email : { [Op.like] : '%' + args.search + '%' }}
                }
            }
            return models.issue_statuses.findAndCountAll(args).then( result => {
                return result;
            });
        }
    }
};

const modifIssueStatusType = new GraphQLInputObjectType({
    name: 'modifIssueStatusType',
    fields: attributeFields(models.issue_statuses, {only : ['title']})
});
const updateIssueStatusType = new GraphQLInputObjectType({
    name: 'updateIssueStatusType',
    fields: {
        order : {
            type : getNullableType(GraphQLInt)
        },
        title : {
            type : GraphQLString
        }
    }
});

const createIssueStatusFunc  = {
    type: issueStatusType,
    args: {
        input : {
            type : modifIssueStatusType
        }
    },
    description: 'Create a new issueStatus',
    resolve: function(obj, {input}, context) {
        input.created_at = new Date();
        input.updated_at = new Date();
        const result = models.issue_statuses.create(input);
        result.then(data => {
            pubsub.publish('issueStatusAdded', data.get({plain : true}));
        });
        return result;
    }
};

const updateIssueStatusFunc  = {
    type: issueStatusType,
    args: {
        id : { type : new GraphQLNonNull(GraphQLInt) },
        input : { type : updateIssueStatusType }
    },
    description: 'Update an existed issueStatus',
    resolve: function(obj, args) {
        return models.issue_statuses
            .findById(args.id)
            .then((quote) => {
                args.input.updated_at = new Date();

                return quote.update(args.input).then(quote => {
                    pubsub.publish('issueStatusEdited', quote.get({raw : true}));
                    return quote;
                });
            });
    }

};

const deleteIssueStatusFunc  = {
    type: issueStatusType,
    args: {
        id : { type : new GraphQLNonNull(GraphQLInt) },
    },
    description: 'Update an existed issueStatus',
    resolve: function(obj, args) {
        return models.issue_statuses
            .findById(args.id)
            .then((quote) => {
                return quote.destroy();
            });
    }
};

const mutations = {
    createIssueStatus: createIssueStatusFunc,
    updateIssueStatus: updateIssueStatusFunc,
    deleteIssueStatus: deleteIssueStatusFunc
};

const subscription = {
    issueStatusAdded: {
        type: issueStatusType,
        resolve: (payload) => { return { ...payload}; },
        subscribe: () => pubsub.asyncIterator('issueStatusAdded')
    },
    issueStatusEdited: {
        type: issueStatusType,
        resolve: (payload) => { return { ...payload}; },
        subscribe: () => pubsub.asyncIterator('issueStatusEdited')
    },
};

module.exports =  {'queries' : queries , 'mutations' : mutations, 'subscriptions' : subscription  };
