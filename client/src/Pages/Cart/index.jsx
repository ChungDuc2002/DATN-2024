import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge, Divider, Image, Modal } from 'antd';
import { DeleteOutlined, ProfileOutlined } from '@ant-design/icons';
import NotCartIcon from './../../Components/Icons/NotCartIcon';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import './style.scss';

const CartPage = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [userId, setUserId] = useState('');
  const [quantity, setQuantity] = useState({});
  const [showProductModal, setShowProductModal] = useState(false);

  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const currentDate = moment();
  const futureDate = currentDate.add(3, 'days');
  const formattedFutureDate = futureDate.format('DD/MM/YYYY');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  useEffect(() => {
    let newPrice = 0;
    let newDiscount = 0;
    let newTotal = 0;

    products.forEach((product) => {
      const qty = quantity[product._id] || 1;
      newPrice += product.price * qty;
      newDiscount += product.price * (product.discount / 100) * qty;
      newTotal += product.price * (1 - product.discount / 100) * qty;
    });

    setPrice(newPrice);
    setDiscount(newDiscount);
    setTotal(newTotal);
  }, [quantity, products]);

  const increaseQuantity = (productId) => {
    setQuantity((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 1) + 1,
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
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleShowProduct = (productId) => {
    setShowProductModal(true);
    setProductId(productId);
  };

  const handleCancel = () => {
    setShowProductModal(false);
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
                      <button
                        className="btn-action"
                        onClick={() => handleShowProduct(product._id)}
                      >
                        <ProfileOutlined />
                      </button>
                      <button
                        className="btn-action"
                        onClick={() => handleDeleteFromCart(product._id)}
                      >
                        <DeleteOutlined />
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
                Original Price
                <span>{new Intl.NumberFormat().format(price)}đ</span>
              </p>
              <p>
                Discount{' '}
                <span>{new Intl.NumberFormat().format(discount)}đ</span>
              </p>
              <p>
                Total <span>{new Intl.NumberFormat().format(total)}đ</span>
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
      <Modal
        open={showProductModal}
        onCancel={handleCancel}
        closeIcon={true}
        footer={false}
        centered
        width={1100}
      >
        <ShowProduct id={productId} />
      </Modal>
    </div>
  );
};

function ShowProduct({ id }) {
  const [product, setProduct] = useState([]);
  useEffect(() => {
    const callApiProductById = async () => {
      const response = await axios.get(
        `http://localhost:5000/products/getProductById/${id}`
      );
      setProduct(response.data);
    };
    callApiProductById();
  }, [id]);

  return (
    <div className="wrapper-show-product">
      <Swiper
        modules={[Pagination]}
        breakpoints={{
          375: {
            slidesPerView: 1,
            spaceBetween: 2,
          },
          425: {
            slidesPerView: 1,
            spaceBetween: 12,
          },
          575: {
            slidesPerView: 1,
            spaceBetween: 12,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 32,
          },
        }}
      >
        {product.images?.map((item, index) => (
          <SwiperSlide key={index}>
            <Image
              src={require(`../../../../server/uploads/${item}`)}
              preview={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {product.discount ? (
        <div className="tag-discount">
          <Badge.Ribbon
            text={`-${product.discount}%`}
            color="volcano"
          ></Badge.Ribbon>
        </div>
      ) : null}

      <div className="wrapper-show-product-information">
        <h1 className="title-product">
          <Link to="/contact">{product.name}</Link>
        </h1>
        <p className="trademark">Chungduc_MO</p>
        <div className="price">
          <span className="price_basic">
            {new Intl.NumberFormat().format(product.price)}đ
          </span>
          <span className="price_discount">
            {new Intl.NumberFormat().format(
              (product.price * (1 - product.discount / 100)).toFixed(2)
            )}
            đ{' '}
          </span>
        </div>
        <p className="description-product">{product.description}</p>
        <Divider />
        <p className="category">
          <span>
            Danh mục :{' '}
            {product.category?.map((item, index) => (
              <span key={index}>
                {item}
                {index !== product.category.length - 1 && ', '}
              </span>
            ))}
          </span>
        </p>
      </div>
    </div>
  );
}

export default CartPage;
