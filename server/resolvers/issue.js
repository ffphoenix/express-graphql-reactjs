import {attributeFields, JSONType} from 'graphql-sequelize';
import {Op} from 'sequelize';
import {PubSub} from 'graphql-subscriptions';
import revisionsManager from "../revisionsManager";
import { userType } from  './user';
import * as j from 'jsondiffpatch';

import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString,
    getNullableType,
    GraphQLBoolean
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import models from '../models';

const pubsub = new PubSub();
const storage = new revisionsManager(pubsub);

let cache = {};

const issueTypeGet = attributeFields(models.issues, {cache: cache});

const projectType = new GraphQLObjectType({
    name: 'IProject',
    fields: attributeFields(models.projects)
});

const issueType = new GraphQLObjectType({
    name: 'Issue',
    description: 'A issue',
    fields: {
        ...issueTypeGet,
        project: {
            type: projectType
        }
    }
});

const issueTypeWithRevision = new GraphQLObjectType({
    name: 'IssueWRev',
    description: 'A issue with revision',
    fields: {
        lastRevId : {
            type: GraphQLInt
        },
        object: {
            type: issueType
        }
    }
});

const issueListType = new GraphQLObjectType({
    name: 'IssueList',
    fields: {
        rows: {
            type: new GraphQLList(issueType)
        },
        count: {
            type: GraphQLInt
        }
    }
});

const boardType = new GraphQLObjectType({
    name : 'boardType',
    fields : {
        status: {
            type : GraphQLString
        },
        items: {
            type : new GraphQLList(issueType)
        }
    }
});

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
    issuesBoard: {
        type: new GraphQLList(boardType),
        args: {
            project_id: {
                type: getNullableType(GraphQLInt)
            },
            search: {
                type: getNullableType(GraphQLString)
            }
        },
        resolve: function (obj, args, context) {
            args.order = [['order' , 'DESC']];
            if (args.search !== undefined && args.search !== '') {
                args.where = {
                    [Op.or]: {
                        title: {[Op.like]: '%' + args.search + '%'},
                        description: {[Op.like]: '%' + args.search + '%'}
                    }
                }
            }
            // args.raw = true;
            args.include = [{model: models.projects, as: "project"}];
            return models.issues.findAll(args).then(result => {
                let prepareBoardData = [];
                for (let i in result) {
                    if (prepareBoardData[result[i].status] === undefined) {
                        prepareBoardData[result[i].status] = {
                            status : result[i].status,
                            items : []
                        };
                    }
                    if (prepareBoardData[result[i].status]) {
                        prepareBoardData[result[i].status].items.push(result[i]);
                    }
                }

                return prepareBoardData;
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

const modifIssueType = new GraphQLInputObjectType({
    name: 'modifIssueType',
    fields: attributeFields(models.issues, {
        exclude: ['id', 'created_at', 'updated_at', 'deleted_at', 'created_user_id'],
        cache: cache
    })
});

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

const boardChangeArgs = {
    ...attributeFields(models.issues, {only: ['id', 'status'], cache: cache}),
    nextId: {
        type: getNullableType(GraphQLInt)
    }
};

const changeIssueOrder = (issue, nextId) => {
    const query = 'UPDATE issues SET `order` = `order` + 1  WHERE `order` > $order AND project_id = $project_id AND status = $status';
    return models.sequelize.query(
        query,
        {bind: {order: issue.order, project_id: issue.project_id, status: issue.status}}
    ).then(result => {
        pubsub.publish('issuePositionChanged', {issue : issue.get({raw: true}), nextId : nextId });
        return issue.save();
    });
};

const updatePositionFunc = {
    type: issueType,
    args: {
        ...boardChangeArgs
    },
    description: 'Update an issue position',
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
                        })
                }
                quote.order = 0;
                pubsub.publish('issuePositionChanged', {issue : quote.get({raw: true}), nextId : nextId });
                return quote.save();
            });
    }
};

const issueEditProcessType = new GraphQLInputObjectType({
    name: 'issueEditProcessType',
    description: 'Collaborate edit',
    fields: {
        row : {
            type : GraphQLString
        },
        result: {
            type: GraphQLString
        },
        revision : {
            type : GraphQLInt
        }
    }
});

const issueProcessType = new GraphQLObjectType({
    name: 'issueProcessType',
    description: 'Collaborate edit',
    fields: {
        row : {
            type : GraphQLString
        },
        result: {
            type: GraphQLString
        },
        revision : {
            type : GraphQLInt
        }
    }
});

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

let updateAttiributes = attributeFields(models.issues, {
    exclude: ['id', 'created_at', 'updated_at', 'deleted_at', 'created_user_id'],
    cache: cache
});
updateAttiributes.description = {
    type : GraphQLJSON
}
const updateType = new GraphQLInputObjectType({
    name: 'updateAttiributes',
    fields: {
        ...updateAttiributes
    }
});

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

const issueNewPatch = new GraphQLObjectType({
    name: 'issueNewPatch',
    fields: {
        id: {
            type: GraphQLInt
        },
        delta: {
            type: GraphQLJSON
        },
        hash: {
            type: GraphQLString
        }
    }
});

const onChangeIssue = {
    type: issueNewPatch,
    args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        input: {type: GraphQLJSON},
        hash: {type: GraphQLString}
    },
    description: 'Update an existed issue',
    resolve: function (obj, args, context) {
        const result = storage.set('issue' + args.id, args.input, context.user);
        pubsub.publish('issueOnChange', { id : result.lastRevId, delta : args.input, hash : args.hash });
        console.log('+===========Update',{ id : result.lastRevId, delta : args.input,  hash : args.hash } )
        return { id : result.lastRevId, delta : args.input, hash : args.hash } ;
    }
};


const mutations = {
    createIssue: createIssueFunc,
    updateIssue: updateIssueFunc,
    deleteIssue: deleteIssueFunc,
    updatePosition: updatePositionFunc,
    editProcess: editProcess,
    setUserOffline: setUserOffline,
    initIssueRevision: initIssueRevision,
    onChangeIssue : onChangeIssue
};

const changePositionType = new GraphQLObjectType({
    name: 'changeIssue',
    description: 'A issue',
    fields: {
        nextId : {
            type : GraphQLInt
        },
        issue: {
            type: issueType
        }
    }
});

const userTypeOnline = new GraphQLObjectType({
    name: 'userTypeOnline',
    description: 'A user',
    fields: {
        ...attributeFields(models.users, {only : ['id', 'email', 'username']}),
        action : {
            type : GraphQLString
        }
    }
});

const subscription = {
    issuePositionChanged: {
        type: changePositionType,
        resolve: (payload) => {
            return {
                ...payload
            };
        },
        subscribe: () => pubsub.asyncIterator('issuePositionChanged')
    },
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
