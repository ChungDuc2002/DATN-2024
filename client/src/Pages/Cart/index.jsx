import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Divider, Image } from 'antd';
import { DeleteOutlined, ProfileOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import NotCartIcon from './../../Components/Icons/NotCartIcon';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './style.scss';

const CartPage = () => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState('');
  const [quantity, setQuantity] = useState({});

  const currentDate = moment();
  const futureDate = currentDate.add(3, 'days');
  const formattedFutureDate = futureDate.format('DD/MM/YYYY');

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
    document.title = 'Cart Page';
    if (userId) {
      const resultCart = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/carts/getCart/${userId}`
          );
          setProducts(response.data.products);
          const quantities = {};
          response.data.products.forEach((item) => {
            quantities[item._id] = item.quantity;
          });
          setQuantity(quantities);
        } catch (error) {
          console.log('error', error);
        }
      };

      resultCart();
    }
  }, [userId]);

  const increaseQuantity = (productId) => {
    setQuantity((prevQuantities) => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] + 1,
    }));
  };

  const decreaseQuantity = (productId) => {
    setQuantity((prevQuantities) => ({
      ...prevQuantities,
      [productId]:
        prevQuantities[productId] > 1 ? prevQuantities[productId] - 1 : 1,
    }));
  };

  const handleDeleteFromCart = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/carts/deleteProduct/${userId}/${productId}`
      );
      const newProducts = products.filter(
        (product) => product._id !== productId
      );
      setProducts(newProducts);
      toast.success('Delete product successfully !');
    } catch (error) {
      toast.error('Delete product failed !');
    }
  };
  return (
    <div className="container wrapper-cart">
      <h1 className="title-page-user">Giỏ hàng của bạn</h1>

      {products.length > 0 ? (
        <div className="wrapper-cart-layout">
          <div className="wrapper-cart-layout-flex">
            {products?.map((product, index) => (
              <div className="wrapper-cart-layout-flex-products" key={index}>
                <div className="image">
                  <Image
                    src={require(`../../../../server/uploads/${product.images[0]}`)}
                    preview={false}
                  />
                </div>
                <div className="information_product">
                  <h3 className="title_product">{product.name}</h3>
                  {product?.type === 'fashion' && (
                    <p className="size_product">
                      <span>Size : {product.sizes}</span> {' / '}
                      <span>Color : {product.color}</span>
                    </p>
                  )}
                  {product?.discount ? (
                    <>
                      <div className="price_product">
                        <p>
                          <span
                            style={{
                              textDecoration: 'line-through',
                              opacity: '0.7',
                            }}
                          >
                            {new Intl.NumberFormat().format(product.price)}đ
                          </span>
                        </p>
                        <p style={{ color: 'red' }}>
                          {new Intl.NumberFormat().format(
                            (
                              product.price *
                              (1 - product.discount / 100)
                            ).toFixed(2)
                          )}
                          đ
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="price_product">
                      {' '}
                      {new Intl.NumberFormat().format(product.price)}đ
                    </p>
                  )}
                  <div className="group-action">
                    <span className="box">
                      <button
                        className="state-btn"
                        onClick={() => decreaseQuantity(product._id)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        max={30}
                        value={quantity[product._id] || 1}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          setQuantity((prevQuantities) => ({
                            ...prevQuantities,
                            [product.productId]: newQuantity,
                          }));
                        }}
                      />
                      <button
                        className="state-btn"
                        onClick={() => increaseQuantity(product._id)}
                      >
                        +
                      </button>
                    </span>
                    <div className="group-btn">
                      <button className="btn-action">
                        <ProfileOutlined />
                      </button>
                      <button className="btn-action">
                        <DeleteOutlined
                          onClick={() => handleDeleteFromCart(product._id)}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="wrapper-cart-layout-payment">
            <div className="wrapper-cart-layout-payment-body">
              <h2>order summary</h2>
              <p>
                Price <span>200</span>
              </p>
              <p>
                Discount <span>30</span>
              </p>
              <p>
                Total <span>170</span>
              </p>
              <button>proceed to checkout</button>
              <Divider />
              <p className="estimated_time">
                estimated delivery by {formattedFutureDate}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="wrapper-not-favorite">
          <NotCartIcon />
          <p>Chưa có sản phẩm nào trong danh sách yêu thích</p>
          <Link to="/">Mua sắm ngay</Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
