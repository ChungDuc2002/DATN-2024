import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NotCartIcon from '../../../Components/Icons/NotCartIcon';
import { Divider, Image, Modal } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import './style.scss';

const OrderPage = () => {
  const [showOrderModal, setShowOrderModal] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState('');
  const [selectedUserId, setSelectedUserId] = React.useState('');
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
          `http://localhost:5000/orders/getWaitingOrdersByUserId/${userId}`,
          {
            params: {
              status_payment: 'Completed',
              status_order: ['Pending', 'Processing', 'Shipping'],
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

  const handleCancel = () => {
    setShowOrderModal(false);
  };
  const handleShowOrderModal = (orderId, userId) => {
    setSelectedOrderId(orderId);
    setSelectedUserId(userId);
    console.log(userId);

    setShowOrderModal(true);
  };

  return (
    <div className="wrapper-order">
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
                  <p>Số lượng: {product?.quantity}</p>
                  <p>
                    Giá: {new Intl.NumberFormat().format(item.totalAmount)}đ
                  </p>
                </div>
                <div className="action">
                  <button
                    onClick={() => handleShowOrderModal(item._id, item.userId)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <Modal
        open={showOrderModal}
        onCancel={handleCancel}
        closeIcon={false}
        footer={false}
        centered
        width={1100}
      >
        <OrderItem orderId={selectedOrderId} userId={selectedUserId} />
      </Modal>
    </div>
  );
};

export default OrderPage;

function OrderItem({ orderId, userId }) {
  const [orderDetail, setOrderDetail] = React.useState({});

  useEffect(() => {
    const getOrderDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/orders/getOrdersByUserIdAndId/${userId}/${orderId}`
        );

        setOrderDetail(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOrderDetail();
  }, [orderId, userId]);

  const createdAt = new Date(orderDetail.createdAt);
  const estimatedDeliveryDate = new Date(createdAt);
  estimatedDeliveryDate.setDate(createdAt.getDate() + 4);

  const getStatusClassName = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Processing':
        return 'status-processing';
      case 'Completed':
        return 'status-completed';
      case 'Shipping':
        return 'status-shipping';
      case 'Delivered':
        return 'status-delivered';
      default:
        return '';
    }
  };
  return (
    <div className="wrapper-order-item">
      <div className="image">
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
          {orderDetail?.products?.map((product) =>
            product.productId.images?.map((item, imgIndex) => (
              <SwiperSlide key={imgIndex}>
                <Image
                  src={require(`../../../../../server/uploads/${item}`)}
                  preview={false}
                />
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
      <div className="order-item">
        <div className="order-item__header">
          {orderDetail?.products?.map((product) => (
            <p key={product._id} className="title-order">
              {' '}
              Đơn hàng : {product.productId.name}
            </p>
          ))}
          <p className="trademark">Chungduc_MO</p>
          <Divider />
          <p>
            Thời gian đặt hàng :{' '}
            {new Date(orderDetail.createdAt).toLocaleString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}{' '}
            -{' '}
            {new Date(orderDetail.createdAt).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
          <p>
            Dự kiến ngày nhận hàng :{' '}
            {estimatedDeliveryDate.toLocaleDateString()}
          </p>
        </div>
        <div className="order-item__body">
          <p>Địa chỉ nhận hàng : {orderDetail?.userInfo?.shippingAddress}</p>
          <p>Giá: {new Intl.NumberFormat().format(orderDetail.totalAmount)}đ</p>
          <p className="status_order">
            Trạng thái đơn hàng :{' '}
            <span className={getStatusClassName(orderDetail.status_order)}>
              {orderDetail.status_order}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
