import React, { useEffect } from 'react';
import './style.scss';
import axios from 'axios';
import { Image } from 'antd';
import NotCartIcon from '../../../Components/Icons/NotCartIcon';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
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
          `http://localhost:5000/orders/getSuccessOrders/${userId}`,
          {
            params: {
              status_payment: 'Completed',
              status_order: ['Completed'],
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
  return (
    <div className="wrapper-order-success">
      {order.length === 0 && (
        <div className="empty-order">
          <p>
            <NotCartIcon />
          </p>
          <h3>Bạn chưa có đơn hàng nào</h3>
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
                  <p className="trademark">Chungduc_MO</p>
                  <p>
                    Giá: {new Intl.NumberFormat().format(item.totalAmount)}đ
                  </p>
                </div>
                <div className="action">
                  <p>Hoàn thành</p>
                  <button
                    onClick={() =>
                      window.location.replace(
                        `/product/${product?.productId?._id}`
                      )
                    }
                  >
                    Mua lại
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

export default OrderSuccessPage;
