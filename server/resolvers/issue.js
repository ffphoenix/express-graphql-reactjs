import {resolver, attributeFields} from 'graphql-sequelize';
import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString,
} from 'graphql';
import models from '../models';

const issueType = new GraphQLObjectType({
    name: 'Issue',
    description: 'A issue',
    fields: attributeFields(models.issue)
});

const queries = {
    issue: {
        type: issueType,
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        resolve: resolver(models.issue)
    },
    issue: {
        type: new GraphQLList(issueType),
        args: {
            limit: {
                type: GraphQLInt
            },
            order: {
                type: GraphQLString
            }
        },
        resolve: resolver(models.issue)
    }
};

const modifIssueType = new GraphQLInputObjectType({
    name: 'modifIssueType',
    fields: attributeFields(models.issue, {only : ['title', 'description']})
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
        return models.issue.create(input);
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
        return models.issue
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
        return models.issue
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
