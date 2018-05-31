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
    fields: attributeFields(models.users, {exclude : ['password']})
});

const queries = {
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
};

const modifUserType = new GraphQLInputObjectType({
    name: 'modifUserType',
    fields: attributeFields(models.users, {only : ['username', 'password', 'email']})
});

const createUserFunc  = {
    type: userType,
    args: {
        input : {
            type : modifUserType
        }
    },
    description: 'Create a new user',
    resolve: function(obj, {input}, context) {
        return bcrypt.hash(input.password, 10).then(function(hash) {
            if (input.password !== '' && input.password !== undefined)
                input.password = hash;
            input.created_at = new Date();
            input.updated_at = new Date();
            return models.users.create(input);
        });
    }

};

const updateUserFunc  = {
    type: userType,
    args: {
        id : { type : new GraphQLNonNull(GraphQLInt) },
        input : { type : modifUserType }
    },
    description: 'Update an existed user',
    resolve: function(obj, args) {
        return models.users
            .findById(args.id)
            .then((quote) => {
                args.input.password = quote.get('password');
                args.input.updated_at = new Date();
                return quote.update(args.input);
            });
    }

};

const deleteUserFunc  = {
    type: userType,
    args: {
        id : { type : new GraphQLNonNull(GraphQLInt) },
    },
    description: 'Update an existed user',
    resolve: function(obj, args) {
        return models.users
            .findById(args.id)
            .then((quote) => {
                return quote.destroy();
            });
    }

};

const mutations = {
    createUser: createUserFunc,
    updateUser: updateUserFunc,
    deleteUser: deleteUserFunc
};

module.exports =  {'queries' : queries , 'mutations' : mutations };
