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
import FavoritePage from '../Pages/Favorite';
import CartPage from '../Pages/Cart';
import ProfilePage from '../Pages/Profile';
import InformationProfile from '../Pages/Profile/information';
import OrderPage from '../Pages/Profile/order';
import Register from '../Pages/Register';
import HomePage from '../Pages/Home';
import NotFound from '../Pages/NotFound';
import BookPage from './../Pages/Admin/Products/Books';
import FashionPage from './../Pages/Admin/Products/Fashion';
import ElectronicsPage from './../Pages/Admin/Products/Electronics';
import ManagerContact from '../Pages/Admin/Trang-Chu/ManagerContact';
import ProductDetail from '../Pages/ProductDetail';
import ManagerComments from '../Pages/Admin/Trang-Chu/ManagerComments';
import ProductsPage from '../Pages/Products';
import SearchPage from '../Pages/Search';
import StatisticalManager from '../Pages/Admin/Statistical';
import PaymentPage from '../Pages/Payment';
import PaymentSuccess from '../Pages/Payment-Success';
import PaymentWaiting from '../Pages/Profile/waiting-payment';
import AllProductsPage from '../Pages/Admin/Products/All-Products';
import OrderSuccessPage from './../Pages/Profile/order-success/index';
import ManagerFeaturedCategory from '../Pages/Admin/Trang-Chu/ManagerFeaturedCategory';
import ChatPage from '../Pages/Admin/ChatBox/Chat';
const InitRouter = [
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
        path: '/profile/:tabKey',
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
      {
        path: '/profile',
        element: <OrderSuccessPage />,
      },
      {
        path: '/profile',
        element: <PaymentWaiting />,
      },
      {
        path: '/favorite',
        element: <FavoritePage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/product/:id',
        element: <ProductDetail />,
      },
      {
        path: '/products',
        element: <ProductsPage />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/payment',
        element: <PaymentPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '/admin',
        element: <StatisticalManager />,
      },
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
      {
        path: '/admin/manager-comments',
        element: <ManagerComments />,
      },
      {
        path: '/admin/all-products',
        element: <AllProductsPage />,
      },
      {
        path: '/admin/manager-featured-category',
        element: <ManagerFeaturedCategory />,
      },
      {
        path: '/admin/chat',
        element: <ChatPage />,
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
    path: '/payment-success',
    element: <PaymentSuccess />,
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
