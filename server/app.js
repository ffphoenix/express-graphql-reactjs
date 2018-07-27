import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import schema from './resolvers';
import jwt from 'express-jwt';
import authModule from './middlewares/auth';
import cors from 'cors';
import config from './config/config';
import { PubSub } from 'graphql-subscriptions';
import {errorHandle, authorizeErrorHandle} from "./middlewares/errorHandlers";
import path from 'path';
const pubsub = new PubSub();
// Initialize the app
const app = express();

const jwtCheck = jwt({ secret: config.jwt_secret }).unless({path: ['/api/login', 'graphiql']})
// app.use(jwtCheck);
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authModule);

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress(request => {
    return {
        schema: schema,
        context: {
            startTime: Date.now(),
            user : request.user,
            headers : request.rawHeaders
        },
        errorHandle
    };
    }
));

// GraphiQL, a visual editor for queries
app.use('/graphiql',
    graphiqlExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
}));

app.use(authorizeErrorHandle);
// Start the server
const httpServer = app.listen(4000, () => {
    console.log('Go to http://localhost:4000/graphiql to run queries!');
});
//
SubscriptionServer.create(
    { execute, subscribe, schema},
    {server: httpServer, path: '/subscriptions'},
)

export const fpath = path;
export default app;