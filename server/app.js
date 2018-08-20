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
import unless from "express-unless";
import url from 'url';

const pubsub = new PubSub();
// Initialize the app
const app = express();
let statics = express.static(path.join(__dirname, '/client/build'));
statics.unless = unless;

// Constants configuration
const port = process.env.SERVER_BASE_PORT || 4000;
const host = process.env.SERVER_BASE_URL || 'http://localhost';
const socketHost = process.env.SERVER_BASE_SOCKET_URL || 'ws://localhost';

// const jwtCheck = jwt({ secret: config.jwt_secret }).unless({path: ['/api/login', 'graphiql', '/', '/static/*']})
const jwtCheck = jwt({ secret: config.jwt_secret }).unless(function (req, res, next) {
    const regexCases = [
        /\/api\/login.*/g,
        /\/graphiql.*/g,
        /\/static.*/g,
        /\.*\.jpg/g,
        /\.*\.html/g,
        /\.*\.css/g,
        /\.*\.js/g,
        /\.*\.ico/g,
    ];

    for (let i in regexCases) {
        if (regexCases[i].exec(req.originalUrl)) {
            return true;
        }
    }

    if (req.headers.referer === host + ':' + port + '/graphiql') {
        return true;
    }

    return false;
});

app.use(jwtCheck);
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
        subscriptionsEndpoint: `${socketHost}:${port}/subscriptions`
}));

app.use(authorizeErrorHandle);
// Start the server

const httpServer = app.listen(port, () => {
    console.log(`Go to ${host}:${port}/graphiql to run queries!`);
});

SubscriptionServer.create(
    { execute, subscribe, schema},
    {server: httpServer, path: '/subscriptions'},
)

export const fpath = path;
export default app;