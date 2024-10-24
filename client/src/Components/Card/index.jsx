import React, { useEffect, useState } from 'react';
import { Badge, Card, Modal, Space } from 'antd';
const { Meta } = Card;
import './style.scss';
import {
  FullscreenOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const CardComponent = ({ product }) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [productId, setProductId] = useState(null);

  const handleShowProduct = () => {
    setShowProductModal(true);
    setProductId(product._id);
  };
  const handleCancel = () => {
    setShowProductModal(false);
  };
  return (
    <div className="wrapper-card">
      <Badge.Ribbon text={`-${product.discount}%`} color="volcano">
        <Card
          hoverable
          cover={
            <>
              <img
                alt="example"
                src={require(`../../../../server/uploads/${product.image}`)}
              />
            </>
          }
        >
          <Meta title={product.name} />
          <Space wrap>
            <div className="group-icon">
              <div className="icon">
                <ShoppingCartOutlined />
                <HeartOutlined />
                <FullscreenOutlined onClick={handleShowProduct} />
              </div>
            </div>
          </Space>
          <Space wrap>
            <p>
              <span style={{ textDecoration: 'line-through', opacity: '0.7' }}>
                {new Intl.NumberFormat().format(product.price)}đ
              </span>
            </p>
            <p style={{ color: 'red' }}>
              {new Intl.NumberFormat().format(
                (product.price * (1 - product.discount / 100)).toFixed(2)
              )}
              đ
            </p>
          </Space>
        </Card>
      </Badge.Ribbon>

      <Modal
        open={showProductModal}
        onCancel={handleCancel}
        closeIcon={false}
        footer={false}
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
    <div>
      <h1>{product.name}</h1>
      <h1>{product._id}</h1>
    </div>
  );
}

export default CardComponent;
