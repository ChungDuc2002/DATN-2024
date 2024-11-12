import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.scss';
// import { Rate } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Col, Image, Modal, Pagination, Rate, Row } from 'antd';

const ManagerComments = () => {
  const [comments, setComments] = React.useState([]);
  const [showInfoProduct, setShowInfoProduct] = React.useState(false);
  const [idProduct, setIdProduct] = React.useState(null);

  useEffect(() => {
    document.title = 'Quản lý phản hồi';
  }, []);

  useEffect(() => {
    const getProductByComments = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/products/getProductByComments'
        );
        setComments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProductByComments();
  }, []);

  const handleShowInfoProduct = (id) => {
    setShowInfoProduct(true);
    setIdProduct(id);
  };

  const handleCancel = () => {
    setShowInfoProduct(false);
  };

  return (
    <div className="wrapper-manager-comments">
      <div className="wrapper-manager-comments-product">
        <div className="manager-comments-product-content">
          <Row gutter={[16, 16]}>
            {comments.map((comment, index) => (
              <Col key={index} xs={24} sm={24} md={12} lg={12} xl={12}>
                <div className="manager-comments-product-content-item">
                  <div className="manager-comments-product-content-item-img">
                    <img
                      src={require(`../../../../../../server/uploads/${comment.images[0]}`)}
                      alt=""
                    />
                  </div>

                  <div
                    className="manager-comments-product-content-item-info"
                    key={index}
                  >
                    <div className="product-info">
                      <p>Tên sản phẩm: {comment.name}</p>
                      <p>
                        Danh mục :{' '}
                        {comment.category.map((cate, index) => (
                          <span key={index}>
                            {cate}
                            {index !== comment.category.length - 1 && ', '}
                          </span>
                        ))}
                      </p>

                      <p>Số lượng đánh giá : {comment.comments.length}</p>
                    </div>
                    <div className="product-action">
                      <EyeOutlined
                        onClick={() => handleShowInfoProduct(comment._id)}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        <Modal
          open={showInfoProduct}
          onCancel={handleCancel}
          closeIcon={false}
          footer={false}
          centered
          width={900}
        >
          <InfoProduct id={idProduct} />
        </Modal>
      </div>
    </div>
  );
};

function InfoProduct({ id }) {
  const [product, setProduct] = React.useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('highest'); // State để lưu trữ tùy chọn lọc
  const commentsPerPage = 4;

  useEffect(() => {
    const getProductById = async () => {
      const res = await axios.get(
        `http://localhost:5000/products/getProductById/${id}`
      );
      setProduct(res.data);
    };
    getProductById();
  }, [id]);

  const handleDeleteComment = (idProduct, idComment) => async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/products/deleteComment/${idProduct}/${idComment}`
      );
      if (res.status === 200) {
        const newComments = product.comments.filter(
          (cmt) => cmt._id !== idComment
        );
        setProduct({ ...product, comments: newComments });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedComments = [...(product.comments || [])].sort((a, b) => {
    if (sortOption === 'highest') {
      return b.rate - a.rate;
    } else {
      return a.rate - b.rate;
    }
  });

  const currentComments = sortedComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  return (
    <div className="wrapper-info-product">
      <h1>Sản phẩm : {product.name}</h1>
      <h3>
        {' '}
        Danh mục :{' '}
        {product.category?.map((cate, index) => (
          <span key={index}>
            {cate}
            {index !== product.category.length - 1 && ', '}
          </span>
        ))}
      </h3>
      <div className="select-reviewed">
        <select onChange={handleSortChange} value={sortOption}>
          <option value="highest">Đánh giá cao nhất</option>
          <option value="lowest">Đánh giá thấp nhất</option>
        </select>
      </div>
      <div className="manager-reviewed">
        <div className="reviewed">
          {currentComments?.map((comment, index) => (
            <div key={index} className="reviewed-item">
              <div className="reviewed-item-info">
                <p>Tên khách hàng : {comment.user.fullName}</p>
                <p>
                  Đánh giá : <Rate disabled value={comment.rate} />
                </p>
                {comment.image_comment ? (
                  <div className="reviewed-item-img">
                    {comment.image_comment?.map((img, index) => (
                      <Image
                        key={index}
                        src={`http://localhost:5000/uploads/${img}`}
                        alt=""
                      />
                    ))}
                  </div>
                ) : null}
                <p>Phản hồi : {comment.text}</p>
              </div>
              <div className="reviewed-item-action">
                <DeleteOutlined
                  onClick={handleDeleteComment(product._id, comment._id)}
                />
              </div>
            </div>
          ))}
        </div>
        <Pagination
          current={currentPage}
          pageSize={commentsPerPage}
          total={product.comments?.length}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default ManagerComments;
