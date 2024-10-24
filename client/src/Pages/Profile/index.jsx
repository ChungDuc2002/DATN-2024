import React, { useEffect, useState } from 'react';
import { Divider, Tabs } from 'antd';
import './style.scss';
import InformationProfile from './information';
import OrderPage from './order';

const ProfilePage = () => {
  const items = [
    {
      key: '1',
      label: 'Đơn hàng của tôi',
      children: <OrderPage />,
    },
    {
      key: '2',
      label: 'Yêu cầu đổi trả',
      children: 'Content of Tab Pane 2',
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

  const handleTabChange = (key) => {
    // Xử lý sự thay đổi tab và cập nhật selectedLabel
    const selectedTab = items.find((item) => item.key === key);
    if (selectedTab) {
      setSelectedLabel(selectedTab.label);
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
          activeKey={items.find((item) => item.label === selectedLabel)?.key}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
