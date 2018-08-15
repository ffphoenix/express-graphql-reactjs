import ApolloClient from "apollo-client";
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { createHttpLink }      from 'apollo-link-http';
import { onError }      from 'apollo-link-error';
import { getOperationAST } from 'graphql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { AUTH_TOKEN } from '../config';
import history from '../utils/history'
const basePORT = (window.location.hostname === 'localhost') ?  ':4000' : '';
const baseURL = (window.location.protocol === 'https:') ? 'https://' + window.location.hostname : 'http://' + window.location.hostname ;
const socketBaseURL = (window.location.protocol === 'https:') ? 'wss://' + window.location.hostname : 'ws://' + window.location.hostname;

const errorLink = onError(({networkError, graphQLErrors}) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: `,locations, `, Path: ${path}`,
            ),
        );
    }
    else if (networkError) {
        localStorage.clear();
        history.push('#/login');
        console.log(`[Network error]:`, networkError);
    }

});

const customFetch = (uri, options) => {

    // Create initial fetch, this is what would normally be executed in the link without the override
    var initialRequest = fetch(uri, options)
    return initialRequest.then((response) => {
        return (response.json())
    }).then((json) => {

    }).catch(response => {
        console.log(response);
    });
}
let httpLink = createHttpLink({
    uri : `${baseURL}${basePORT}/graphql`,
    // fetch : customFetch
});


const middlewareAuthLink = new ApolloLink((operation, forward) => {
    console.log(operation);
    const token = localStorage.getItem(AUTH_TOKEN);
    const authorizationHeader = token ? `Bearer ${token}` : null
    operation.setContext({
        headers: {
            authorization: authorizationHeader,
        },
    });
    return forward(operation)
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);


const wsclient = new SubscriptionClient(`${socketBaseURL}${basePORT}/subscriptions`, {
    reconnect: true
});
const wsLink = new WebSocketLink(wsclient);

let link = ApolloLink.split(
    operation => { // check if it is a subscription
        const operationAST = getOperationAST(operation.query, operation.operationName);
        return !!operationAST && operationAST.operation === 'subscription';
    },
    wsLink,
    httpLinkWithAuthToken
);

link = errorLink.concat(link);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    errorPolicy: 'all'
});

export default client;
