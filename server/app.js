import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { formatError as formatApolloError, isInstance } from 'apollo-errors';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe, GraphQLError } from 'graphql';
import schema from './resolvers';
import jwt from 'express-jwt';
import authModule from './middlewares/auth';
import cors from 'cors';
import config from './config/config';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
// Initialize the app
const app = express();
const formatError = function (error) {
    const { originalError } = error;
    if (originalError !== undefined
        && originalError.name === 'SequelizeValidationError') {
        let procErrors = {};
        for (let i = 0; i < originalError.errors.length; i++) {
            let error = originalError.errors[i];
            if (!procErrors.hasOwnProperty(error.path)){
                procErrors[error.path] = {};
            }
            procErrors[error.path][error.validatorKey] = error.message
        }
        return {
            message : 'Bad input',
            data : procErrors,
        }
    }
    if (error instanceof GraphQLError) {
        return {
            message : error.message,
            data : []
        }
    }
    return formatApolloError(error)
};
const jwtCheck = jwt({ secret: config.jwt_secret }).unless({path: ['/api/login', 'graphiql']})
// app.use(jwtCheck);
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authModule);

// The GraphQL endpoint
// app.use('/graphql', bodyParser.json(), graphqlExpress({ formatError, schema }));
app.use('/graphql', bodyParser.json(), graphqlExpress(request => {
    return {
        schema: schema,
        context: {
            startTime: Date.now(),
            user : request.user,
            headers : request.rawHeaders
        },
        formatError
    };
    }
));

// GraphiQL, a visual editor for queries
app.use('/graphiql',
    graphiqlExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
}));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(formatApolloError({
            errors: {
                code : 'invalid_token',
                message : 'invalid token'
            }
        }));
    }
});
// Start the server
const httpServer = app.listen(4000, () => {
    console.log('Go to http://localhost:4000/graphiql to run queries!');
});
//
SubscriptionServer.create(
    { execute, subscribe, schema},
    {server: httpServer, path: '/subscriptions'},
)