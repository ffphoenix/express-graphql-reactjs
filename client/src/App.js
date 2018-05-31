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
import { ApolloLink } from 'apollo-client-preset';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink }      from 'apollo-link-http';
import { getOperationAST } from 'graphql';
import {SubscriptionClient} from 'subscriptions-transport-ws';

class App extends Component {

    render() {
        const AUTH_TOKEN = 'token-auth';

        const httpLink = new HttpLink({uri : `http://localhost:4000/graphql`});

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

        const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)
        const wsclient = new SubscriptionClient(`ws://localhost:4000/graphql`, {
            reconnect: true
        });
        const wsLink = new WebSocketLink(wsclient);

        const link = ApolloLink.split(
            operation => { // check if it is a subscription
                const operationAST = getOperationAST(operation.query, operation.operationName);
                return !!operationAST && operationAST.operation === 'subscription';
            },
            wsLink,
            httpLinkWithAuthToken
        );

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link : link
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
