import React from 'react';
// routesConfig.js
import LoginPage from 'pages/auth/LoginPage';
import RegisterPage from 'pages/auth/RegisterPage';
import UnauthorizedPage from 'pages/auth/UnauthorizedPage';
import ProductsPage from 'pages/products/ProductsPage';
import AddProductPage from 'pages/products/AddProductPage';
import ProductDetailsPage from 'pages/products/ProductDetailsPage';
import EditProductPage from 'pages/products/EditProductPage';
import TransactionsPage from 'pages/transactions/TransactionsPage';
import AddTransactionPage from 'pages/transactions/AddTransactionPage';
import EditTransactionPage from 'pages/transactions/EditTransactionPage';
import DashboardPage from 'pages/dashboard/DashboardPage';
import ProfilePage from 'pages/user/ProfilePage';
import UsersPage from 'pages/user/UsersPage';
import AddUserPage from 'pages/user/AddUserPage';
import EditUserPage from 'pages/user/EditUserPage';
import UserDetailsPage from 'pages/user/UserDetailsPage';

export const publicRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
];

export const routes = [
  { path: '/', element: <ProductsPage /> },
  { path: '/products', element: <ProductsPage /> },
  { path: '/products/add', element: <AddProductPage /> },
  { path: '/products/:id', element: <ProductDetailsPage /> },
  { path: '/products/edit/:id', element: <EditProductPage /> },
  { path: '/transactions', element: <TransactionsPage /> },
  { path: '/transactions/add', element: <AddTransactionPage /> },
  { path: '/transactions/edit/:id', element: <EditTransactionPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/users', element: <UsersPage />, roles: ['admin'] },
  { path: '/users/add', element: <AddUserPage />, roles: ['admin'] },
  { path: '/users/:id', element: <UserDetailsPage />, roles: ['admin'] },
  { path: '/users/edit/:id', element: <EditUserPage />, roles: ['admin'] },
];