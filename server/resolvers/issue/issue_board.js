import {Op} from 'sequelize';
import {PubSub} from 'graphql-subscriptions';

import {
    issueType,
    boardType,
    boardChangeArgs,
    changePositionType
} from './types';

import {
    GraphQLList,
    GraphQLInt,
    GraphQLString,
    getNullableType,
} from 'graphql';

import models from '../../models/index';

const pubsub = new PubSub();

const queries = {
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

const mutations = {
    updatePosition: {
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
    },
};

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
};

module.exports = {'queries': queries, 'mutations': mutations, 'subscriptions': subscription};
