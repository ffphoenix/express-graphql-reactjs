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

const errorLink = onError(({networkError, graphQLErrors}) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
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
    uri : `http://young-oasis-54384.herokuapp.com/graphql`,
    // fetch : customFetch
});


const middlewareAuthLink = new ApolloLink((operation, forward) => {
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


const wsclient = new SubscriptionClient(`ws://young-oasis-54384.herokuapp.com/subscriptions`, {
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
