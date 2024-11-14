import React, { useEffect, useState } from 'react';
import { Badge, Card, Divider, Image, Modal, Rate, Space } from 'antd';
const { Meta } = Card;
import {
  FullscreenOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CardComponent = ({ product }) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [productId, setProductId] = useState(null);
  const [userId, setUserId] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  const auth = localStorage.getItem('auth');
  const navigate = useNavigate();

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
    // Tính toán giá trị trung bình của các đánh giá
    if (product.comments.length > 0) {
      const totalRating = product.comments.reduce(
        (acc, comment) => acc + comment.rate,
        0
      );
      const avgRating = totalRating / product.comments.length;
      setAverageRating(avgRating);
    }
  }, [product.comments]);

  const handleShowProduct = () => {
    setShowProductModal(true);
    setProductId(product._id);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!auth) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
    }

    try {
      const data = {
        userId,
        productId: product._id,
        quantity: 1,
      };
      await axios.post('http://localhost:5000/carts/addToCart', data);
      toast.success('Thêm vào giỏ hàng thành công !');
    } catch (err) {
      toast.error('Bạn đã thêm quá số lượng tồn kho của mặt hàng !');
    }
  };

  const handleAddFavorite = async () => {
    if (!auth) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào yêu thích');
    }

    try {
      const data = {
        userId,
        productId: product._id,
      };
      await axios.post('http://localhost:5000/favorites/addToFavorite', data);
      toast.success('Thêm vào yêu thích thành công !');
    } catch (err) {
      toast.error('Sản phẩm đã có trong danh sách yêu thích !');
    }
  };

  const handleCancel = () => {
    setShowProductModal(false);
  };

  const handleNavigateToProduct = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="wrapper-card">
      <Card
        hoverable
        cover={
          <>
            <img
              alt="example"
              src={require(`../../../../server/uploads/${product.images[0]}`)}
              // src={`http://localhost:5000/uploads/${product.images[0]}`}
            />
          </>
        }
      >
        <Meta title={product.name} onClick={handleNavigateToProduct} />
        <Space wrap>
          <Rate className="rate-product" disabled value={averageRating} />
        </Space>
        <Space wrap>
          <div className="group-icon">
            <div className="icon">
              <ShoppingCartOutlined onClick={handleAddToCart} />
              <HeartOutlined onClick={handleAddFavorite} />
              <FullscreenOutlined onClick={handleShowProduct} />
            </div>
          </div>
        </Space>
        <Space wrap>
          {product.discount && product.inventory_quantity > 0 ? (
            <div className="price-discount">
              <p>
                <span
                  style={{ textDecoration: 'line-through', opacity: '0.7' }}
                >
                  {new Intl.NumberFormat().format(product.price)}đ
                </span>
              </p>
              <p style={{ color: 'red' }}>
                {new Intl.NumberFormat().format(
                  (product.price * (1 - product.discount / 100)).toFixed(2)
                )}
                đ
              </p>
            </div>
          ) : product.inventory_quantity > 0 ? (
            <p>
              <span style={{ color: '#e4003a' }}>
                {new Intl.NumberFormat().format(product.price)}đ
              </span>
            </p>
          ) : (
            <p>Hết hàng</p>
          )}
        </Space>
        <Space wrap>
          <p className="trademark">Chungduc_MO</p>
        </Space>
      </Card>

      <Modal
        open={showProductModal}
        onCancel={handleCancel}
        closeIcon={true}
        footer={false}
        centered
        width={1100}
      >
        <ShowProduct id={productId} userId={userId} />
      </Modal>
    </div>
  );
};

function ShowProduct({ id, userId }) {
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const callApiProductById = async () => {
      const response = await axios.get(
        `http://localhost:5000/products/getProductById/${id}`
      );
      setProduct(response.data);
    };
    callApiProductById();
  }, [id]);

  useEffect(() => {
    if (product.comments && product.comments.length > 0) {
      const totalRating = product.comments.reduce(
        (acc, comment) => acc + comment.rate,
        0
      );
      const avgRating = totalRating / product.comments.length;
      console.log(avgRating);
      setAverageRating(avgRating);
    }
  }, [product.comments]);

  const increaseQuantity = () => {
    if (quantity < product.inventory_quantity) {
      setQuantity(quantity + 1);
    } else {
      toast.error('Bạn đã chọn số lượng vượt quá số lượng hàng trong kho');
    }
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddCart = async () => {
    if (quantity > product.inventory_quantity) {
      toast.error('Bạn đã chọn số lượng vượt quá số lượng hàng trong kho');
      return;
    }

    try {
      await axios.post('http://localhost:5000/carts/addToCart', {
        userId,
        productId: product._id,
        quantity,
      });
      toast.success('Sản phẩm đã được thêm vào giỏ hàng');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    }
  };

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
        <h1
          className="title-product"
          onClick={() => {
            window.location.href = `/product/${product._id}`;
          }}
        >
          {product.name}
        </h1>
        <p className="trademark">Chungduc_MO</p>
        <div className="rating">
          <Rate disabled value={averageRating} />
          <p> {product.comments?.length || 0} khách hàng đánh giá</p>
        </div>
        <div className="price">
          {product.discount ? (
            <>
              <span className="price_basic">
                {' '}
                {new Intl.NumberFormat().format(product.price)}đ
              </span>
              <span className="price_discount">
                {new Intl.NumberFormat().format(
                  (product.price * (1 - product.discount / 100)).toFixed(2)
                )}
                đ{' '}
              </span>
            </>
          ) : (
            <span className="price_initial">
              {' '}
              {new Intl.NumberFormat().format(product.price)}đ
            </span>
          )}
        </div>
        <p className="description-product">{product.description}</p>
        <Divider />
        <p className="quantity">Số lượng: {product.inventory_quantity}</p>
        <div className="group-action">
          <span className="box">
            <button className="state-btn" onClick={decreaseQuantity}>
              -
            </button>
            <input
              type="number"
              min={1}
              step={1}
              max={30}
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <button className="state-btn" onClick={increaseQuantity}>
              +
            </button>
          </span>
          <button className="btn-action" onClick={handleAddCart}>
            Add To Cart
          </button>
          <button className="btn-action">Mua Ngay</button>
        </div>
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

export default CardComponent;
