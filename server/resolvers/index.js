import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';
import {queries as userQueries, mutations as userMutations} from './user'
import {queries as issueQueries, mutations as issueMutations} from './issue'

const schema = new GraphQLSchema({
    query : new GraphQLObjectType( {
        name : 'queries',
        fields : {
            ...userQueries,
            ...issueQueries
        }
    }),
    mutation : new GraphQLObjectType( {
        name : 'mutations',
        fields : {
            ...userMutations,
            ...issueMutations
        }
    })
});


module.exports = schema;