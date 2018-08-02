import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';
import {queries as userQueries, mutations as userMutations, subscriptions as userSubscriptions} from './user'
import {queries as issueQueries, mutations as issueMutations, subscriptions as issueSubscriptions} from './issue'
import {queries as projectQueries, mutations as projectMutations} from './project'
import {queries as issueStatusesQueries, mutations as issueStatusesMutations, subscriptions as issuesStatusesSubscription} from './issue_statuses'

const schema = new GraphQLSchema({
    query : new GraphQLObjectType( {
        name : 'queries',
        fields : {
            ...projectQueries,
            ...userQueries,
            ...issueQueries,
            ...issueStatusesQueries
        }
    }),
    mutation : new GraphQLObjectType( {
        name : 'mutations',
        fields : {
            ...projectMutations,
            ...userMutations,
            ...issueMutations,
            ...issueStatusesMutations,
        }
    }),
    subscription : new GraphQLObjectType( {
        name : 'subscriptions',
        fields : {
            ...userSubscriptions,
            ...issueSubscriptions,
            ...issuesStatusesSubscription
        }
    })
});


module.exports = schema;