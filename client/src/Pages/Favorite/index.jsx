import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NotCartIcon from '../../Components/Icons/NotCartIcon';
import { Col, Image, Row } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import './style.scss';
import { toast } from 'react-hot-toast';

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
    console.log('favorite', favorite);
  }, [favorite]);

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

  const handleDeleteProductsFavorite = async (idProduct) => {
    try {
      const result = await axios.delete(
        `http://localhost:5000/favorites/removeFavorite/${userId}/${idProduct}`
      );
      if (result.status === 200) {
        const newProducts = favorite.filter(
          (product) => product.productId._id !== idProduct
        );
        setFavorite(newProducts);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async (_id) => {
    try {
      const data = {
        userId,
        productId: _id,
        quantity: 1,
      };
      await axios.post('http://localhost:5000/carts/addToCart', data);
      toast.success('Thêm vào giỏ hàng thành công !');
    } catch (err) {
      toast.error('Bạn đã thêm quá số lượng tồn kho của mặt hàng !');
    }
  };

  return (
    <div className="wrapper-favorite">
      {!auth ? (
        <div className="wrapper-not-login">
          <NotCartIcon />
          <p>Bạn cần đăng nhập để xem danh sách yêu thích</p>
          <Link to="/login">Đăng nhập</Link>
        </div>
      ) : (
        <div className="container wrapper-favorite-body">
          <h1 className="title-page-user">Danh sách sản phẩm yêu thích</h1>
          {favorite.length === 0 ? (
            <div className="wrapper-not-favorite">
              <NotCartIcon />
              <p>Chưa có sản phẩm nào trong danh sách giỏ hàng</p>
              <Link to="/">Mua sắm ngay</Link>
            </div>
          ) : (
            <div className="wrapper-list-favorite">
              <Row gutter={[16, 16]}>
                {favorite.map((item, index) => (
                  <Col
                    className="item-favorite"
                    key={index}
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={6}
                  >
                    <div className="icon-favorite">
                      <HeartFilled
                        onClick={() =>
                          handleDeleteProductsFavorite(item.productId._id)
                        }
                      />
                    </div>
                    <div className="img">
                      <Image
                        src={require(`../../../../server/uploads/${item.productId.images[0]}`)}
                        preview={false}
                      />
                    </div>
                    <p className="title-products">{item.productId.name}</p>
                    {item.productId.discount ? (
                      <div className="price-discount">
                        <p>
                          <span
                            style={{
                              textDecoration: 'line-through',
                              opacity: '0.7',
                            }}
                          >
                            {new Intl.NumberFormat().format(
                              item.productId.price
                            )}
                            đ
                          </span>
                        </p>
                        <p style={{ color: 'red' }}>
                          {new Intl.NumberFormat().format(
                            (
                              item.productId.price *
                              (1 - item.productId.discount / 100)
                            ).toFixed(2)
                          )}
                          đ
                        </p>
                      </div>
                    ) : (
                      <p>
                        <span style={{ color: '#e4003a' }}>
                          {new Intl.NumberFormat().format(item.productId.price)}
                          đ
                        </span>
                      </p>
                    )}
                    <p className="trademark">Chungduc_MO</p>
                    <button onClick={() => handleAddToCart(item.productId._id)}>
                      Mua Ngay
                    </button>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
