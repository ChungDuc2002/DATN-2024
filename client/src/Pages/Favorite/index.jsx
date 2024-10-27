import React from 'react';
import { Link } from 'react-router-dom';
import NotCartIcon from '../../Components/Icons/NotCartIcon';
import './style.scss';

const mockdata = [];
const FavoritePage = () => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  return (
    <div className="container wrapper-favorite">
      {!auth ? (
        <div className="wrapper-not-login">
          <NotCartIcon />
          <p>Bạn cần đăng nhập để xem danh sách yêu thích</p>
          <Link to="/login">Đăng nhập</Link>
        </div>
      ) : (
        <div className="wrapper-favorite">
          <h1 className="title-page-user">Danh sách sản phẩm yêu thích</h1>
          <div className="wrapper-list-favorite">
            {mockdata.length === 0 ? (
              <div className="wrapper-not-favorite">
                <NotCartIcon />
                <p>Chưa có sản phẩm nào trong danh sách yêu thích</p>
                <Link to="/">Mua sắm ngay</Link>
              </div>
            ) : (
              <div className="wrapper-list-favorite">
                {mockdata.map((item, index) => (
                  <div key={index} className="item-favorite">
                    <img src={item.image} alt="product" />
                    <p>{item.name}</p>
                    <p>{item.price}</p>
                    <button>Xóa</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
