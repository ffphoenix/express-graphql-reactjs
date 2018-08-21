import { Op } from 'sequelize';
import { PubSub } from 'graphql-subscriptions';
import revisionsManager from "../../revisionsManager/index";
import { userType } from '../user';

import {
    issueType,
    issueEditProcessType,
    issueListType,
    issueProcessType,
    issueTypeWithRevision,
    modifIssueType,
} from './types';

import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString,
    getNullableType,
    GraphQLBoolean
} from 'graphql';

import models from '../../models/index';

const pubsub = new PubSub();
const storage = new revisionsManager(pubsub);

const queries = {
    issue: {
        type: issueTypeWithRevision,
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            collaborative: {
                type: getNullableType(GraphQLBoolean)
            }
        },
        resolve: async function (obj, args, context) {
            if (args.collaborative === undefined || !args.collaborative) {
                return models.issues.findById(args.id, {include : [{model: models.projects, as: "project"}]});
            } else {
                const key = 'issue' + args.id;
                var user = context.user;

                let issue = storage.get(key, user);
                if (issue !== undefined) {
                    issue.object.description = JSON.stringify(issue.object.description);
                    return issue;
                } else {
                    return models.issues.findById(args.id, {include : [{model: models.projects, as: "project"}]}).then((quote) => {
                        let value = quote.get({raw : true});
                        value.project = value.project.get({raw: true});
                        storage.set(key, value, user);
                        return {
                            lastRevId : 0,
                            object : value
                        };
                    });
                }
                return ;
            }

        }
    },
    issues: {
        type: issueListType,
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
        resolve: function (obj, args, context) {
            args.order = [args.order.split(' ')];
            if (args.search !== undefined && args.search !== '') {
                args.where = {
                    [Op.or]: {
                        title: {[Op.like]: '%' + args.search + '%'},
                        description: {[Op.like]: '%' + args.search + '%'}
                    }
                }
            }
            return models.issues.findAndCountAll(args).then(result => {
                return result;
            });
        }
    },
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

const createIssueFunc = {
    type: issueType,
    args: {
        input: {
            type: modifIssueType
        }
    },
    description: 'Create a new issue',
    resolve: function (obj, {input}, context) {
        input.created_at = new Date();
        input.updated_at = new Date();
        input.created_user_id = context.user.id;

        return models.issues.create(input).then((quote) => {
            quote.order = quote.id;
            models.issues.findById(quote.id, {include : [{model: models.projects, as: "project"}]}).then((quote) => {
                pubsub.publish('issueCreated', quote.get({plain: true}));
            });

            return quote.save();
        });
    }

};

const updateIssueFunc = {
    type: issueType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        input: {type: modifIssueType}
    },
    description: 'Update an existed issue',
    resolve: function (obj, args) {
        return models.issues
            .findById(args.id, {include : [{model: models.projects, as: "project"}]})
            .then((quote) => {
                args.input.updated_at = new Date();

                return quote.update(args.input).then((quote) => {
                    pubsub.publish('issueEdited', quote.get({plain: true}));
                    return quote;
                });
            });
    }
};

const editProcess = {
    type: issueProcessType,
    args: {
        id : {
            type : GraphQLInt
        },
        input : {
            type : issueEditProcessType
        }
    },
    description: 'Update an issue row',
    resolve: function (obj, {id, nextId, status}) {
        return models.issues
            .findById(id)
            .then((quote) => {
                quote.status = status;
                quote.updated_at = new Date();
                if (nextId !== null) {
                    return models.issues
                        .findById(nextId).then(nextQuote => {
                            quote.order = nextQuote.order + 1;
                            return changeIssueOrder(quote, nextId);
                        });
                }
                quote.order = 0;
                pubsub.publish('editProcess', { issue : quote.get({raw: true}), nextId : nextId });
                return quote.save();
            });
    }
};

const deleteIssueFunc = {
    type: issueType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
    },
    description: 'Update an existed issue',
    resolve: function (obj, args) {
        return models.issues
            .findById(args.id)
            .then((quote) => {
                return quote.destroy();
            });
    }
};

const mutations = {
    createIssue: createIssueFunc,
    updateIssue: updateIssueFunc,
    deleteIssue: deleteIssueFunc,
    editProcess: editProcess
};

const subscription = {
    issueEdited: {
        type: issueType,
        resolve: (payload) => {
            return {
                ...payload
            };
        },
        subscribe: () => pubsub.asyncIterator('issueEdited')
    },
    issueEditProcess: {
        type: issueProcessType,
        resolve: (payload) => {
            return {
                ...payload
            };
        },
        subscribe: () => pubsub.asyncIterator('issueEditProcess')
    },
    issueCreated: {
        type: issueType,
        resolve: (payload) => {
            return {
                ...payload
            };
        },
        subscribe: () => pubsub.asyncIterator('issueCreated')
    },
    issueCreated: {
        type: issueType,
        resolve: (payload) => {
            return {
                ...payload
            };
        },
        subscribe: () => pubsub.asyncIterator('issueCreated')
    },
};

module.exports = {'queries': queries, 'mutations': mutations, 'subscriptions': subscription};
