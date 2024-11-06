import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MobileOutlined,
  CiCircleOutlined,
  BookOutlined,
  CustomerServiceOutlined,
  VideoCameraAddOutlined,
  CrownOutlined,
  RedditOutlined,
  HomeOutlined,
  DribbbleSquareOutlined,
  GiftOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import CardComponent from '../../Components/Card';
import { useLocation } from 'react-router-dom';
import './style.scss';
import { Col, Row } from 'antd';

const ProductsPage = () => {
  const [allProduct, setAllProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [noProducts, setNoProducts] = useState(false);
  const [sortOption, setSortOption] = useState('');

  const location = useLocation();

  const getCategoryFromPath = (path) => {
    const query = new URLSearchParams(path);
    return query.get('category');
  };

  const currentCategory = getCategoryFromPath(location.search);

  useEffect(() => {
    document.title = 'Sản phẩm';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/products/getAllProducts'
        );

        const productsWithAverageRating = res.data.map((product) => {
          const totalRating = product.comments.reduce(
            (acc, comment) => acc + comment.rate,
            0
          );
          const averageRating =
            product.comments.length > 0
              ? totalRating / product.comments.length
              : 0;
          return { ...product, averageRating };
        });
        setAllProduct(productsWithAverageRating);
        setFilteredProducts(productsWithAverageRating);
      } catch (error) {
        console.log(error);
      }
    };
    getAllProducts();
  }, []);

  useEffect(() => {
    if (currentCategory) {
      const getProductsByCategory = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/products/getProductByCategory/${currentCategory}`
          );
          if (res.data.length === 0) {
            setNoProducts(true); // Cập nhật trạng thái nếu không có sản phẩm
          } else {
            setNoProducts(false); // Cập nhật trạng thái nếu có sản phẩm
            const productsWithAverageRating = res.data.map((product) => {
              const totalRating = product.comments.reduce(
                (acc, comment) => acc + comment.rate,
                0
              );
              const averageRating =
                product.comments.length > 0
                  ? totalRating / product.comments.length
                  : 0;
              return { ...product, averageRating };
            });
            setAllProduct(productsWithAverageRating);
            setFilteredProducts(productsWithAverageRating);
          }
        } catch (error) {
          console.log(error);
          setAllProduct([]); // Cập nhật danh sách sản phẩm rỗng
          setNoProducts(true); // Cập nhật trạng thái nếu có lỗi xảy ra
        }
      };
      getProductsByCategory();
    } else {
      setNoProducts(true); // Cập nhật trạng thái nếu không có danh mục
    }
  }, [location.search]);

  const getDiscountedPrice = (product) => {
    return product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;
  };
  useEffect(() => {
    let sortedProducts = [...allProduct];
    switch (sortOption) {
      case 'price-asc':
        sortedProducts.sort(
          (a, b) => getDiscountedPrice(a) - getDiscountedPrice(b)
        );
        break;
      case 'price-desc':
        sortedProducts.sort(
          (a, b) => getDiscountedPrice(b) - getDiscountedPrice(a)
        );
        break;
      case 'best-rating':
        sortedProducts.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'newest':
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        sortedProducts = [...allProduct];
    }
    setFilteredProducts(sortedProducts);
  }, [sortOption, allProduct]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="wrapper-products">
      <div className="container wrapper-products-body ">
        {' '}
        <div className="wrapper-products-body-menu">
          <ul>
            <li
              className={currentCategory === 'Thiết bị điện tử' ? 'active' : ''}
            >
              <Link to="/products?category=Thiết bị điện tử">
                <MobileOutlined />
                Thiết bị điện tử
              </Link>
            </li>
            <li
              className={currentCategory === 'Fashion Clothing' ? 'active' : ''}
            >
              <Link to="/products?category=Fashion Clothing">
                <CiCircleOutlined />
                Fashion & Clothing
              </Link>
            </li>
            <li className={currentCategory === 'Book Audible' ? 'active' : ''}>
              <Link to="/products?category=Book Audible">
                <BookOutlined />
                Book & Audible
              </Link>
            </li>
            <li className={currentCategory === 'Accessories' ? 'active' : ''}>
              <Link to="/products?category=Accessories">
                <CustomerServiceOutlined />
                Accessories
              </Link>
            </li>
            <li
              className={
                currentCategory === 'TV Home Appliances' ? 'active' : ''
              }
            >
              <Link to="/products?category=TV Home Appliances">
                <VideoCameraAddOutlined />
                TV & Home Appliances
              </Link>
            </li>
            <li className={currentCategory === 'Babies Toys' ? 'active' : ''}>
              <Link to="/products?category=Babies Toys">
                <RedditOutlined />
                Babies & Toys
              </Link>
            </li>
            <li className={currentCategory === 'Home Kitchen' ? 'active' : ''}>
              <Link to="/products?category=Home Kitchen">
                <HomeOutlined />
                Home & Kitchen
              </Link>
            </li>
            <li className={currentCategory === 'Sport Travel' ? 'active' : ''}>
              <Link to="/products?category=Sport Travel">
                <DribbbleSquareOutlined />
                Sport & Travel
              </Link>
            </li>
            <li className={currentCategory === 'Home Audio' ? 'active' : ''}>
              <Link to="/products?category=Home Audio">
                <PlayCircleOutlined />
                Home Audio
              </Link>
            </li>
            <li className={currentCategory === 'garden' ? 'active' : ''}>
              <Link to="/products?category=garden">
                <GiftOutlined />
                Garden
              </Link>
            </li>
            <li className={currentCategory === 'health-beauty' ? 'active' : ''}>
              <Link to="/products?category=health-beauty">
                <CrownOutlined />
                Heath & Beauty
              </Link>
            </li>
          </ul>
        </div>
        <div className="wrapper-products-body-content">
          <div className="header-content">
            <div className="group-information">
              {allProduct && (
                <>
                  <h3>Tất cả sản phẩm</h3>
                  <p>Hiển thị {allProduct.length} sản phẩm</p>
                </>
              )}
            </div>
            <div className="group-select">
              <p>Hiển thị theo</p>
              <select name="" id="" onChange={handleSortChange}>
                <option value="">Mặc định</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="best-rating">Đánh giá tốt nhất</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>
          <div className="body-content">
            {noProducts ? (
              <div className="not-found-product">
                Sản phẩm chưa được cập nhật
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {filteredProducts?.map((product, index) => (
                  <Col xs={24} sm={24} md={12} lg={8} xl={6} key={index}>
                    <CardComponent product={product} />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
