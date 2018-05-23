import {resolver, attributeFields} from 'graphql-sequelize';
import bcrypt from 'bcrypt';
import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString,
} from 'graphql';

import models from '../models';

const userType = new GraphQLObjectType({
    name: 'User',
    description: 'A user',
    fields: attributeFields(models.users)
});

const queries = new GraphQLObjectType({
    name: 'UserQuery',
    fields: {
        user: {
            type: userType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: resolver(models.users)
        },
        users: {
            type: new GraphQLList(userType),
            args: {
                limit: {
                    type: GraphQLInt
                },
                order: {
                    type: GraphQLString
                }
            },
            resolve: resolver(models.users)
        }
    }
});

const createUserType = new GraphQLInputObjectType({
    name: 'createUserType',
    fields: {
        name: {
            description: 'A username for the user',
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

const mutations = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: userType,
            args: {
                input : {
                    type : createUserType
                }
            },
            description: 'Creates a new user',
            resolve: function(obj, {input}) {
                return bcrypt.hash(input.password, 10).then(function(hash) {
                    return models.users.create({
                        name: input.name,
                        password: hash,
                        email: input.email,
                    });
                });
            }

        },
    }
});

module.exports =  {'queries' : queries , 'mutations' : mutations };
