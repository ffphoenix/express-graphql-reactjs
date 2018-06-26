import {resolver, attributeFields, JSONType} from 'graphql-sequelize';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString,
    getNullableType

} from 'graphql';

import models from '../models';

const userType = new GraphQLObjectType({
    name: 'User',
    description: 'A user',
    fields: attributeFields(models.users, {exclude : ['password']})
});

const userListType = new GraphQLObjectType({
    name: 'UserList',
    fields : {
        rows:  {
            type : new GraphQLList(userType)
        },
        count:  {
            type : GraphQLInt
        }
    }
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
        type: userListType,
        args: {
            limit: {
                type: getNullableType(GraphQLInt)
            },
            order: {
                type: getNullableType(GraphQLString)
            },
            offset: {
                type: getNullableType(GraphQLInt)
            },
            search: {
                type: getNullableType(GraphQLString)
            }
        },
        resolve: function(obj, args, context) {
            args.order = [args.order.split(' ')];
            if (args.search !== undefined && args.search !== '') {
                args.where = {
                    [Op.or]: {username : { [Op.like] : '%' + args.search + '%' },
                    email : { [Op.like] : '%' + args.search + '%' }}
                }
            }
            return models.users.findAndCountAll(args).then( result => {
                return result;
            });
        }
    }
};

const modifUserType = new GraphQLInputObjectType({
    name: 'modifUserType',
    fields: attributeFields(models.users, {only : ['username', 'password', 'email']})
});
const updateUserType = new GraphQLInputObjectType({
    name: 'updateUserType',
    fields: attributeFields(models.users, {only : ['username', 'email']})
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
        console.log(context);
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
        input : { type : updateUserType }
    },
    description: 'Update an existed user',
    resolve: function(obj, args) {
        return models.users
            .findById(args.id)
            .then((quote) => {
                args.input.password = quote.get('password');
                // if (args.input.password !== '' && args.input.password !== undefined)
                //     args.input.password = hash;
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
