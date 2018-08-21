import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';
import {queries as userQueries, mutations as userMutations, subscriptions as userSubscriptions} from './user'
import {queries as issueQueries, mutations as issueMutations, subscriptions as issueSubscriptions} from './issue/issue'
import {queries as issueBoardQueries, mutations as issueBoardMutations, subscriptions as issueBoardSubscriptions} from './issue/issue_board'
import {queries as issueCollabQueries, mutations as issueCollabMutations, subscriptions as issueCollabSubscriptions} from './issue/issue_collaborative'
import {queries as projectQueries, mutations as projectMutations} from './project'
import {queries as issueStatusesQueries, mutations as issueStatusesMutations, subscriptions as issuesStatusesSubscription} from './issue_statuses'

const schema = new GraphQLSchema({
    query : new GraphQLObjectType( {
        name : 'queries',
        fields : {
            ...projectQueries,
            ...userQueries,
            ...issueQueries,
            ...issueBoardQueries,
            ...issueCollabQueries,
            ...issueStatusesQueries
        }
    }),
    mutation : new GraphQLObjectType( {
        name : 'mutations',
        fields : {
            ...projectMutations,
            ...userMutations,
            ...issueMutations,
            ...issueBoardMutations,
            ...issueCollabMutations,
            ...issueStatusesMutations,
        }
    }),
    subscription : new GraphQLObjectType( {
        name : 'subscriptions',
        fields : {
            ...userSubscriptions,
            ...issueSubscriptions,
            ...issueBoardSubscriptions,
            ...issueCollabSubscriptions,
            ...issuesStatusesSubscription
        }
    })
});


module.exports = schema;