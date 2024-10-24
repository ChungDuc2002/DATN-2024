import React from 'react';
import { Outlet } from 'react-router-dom';
import { ArrowUpOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import HeaderClient from '../../Components/HeaderClient';
import Footer from '../../Components/Footer';
const DefaultLayout = () => {
  return (
    <>
      <HeaderClient />
      <Outlet />
      <Footer />
      <FloatButton.BackTop icon={<ArrowUpOutlined />} />
    </>
  );
};

export default DefaultLayout;
