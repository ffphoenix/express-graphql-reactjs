import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';
import userResolver from './user'

const schema = new GraphQLSchema({
    query: userResolver.queries,
    mutation: userResolver.mutations
});

module.exports = schema;