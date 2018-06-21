import React from 'react';
import Loadable from 'react-loadable'
import DefaultLayout from './containers/DefaultLayout';
import { Redirect, Route, Switch } from 'react-router-dom';
import {Grid as UserList, Create as UserCreate, Update as UserUpdate} from './components/user'

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import('./views/Dashboard'),
  loading: Loading,
});

const routes = [
    { path: '/', exact: true, name: 'Home', component: DefaultLayout, authorize: ['user', 'admin'] },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, authorize: ['user', 'admin'] },
    { path: '/users/create', name: 'UserCreate', component: UserCreate },
    { path: '/users/update/:id', name: 'UserUpdate', component: UserUpdate },
    { path: '/users', name: 'Users', component: UserList },

];

export default routes;

export function PrivateRoutes ({props}) {
    let authed = true;
    let routesSwitch = [];

    if (authed === false) {
        return (<Redirect to={{pathname: '/login', state: {from: props.location}}} />);
    }

    console.log(localStorage.getItem('token-auth'));
    for (let key in routes) {
        let route = routes[key];
        routesSwitch.push(<Route key={key} path={route.path} exact={route.exact} name={route.name} render={props => (
            <route.component {...props} />
        )} />)
    }
    return (<Switch>{routesSwitch}</Switch>)
}

