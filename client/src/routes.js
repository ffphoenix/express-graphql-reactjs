import React from 'react';
import { ApolloProvider } from "react-apollo";
import Loadable from 'react-loadable'
import DefaultLayout from './containers/DefaultLayout';
import ApolloClient from './utils/ApolloClient';
import { Redirect, Route, Switch } from 'react-router-dom';
import {Grid as UserList, Create as UserCreate, Update as UserUpdate} from './components/user'
import {Grid as ProjectList, Create as ProjectCreate, Update as ProjectUpdate} from './components/projects'
import {Grid as IssuetList, Create as IssueCreate, Update as IssueUpdate} from './components/issue'
import ProjectBoard from './components/projectBoard'
import {AUTH_TOKEN} from "./config";

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
    { path: '/users/create', name: 'Create', component: UserCreate },
    { path: '/users/update/:id', name: 'Update', component: UserUpdate },
    { path: '/users', name: 'Users', component: UserList },
    { path: '/projects/create', name: 'Create', component: ProjectCreate },
    { path: '/projects/update/:id', name: 'Update', component: ProjectUpdate },
    { path: '/projects', name: 'Projects', component: ProjectList },
    { path: '/issues/create', name: 'Create', component: IssueCreate },
    { path: '/issues/update/:id', name: 'Update', component: IssueUpdate },
    { path: '/issues', name: 'Issues', component: IssuetList },
    { path: '/project-board', name: 'Project Board', component: ProjectBoard },

];

export default routes;

export function PrivateRoutes ({props}) {
    const token = localStorage.getItem(AUTH_TOKEN);

    if (token === null || token === undefined) {
        return (<Redirect to={{pathname: '/login', state: {from: props.location}}} />);
    }

    let routesSwitch = [];
    for (let key in routes)  {
        let route = routes[key];

        if (route.component !== undefined) {
            routesSwitch.push(
                <Route key={key}
                       path={route.path}
                       exact={route.exact}
                       name={route.name}
                       render={ props => (
                           <route.component {...props} />
                       )}/>)
        }
    }
    return (<ApolloProvider client={ApolloClient}><Switch >{routesSwitch}</Switch></ApolloProvider>)
}

