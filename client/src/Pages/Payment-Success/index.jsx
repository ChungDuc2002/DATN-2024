import axios from 'axios';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        const products = JSON.parse(localStorage.getItem('cartProducts'));
        const userId = localStorage.getItem('userId');
        const orderId = localStorage.getItem('orderId');

        const response = await axios.post(
          'http://localhost:5000/api/payos/payment-success',
          {
            orderId,
            products,
            userId,
          }
        );
        console.log('Payment success:', response.data);
        localStorage.removeItem('cartProducts');
        toast.success('Thanh toán thành công và giỏ hàng đã được clear');
        navigate('/');
      } catch (error) {
        console.error('Error processing payment success:', error);
        toast.error('Có lỗi xảy ra khi xử lý thanh toán thành công');
      }
    };

    handlePaymentSuccess();
  }, [navigate]);

  return (
    <div>
      PaymentSuccess
      <p onClick={() => (window.location.href = '/')}>ve trang chủ</p>
    </div>
  );
};

export default PaymentSuccess;
