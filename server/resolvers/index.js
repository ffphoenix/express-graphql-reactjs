import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';
import {queries as userQueries, mutations as userMutations, subscriptions as userSubscriptions} from './user'
import {queries as issueQueries, mutations as issueMutations, subscriptions as issueSubscriptions} from './issue'
import {queries as projectQueries, mutations as projectMutations} from './project'

const schema = new GraphQLSchema({
    query : new GraphQLObjectType( {
        name : 'queries',
        fields : {
            ...projectQueries,
            ...userQueries,
            ...issueQueries
        }
    }),
    mutation : new GraphQLObjectType( {
        name : 'mutations',
        fields : {
            ...projectMutations,
            ...userMutations,
            ...issueMutations
        }
    }),
    subscription : new GraphQLObjectType( {
        name : 'subscriptions',
        fields : {
            ...userSubscriptions,
            ...issueSubscriptions,
        }
    })
});


module.exports = schema;