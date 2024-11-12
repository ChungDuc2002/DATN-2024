import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NotCartIcon from '../../Components/Icons/NotCartIcon';
import './style.scss';

const FavoritePage = () => {
  const [favorite, setFavorite] = React.useState([]);
  const [userId, setUserId] = React.useState('');
  const auth = localStorage.getItem('auth');

  useEffect(() => {
    const getIdUser = async () => {
      const token = JSON.parse(localStorage.getItem('auth'));
      if (token) {
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
      }
    };

    getIdUser();
  }, []);

  useEffect(() => {
    const getFavorite = async () => {
      if (userId) {
        try {
          const res = await axios.get(
            `http://localhost:5000/favorites/getFavorites/${userId}`
          );
          setFavorite(res.data);
        } catch (error) {
          console.log(error.message);
        }
      }
    };
    getFavorite();
  }, [userId]);

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
            {favorite?.map((item) => (
              <div className="item-favorite" key={item.productId._id}>
                <Link to={`/product/${item.productId._id}`}></Link>
                <div className="info-product">
                  <h3>{item.productId.name}</h3>
                  <p>{item.productId.price}đ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
