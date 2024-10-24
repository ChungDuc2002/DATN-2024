import React from 'react';
import DefaultLayout from '../Layouts/DefaultLayout';
import ForgotPassword from '../Pages/ForgotPassword';
import AdminLayout from '../Layouts/AdminLayout';
import ManagerProduct from '../Pages/Admin/Products/ManagerProducts';
import ManagerOrder from '../Pages/Admin/Products/MangerOrder';
import ManagerUsers from '../Pages/Admin/ManagerUser';
import ManagerBanner from '../Pages/Admin/Trang-Chu/ManagerBanner';
import Login from '../Pages/Login';
import ContactPage from '../Pages/Contact';
import AboutPage from '../Pages/About';
import ProfilePage from '../Pages/Profile';
import InformationProfile from '../Pages/Profile/information';
import OrderPage from '../Pages/Profile/order';
import Register from '../Pages/Register';
import HomePage from '../Pages/Home';
import NotFound from '../Pages/NotFound';
import Test from '../Pages/test';
import BookPage from './../Pages/Admin/Products/Books';
import FashionPage from './../Pages/Admin/Products/Fashion';
import ElectronicsPage from './../Pages/Admin/Products/Electronics';
import ManagerContact from '../Pages/Admin/Trang-Chu/ManagerContact';

const InitRouter = [
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/profile',
        element: <InformationProfile />,
      },
      {
        path: '/profile',
        element: <OrderPage />,
      },
    ],
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      {
        path: '/admin/manager-users',
        element: <ManagerUsers />,
      },
      {
        path: '/admin/manager-banner',
        element: <ManagerBanner />,
      },
      {
        path: '/admin/manager-products',
        element: <ManagerProduct />,
      },
      {
        path: '/admin/manager-orders',
        element: <ManagerOrder />,
      },
      {
        path: '/admin/manager-books',
        element: <BookPage />,
      },
      {
        path: '/admin/manager-fashion',
        element: <FashionPage />,
      },
      {
        path: '/admin/manager-electronics',
        element: <ElectronicsPage />,
      },
      {
        path: '/admin/manager-contact',
        element: <ManagerContact />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
export default InitRouter;
