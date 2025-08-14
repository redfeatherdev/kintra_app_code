import { lazy } from "react";

const Dashboard = lazy(() => import('../pages/Dashboard'));
const AccountOverview = lazy(() => import('../pages/AccountOverview'));
const Profile = lazy(() => import('../pages/Profile'));
const Demographics = lazy(() => import('../pages/Demographics'));
const Notifications = lazy(() => import('../pages/Notifications'));
const AdminManagement = lazy(() => import('../pages/AdminManagement'));

const coreRoutes = [
  {
    path: '/',
    component: Dashboard
  },
  {
    path: '/users',
    component: AccountOverview
  },
  {
    path: '/users/profile/:id',
    component: Profile
  },
  {
    path: "/demographics",
    component: Demographics
  },
  {
    path: '/notifications',
    component: Notifications
  },
  {
    path: '/admins',
    component: AdminManagement
  }
];

const routes = [...coreRoutes];
export default routes;