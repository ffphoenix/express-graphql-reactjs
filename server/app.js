import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { formatError as formatApolloError } from 'apollo-errors';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import schema from './resolvers';
import jwt from 'express-jwt';
import cors from 'cors';
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
            data : procErrors
        }
    }
    return formatApolloError(error)
};

const jwtCheck = jwt({ secret: '2fadsfdasfasd21312312' }).unless({path: ['/graphql', '/graphiql', '/login']}); // change out your secret for each environment
app.use(jwtCheck);
app.use(cors());

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ formatError, schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
});

// Start the server
const httpServer = app.listen(4000, () => {
    console.log('Go to http://localhost:4000/graphiql to run queries!');
});
//
SubscriptionServer.create(
    {schema: schema, execute, subscribe},
    {server: httpServer, path: '/graphql'},
)