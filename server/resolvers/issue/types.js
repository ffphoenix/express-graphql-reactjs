import {attributeFields} from 'graphql-sequelize';

import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLInt,
    GraphQLString,
    getNullableType,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';
import models from '../../models/index';

const cache = {};

export const issueTypeGet = attributeFields(models.issues, {cache: cache});

export const projectType = new GraphQLObjectType({
    name: 'IProject',
    fields: attributeFields(models.projects)
});

export const issueType = new GraphQLObjectType({
    name: 'Issue',
    description: 'A issue',
    fields: {
        ...issueTypeGet,
        project: {
            type: projectType
        }
    }
});

export const issueTypeWithRevision = new GraphQLObjectType({
    name: 'IssueWRev',
    description: 'A issue with revision',
    fields: {
        lastRevId : {
            type: GraphQLInt
        },
        object: {
            type: issueType
        }
    }
});

export const issueListType = new GraphQLObjectType({
    name: 'IssueList',
    fields: {
        rows: {
            type: new GraphQLList(issueType)
        },
        count: {
            type: GraphQLInt
        }
    }
});

export const boardType = new GraphQLObjectType({
    name : 'boardType',
    fields : {
        status: {
            type : GraphQLString
        },
        items: {
            type : new GraphQLList(issueType)
        }
    }
});

export const modifIssueType = new GraphQLInputObjectType({
    name: 'modifIssueType',
    fields: attributeFields(models.issues, {
        exclude: ['id', 'created_at', 'updated_at', 'deleted_at', 'created_user_id'],
        cache: cache
    })
});


export const boardChangeArgs = {
    ...attributeFields(models.issues, {only: ['id', 'status'], cache: cache}),
    nextId: {
        type: getNullableType(GraphQLInt)
    }
};


export const issueEditProcessType = new GraphQLInputObjectType({
    name: 'issueEditProcessType',
    description: 'Collaborate edit',
    fields: {
        row : {
            type : GraphQLString
        },
        result: {
            type: GraphQLString
        },
        revision : {
            type : GraphQLInt
        }
    }
});

export const issueProcessType = new GraphQLObjectType({
    name: 'issueProcessType',
    description: 'Collaborate edit',
    fields: {
        row : {
            type : GraphQLString
        },
        result: {
            type: GraphQLString
        },
        revision : {
            type : GraphQLInt
        }
    }
});

let updateAttiributes = attributeFields(models.issues, {
    exclude: ['id', 'created_at', 'updated_at', 'deleted_at', 'created_user_id'],
    cache: cache
});
updateAttiributes.description = {
    type : GraphQLJSON
}
export const updateType = new GraphQLInputObjectType({
    name: 'updateAttiributes',
    fields: {
        ...updateAttiributes
    }
});


export const changePositionType = new GraphQLObjectType({
    name: 'changeIssue',
    description: 'A issue',
    fields: {
        nextId : {
            type : GraphQLInt
        },
        issue: {
            type: issueType
        }
    }
});

export const userTypeOnline = new GraphQLObjectType({
    name: 'userTypeOnline',
    description: 'A user',
    fields: {
        ...attributeFields(models.users, {only : ['id', 'email', 'username']}),
        action : {
            type : GraphQLString
        }
    }
});

export const issueNewPatch = new GraphQLObjectType({
    name: 'issueNewPatch',
    fields: {
        id: {
            type: GraphQLInt
        },
        delta: {
            type: GraphQLJSON
        },
        hash: {
            type: GraphQLString
        },
        cursours: {
            type: GraphQLJSON
        }
    }
});
