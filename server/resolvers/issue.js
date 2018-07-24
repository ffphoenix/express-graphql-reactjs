import {resolver, attributeFields, JSONType} from 'graphql-sequelize';
import {Op} from 'sequelize';
import {PubSub} from 'graphql-subscriptions';
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

const pubsub = new PubSub();
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

const issueBoardType = new GraphQLObjectType({
    name: 'issueBoard',
    fields: {
        new: {
            type: new GraphQLList(issueType)
        },
        inprogress: {
            type: new GraphQLList(issueType)
        },
        reopen: {
            type: new GraphQLList(issueType)
        },
        feedback: {
            type: new GraphQLList(issueType)
        },
        testready: {
            type: new GraphQLList(issueType)
        },
        closed: {
            type: new GraphQLList(issueType)
        },
    }
});

const queries = {
    issue: {
        type: issueType,
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        resolve: resolver(models.issues)
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
        type: issueBoardType,
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
                let prepareBoardData = {
                    'new': [],
                    'inprogress': [],
                    'reopen': [],
                    'feedback': [],
                    'testready': [],
                    'closed': []
                };
                for (let i in result) {
                    if (prepareBoardData[result[i].status]) {
                        prepareBoardData[result[i].status].push(result[i]);
                    }
                }
                return prepareBoardData;
            });
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
            })

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
    updatePosition: updatePositionFunc
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
