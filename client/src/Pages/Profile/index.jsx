import React, { useEffect, useState } from 'react';
import { Divider, Tabs } from 'antd';
import './style.scss';
import InformationProfile from './information';
import OrderPage from './order';
import PaymentWaiting from './waiting-payment';
import OrderSuccess from './order-success';
import { useNavigate, useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { tabKey } = useParams();
  const navigate = useNavigate();
  const items = [
    {
      key: '1',
      label: 'Đơn hàng của tôi',
      children: <OrderPage />,
    },
    {
      key: '2',
      label: 'Chờ thanh toán',
      children: <PaymentWaiting />,
    },
    {
      key: '4',
      label: 'Đơn hàng đã giao',
      children: <OrderSuccess />,
    },
    {
      key: '3',
      label: 'Thông tin cá nhân',
      children: <InformationProfile />,
    },
  ];

  const [selectedLabel, setSelectedLabel] = useState('');
  const [shouldRestoreLabel, setShouldRestoreLabel] = useState(true);

  useEffect(() => {
    // Khôi phục selectedLabel từ localStorage khi shouldRestoreLabel được đặt là true
    if (shouldRestoreLabel) {
      const savedLabel = localStorage.getItem('selectedLabel');
      if (savedLabel) {
        setSelectedLabel(savedLabel);
      }
      setShouldRestoreLabel(false);
    }
  }, [shouldRestoreLabel]);

  useEffect(() => {
    // Lưu trữ selectedLabel vào localStorage và cập nhật nội dung của thẻ h1 khi selectedLabel thay đổi
    localStorage.setItem('selectedLabel', selectedLabel);
    document.title = selectedLabel;
  }, [selectedLabel]);

  useEffect(() => {
    // Cập nhật selectedLabel và activeKey khi tabKey thay đổi
    const selectedTab = items.find((item) => item.key === tabKey);
    if (selectedTab) {
      setSelectedLabel(selectedTab.label);
    }
  }, [tabKey, items]);

  const handleTabChange = (key) => {
    // Xử lý sự thay đổi tab và cập nhật selectedLabel
    const selectedTab = items.find((item) => item.key === key);
    if (selectedTab) {
      setSelectedLabel(selectedTab.label);
      navigate(`/profile/${key}`);
    }
  };

  return (
    <div className="wrapper-profile">
      <div className="container">
        <h1 className="title-page-user">{selectedLabel}</h1>
        <Divider />
        <Tabs
          tabPosition={'left'}
          items={items}
          onChange={handleTabChange}
          activeKey={
            tabKey || items.find((item) => item.label === selectedLabel)?.key
          }
        />
      </div>
    </div>
  );
};

export default ProfilePage;
