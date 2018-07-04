import React, {Component} from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';

import './App.css';
// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'

// Containers
import {DefaultLayout} from './containers';
// Pages
import {Page404, Page500, Register} from './views/Pages';
import Login from './components/login'
// Apollo
import ApolloClient from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { createHttpLink }      from 'apollo-link-http';
import { onError }      from 'apollo-link-error';
import { getOperationAST } from 'graphql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { AUTH_TOKEN } from './config';
import { Redirect } from 'react-router-dom';

class App extends Component {
    state = {
        hasError : false
    }
    render() {
        if (this.state.hasError) {
            return <Redirect to='/login'/>
        }

        let errorExits = false;
        const errorLink = onError(({networkError, graphQLErrors}) => {

            // console.log(response);
            // if (graphQLErrors) {
            //     console.log(`[graphQLErrors error]:`, graphQLErrors);
            // }

            // graphQLErrors.map(({ message, locations, path }) =>
            //     console.log(
            //         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            //     ),
            // );

            if (networkError) {
                this.setState({hasError : true})
                console.log(`[Network error]:`, networkError);
            }

        });

        let httpLink = createHttpLink({
            uri : `http://localhost:4000/graphql`,
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

        const wsclient = new SubscriptionClient(`ws://localhost:4000/graphql`, {
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

        return (
            <ApolloProvider client={client}>
                <HashRouter>
                    <Switch>
                        <Route exact path="/login" name="Login Page" component={Login}/>
                        <Route exact path="/register" name="Register Page" component={Register}/>
                        <Route exact path="/404" name="Page 404" component={Page404}/>
                        <Route exact path="/500" name="Page 500" component={Page500}/>
                        <Route path="/" name="Home" component={DefaultLayout}/>
                    </Switch>
                </HashRouter>
            </ApolloProvider>
        );
    }
}

export default App;
