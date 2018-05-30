import React from 'react';
import Loadable from 'react-loadable'
import DefaultLayout from './containers/DefaultLayout';
import UserList from './components/user/UserList'
import UserCreate from "./components/user/UserCreate";
import UserUpdate from "./components/user/UserUpdate";

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
  { path: '/users/update/:id', name: 'UserCreate', component: UserUpdate },
  { path: '/users', name: 'Users', component: UserList },

];

export default routes;
