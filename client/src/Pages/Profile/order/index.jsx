import React from 'react';
import { Link } from 'react-router-dom';
import NotCartIcon from '../../../Components/Icons/NotCartIcon';
import './style.scss';

const mockdata = [];
const OrderPage = () => {
  return (
    <div className="wrapper-order">
      {mockdata.length === 0 && (
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
      {/* {mockdata.length > 0 &&
        mockdata.map((item, index) => {
          return <div>Order</div>;
        })}{' '} */}
    </div>
  );
};

export default OrderPage;
