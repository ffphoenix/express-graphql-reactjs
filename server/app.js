import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import schema from './resolvers';
import jwt from 'express-jwt';

// Put together a schema
// const  = makeExecutableSchema({
//     userSchema,
//     userResolvers,
// });

// Initialize the app
const app = express();

// var isRevokedCallback = function(req, payload, done){
//     var issuer = payload.iss;
//     var tokenId = payload.jti;
//
//     data.getRevokedToken(issuer, tokenId, function(err, token){
//         if (err) { return done(err); }
//         return done(null, !!token);
//     });
// };
const jwtCheck = jwt({ secret: '2fadsfdasfasd21312312' }).unless({path: ['/graphql', '/graphiql', '/login']}); // change out your secret for each environment
app.use(jwtCheck);

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
});

// Start the server
app.listen(4000, () => {
    console.log('Go to http://localhost:4000/graphiql to run queries!');
});