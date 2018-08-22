import { userType } from '../user';
import {
    issueNewPatch,
    updateType,
    userTypeOnline,
} from './types';

import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString,
    getNullableType,
    GraphQLBoolean
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';
import { storage, pubsub } from "../../helpers/dataManagers";
import models from '../../models/index';


const queries = {
    issueUsersOnline: {
        type: new GraphQLList(userType),
        args: {
            id: {
                type: getNullableType(GraphQLInt)
            }
        },
        resolve: function (obj, args, context) {
            return storage.getUsersOnline(args.id);
        }
    }
};

const setUserOffline = {
    type: GraphQLBoolean,
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
    },
    description: 'set user offline',
    resolve: function (obj, args, context) {
        models.users.findById(context.user.id).then((user) => {
            storage.setUserOffline(args.id, user.get({raw:true}));
        });

        return true;
    }
};

const initIssueRevision = {
    type: GraphQLBoolean,
    args: {
        id : {
            type : GraphQLInt
        },
        input : {
            type : updateType
        }
    },
    description: 'initMutation',
    resolve: function (obj, args, context) {

        console.log('initMutation <-----', args);
        try {
            storage.setAsIs('issue' + args.id, args.input, context.user);
        } catch(err)  {
            return err;
        }
        return true;
    }
};

const onChangeIssue = {
    type: issueNewPatch,
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        input: {type: GraphQLJSON},
        hash: {type: GraphQLString},
        cursour : {type: GraphQLJSON}
    },
    description: 'Update an existed issue',
    resolve: function (obj, args, context) {
        const result = storage.set('issue' + args.id, args.input, context.user);
        let cursours = storage.get('cursours' + args.id, context.user);
        if (cursours !== undefined) {
            cursours = cursours.object;
        } else {
            cursours = {};
        }
        cursours[context.user.id] = args.cursour;
        console.log('cusorsss->>', cursours);
        storage.setAsIs('cursours' + args.id, cursours, context.user);
        pubsub.publish('issueOnChange', { id : result.lastRevId, delta : args.input, hash : args.hash, cursours : cursours });
        console.log('+===========Update',{ id : result.lastRevId, delta : args.input,  hash : args.hash, cursours : cursours } )
        return { id : result.lastRevId, delta : args.input, hash : args.hash, cursours : cursours } ;
    }
};

const mutations = {
    setUserOffline: setUserOffline,
    initIssueRevision: initIssueRevision,
    onChangeIssue : onChangeIssue
};

const subscription = {
    changeOnlineUser : {
        type: userTypeOnline,
        resolve: (payload) => {
            return {
                ...payload
            };
        },
        subscribe: () => pubsub.asyncIterator('changeOnlineUser')
    },
    issueOnChange : {
        type: issueNewPatch,
        resolve: (payload) => {
            return {
                ...payload
            };
        },
        subscribe: () => pubsub.asyncIterator('issueOnChange')
    },
};

module.exports = {'queries': queries, 'mutations': mutations, 'subscriptions': subscription};