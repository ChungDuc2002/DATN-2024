import axios from 'axios';
import React, { useEffect } from 'react';
import NotCartIcon from '../../../Components/Icons/NotCartIcon';
import { Link } from 'react-router-dom';
import { Image } from 'antd';
import { toast } from 'react-hot-toast';

const PaymentWaiting = () => {
  const [userId, setUserId] = React.useState('');
  const [order, setOrder] = React.useState([]);

  useEffect(() => {
    const getIdUser = async () => {
      const token = JSON.parse(localStorage.getItem('auth'));
      try {
        const result = await axios.get('http://localhost:5000/info', {
          headers: {
            token: `Bearer ${token}`,
          },
        });
        if (result.status === 200) {
          setUserId(result.data._id);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getIdUser();
  }, []);

  useEffect(() => {
    const getOrderAccount = async () => {
      try {
        if (!userId) return;
        const res = await axios.get(
          `http://localhost:5000/orders/getOrderIsPending/${userId}`,
          {
            params: {
              status_payment: 'Pending',
            },
          }
        );
        if (res.data) {
          setOrder(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getOrderAccount();
  }, [userId]);

  useEffect(() => {
    console.log(order);
  }, [order]);

  const handlePayment = async (orderId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/payos/reactivate-payment',
        { orderId }
      );
      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Payment URL is not defined');
      }
    } catch (err) {
      console.log(err);
      toast.error('Có lỗi xảy ra khi tái kích hoạt thanh toán');
    }
  };

  return (
    <div className="wrapper-order">
      {order.length === 0 && (
        <div className="empty-order">
          <p>
            <NotCartIcon />
          </p>
          <h3>Chưa có đơn hàng chờ thanh toán nào</h3>
          <p>
            <Link to="/">bắt đầu mua sắm</Link>
          </p>
        </div>
      )}
      {order?.map((item, index) => (
        <div className="order-item" key={index}>
          {item.products.map((product, index) => (
            <div className="product-item" key={index}>
              <div className="image-product">
                <Image
                  preview={false}
                  src={require(`../../../../../server/uploads/${product?.productId?.images[0]}`)}
                />{' '}
              </div>
              <div className="info-product">
                <div className="info">
                  <p>{product?.productId?.name}</p>
                  <p>Số lượng: {product?.quantity}</p>
                  <p>Giá: {item.totalAmount} đ</p>
                </div>
                <div className="action">
                  <button onClick={() => handlePayment(item._id)}>
                    Thanh toán
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PaymentWaiting;
