import React from 'react';
import Loadable from 'react-loadable'
import DefaultLayout from './containers/DefaultLayout';
import {Grid as UserList, Create as UserCreate, Update as UserUpdate} from './components/user'

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import('./views/Dashboard'),
  loading: Loading,
});

// const UserList = Loadable({
//   loader: () => import('./components/user/User'),
//   loading: Loading,
// });

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/users/create', name: 'UserCreate', component: UserCreate },
  { path: '/users/update/:id', name: 'UserUpdate', component: UserUpdate },
  { path: '/users', name: 'Users', component: UserList },


];

export default routes;
