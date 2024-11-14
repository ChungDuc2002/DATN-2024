import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { Button, Result } from 'antd';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './style.scss';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const hasCalledAPI = useRef(false);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (hasCalledAPI.current) return; // Nếu API đã được gọi, không gọi lại nữa
      hasCalledAPI.current = true; // Đánh dấu rằng API đã được gọi

      try {
        const products = JSON.parse(localStorage.getItem('cartProducts'));
        const userId = localStorage.getItem('userId');
        const orderId = localStorage.getItem('orderId');

        await axios.post('http://localhost:5000/api/payos/payment-success', {
          orderId,
          products,
          userId,
        });

        localStorage.removeItem('cartProducts');
        localStorage.removeItem('userId');
        localStorage.removeItem('orderId');
      } catch (error) {
        console.error('Error processing payment success:', error);
        toast.error('Có lỗi xảy ra khi xử lý thanh toán thành công');
      }
    };

    handlePaymentSuccess();
  }, [navigate]);

  return (
    <div className="wrapper-payment-success">
      <Result
        status="success"
        title="Payment Successfully"
        subTitle="Thank you for purchasing our products !"
        extra={[
          <Button type="primary" key="console" onClick={() => navigate('/')}>
            Go Home
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaymentSuccess;
