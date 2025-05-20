import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Image, Input, Modal, Radio, Table } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import './style.scss';
import { debounce } from 'lodash';

const renderPrice = (price) => {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
  return formattedPrice;
};

const ManagerOrder = () => {
  const { Search } = Input;

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const getAllOrders = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/orders/getAllOrders',
          {
            params: { status_payment: 'Completed' },
          }
        );
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllOrders();
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status_order === filterStatus)
      );
    }
  }, [filterStatus, orders]);

  useEffect(() => {
    console.log(filteredOrders);
  }, [filteredOrders]);

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

      default:
        return '';
    }
  };

  const columns = [
    { title: 'Order Code', dataIndex: 'orderCode', key: 'orderCode' },
    {
      title: 'Customer',
      key: 'email',
      render: (text, record) => <span>{record.userInfo.fullName}</span>,
    },
    {
      title: 'Order',
      key: 'phone',
      render: (text, record) => (
        <span>{record.products.map((product) => product.productId.name)}</span>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'totalAmount',
      key: 'phone',
      render: (text, record) => <span>{renderPrice(record.totalAmount)}</span>,
    },

    {
      title: 'Delivery date',
      key: 'delivery date',
      render: (text, record) => (
        <span>{moment(record.createdAt).format('DD/MM/YYYY')}</span>
      ),
    },
    {
      title: 'Delivery Status',
      key: 'status_order',
      render: (text, record) => (
        <span className={getStatusClassName(record.status_order)}>
          {record.status_order}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button
            style={{ marginRight: '5px' }}
            onClick={() => {
              handleEdit(record._id);
            }}
            className="btn-action"
          >
            <EditOutlined />
          </Button>
        </div>
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [item, setItem] = useState('');

  const handleCancel = () => {
    setOpen(false);
  };

  const handleEdit = (record) => {
    setItem(record);
    setOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleSearch = useCallback(
    debounce(async (value) => {
      if (!value) {
        setFilteredOrders(orders);
        return;
      }
      try {
        const response = await axios.get(
          'http://localhost:5000/orders/searchOrderByCode',
          {
            params: { orderCode: value },
          }
        );
        setFilteredOrders([response.data]);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }, 300),
    [orders]
  );

  const handleSearchChange = (e) => {
    handleSearch(e.target.value);
  };
  return (
    <div className="wrapper-manager-order">
      <div className="wrapper-manager-order-header">
        <Search
          placeholder="Search by order code ..."
          allowClear
          onChange={handleSearchChange}
        />
        <div className="group-select" onChange={handleFilterChange}>
          <select>
            <option value="all">Filter</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipping">Shipping</option>
            <option value="Completed">Completed</option>
            {/* <option value="Cancelled">Cancelled</option> */}
          </select>
        </div>
      </div>
      <div className="wrapper-manager-order-body">
        <Table
          columns={columns}
          dataSource={filteredOrders}
          pagination={{ pageSize: 7 }}
        />
        <Modal open={open} closeIcon={false} footer={false} width={1100}>
          {item && <ChangeStatusOrder id={item} onCancel={handleCancel} />}
        </Modal>
      </div>
    </div>
  );
};

function ChangeStatusOrder({ id, onCancel }) {
  const [orderById, setOrderById] = useState({});
  const [selectedValueStatusOrder, setSelectedValueStatusOrder] =
    useState('Pending');

  const createdAt = new Date(orderById.createdAt);
  const estimatedDeliveryDate = new Date(createdAt);
  estimatedDeliveryDate.setDate(createdAt.getDate() + 4);

  useEffect(() => {
    const getOrderById = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/orders/getOrderById/${id}`
        );
        setOrderById(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOrderById();
  }, [id]);

  useEffect(() => {
    if (orderById.status_order) {
      setSelectedValueStatusOrder(orderById.status_order);
    }
  }, [orderById]);

  const optionStatusOrder = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipping', label: 'Shipping' },
    { value: 'Completed', label: 'Completed' },
    // { value: 'Cancelled', label: 'Cancelled' },
  ];

  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/orders/updateOrderStatus/${id}`, {
        status_order: selectedValueStatusOrder,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="wrapper-change-status-order">
      <form action="" onSubmit={handleSubmit}>
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
            {orderById?.products?.map((product) =>
              product.productId.images?.map((item, imgIndex) => (
                <SwiperSlide key={imgIndex}>
                  <Image
                    src={require(`../../../../../../server/uploads/${item}`)}
                    preview={false}
                  />
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
        <div className="order-item">
          <div className="order-item__header">
            {orderById?.products?.map((product) => (
              <p key={product._id} className="title-order">
                {' '}
                Đơn hàng : {product.productId.name}
              </p>
            ))}

            <p>Nguời đặt hàng : {orderById?.userInfo?.fullName}</p>
            <p>Số điện thoại : {orderById?.userInfo?.phone}</p>
            <p>
              Ngày đặt hàng :{' '}
              {new Date(orderById.createdAt).toLocaleDateString('vi-VN')}
            </p>
            <p>
              Dự kiến ngày nhận hàng :{' '}
              {estimatedDeliveryDate.toLocaleDateString()}
            </p>
          </div>
          <div className="order-item__body">
            <p>Địa chỉ nhận hàng : {orderById?.userInfo?.shippingAddress}</p>
            {orderById?.products?.map((product, index) => (
              <p key={index}>Số lượng đơn hàng: {product.quantity} </p>
            ))}
            <p>Tổng tiền: {renderPrice(orderById.totalAmount)} </p>
            <p>
              Trạng thái đơn hàng :
              <Radio.Group
                block
                options={optionStatusOrder}
                optionType="button"
                buttonStyle="solid"
                value={selectedValueStatusOrder}
                onChange={(e) => setSelectedValueStatusOrder(e.target.value)}
              />
            </p>
          </div>
          <div className="group-btn">
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default ManagerOrder;
