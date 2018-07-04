import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';
import {queries as userQueries, mutations as userMutations} from './user'
import {queries as issueQueries, mutations as issueMutations} from './issue'
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
    })
});


module.exports = schema;