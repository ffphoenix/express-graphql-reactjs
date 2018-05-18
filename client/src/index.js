import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
    uri: "http://localhost:4000/graphql"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
