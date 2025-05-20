import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Image } from 'antd';
import {
  ArrowRightOutlined,
  BookOutlined,
  CiCircleOutlined,
  CrownOutlined,
  CustomerServiceOutlined,
  DribbbleSquareOutlined,
  GiftOutlined,
  HomeOutlined,
  MobileOutlined,
  PlayCircleOutlined,
  RedditOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';
import './style.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';

import Card from '../../Components/Card';
import Ribbon from 'antd/es/badge/Ribbon';

const HomePage = () => {
  //* Featured Categories

  const [featuredCategories, setFeaturedCategories] = useState([]);

  //* Banner
  const [listBanner, setListBanner] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  //* Products
  const [productDiscounted, setProductsDiscounted] = useState([]);
  const [productFashion, setProductsFashion] = useState([]);
  const [productElectronics, setProductsElectronics] = useState([]);
  const [productBook, setProductsBook] = useState([]);

  useEffect(() => {
    document.title = 'Chungduc_MO';
    const getAllBanner = async () => {
      const res = await axios.get('http://localhost:5000/slides/getSlides');
      setListBanner(res.data);
    };
    getAllBanner();
  }, []);

  useEffect(() => {
    const getProductDiscounted = async () => {
      const result = await axios.get(
        'http://localhost:5000/products/getProductByDiscount',
        {
          params: {
            discount: 0,
          },
        }
      );
      setProductsDiscounted(result.data);
    };
    getProductDiscounted();
  }, []);

  useEffect(() => {
    const getProductFashion = async () => {
      const result = await axios.get(
        'http://localhost:5000/products/getProductByType',
        {
          params: {
            type: 'fashion',
          },
        }
      );
      setProductsFashion(result.data);
    };
    getProductFashion();
  }, []);

  useEffect(() => {
    const getProductElectronics = async () => {
      const result = await axios.get(
        'http://localhost:5000/products/getProductByType',
        {
          params: {
            type: 'electronics',
          },
        }
      );
      setProductsElectronics(result.data);
    };
    getProductElectronics();
  }, []);

  useEffect(() => {
    const getProductBook = async () => {
      const result = await axios.get(
        'http://localhost:5000/products/getProductByType',
        {
          params: {
            type: 'book',
          },
        }
      );
      setProductsBook(result.data);
    };
    getProductBook();
  }, []);

  useEffect(() => {
    const getFeaturedCategories = async () => {
      const res = await axios.get(
        'http://localhost:5000/featured_categories/getAllFeaturedCategories'
      );
      setFeaturedCategories(res.data);
    };
    getFeaturedCategories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % listBanner.length);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [listBanner]);

  return (
    <div className="wrapper-home">
      <div className="container wrapper-home-header">
        <div className="wrapper-home-header-menu">
          <ul>
            <li>
              <Link to="/products?category=Thiết bị điện tử">
                <MobileOutlined />
                Thiết bị điện tử
              </Link>
            </li>
            <li>
              <Link to="/products?category=Fashion Clothing">
                <CiCircleOutlined />
                Fashion & Clothing
              </Link>
            </li>
            <li>
              <Link to="/products?category=Book Audible">
                <BookOutlined />
                Book & Audible
              </Link>
            </li>
            <li>
              <Link to="/products?category=Accessories">
                <CustomerServiceOutlined />
                Accessories
              </Link>
            </li>
            <li>
              <Link to="/products?category=TV Home Appliances">
                <VideoCameraAddOutlined />
                TV & Home Appliances
              </Link>
            </li>
            <li>
              <Link to="/products?category=Babies Toys">
                <RedditOutlined />
                Babies & Toys
              </Link>
            </li>
            <li>
              <Link to="/products?category=Home Kitchen">
                <HomeOutlined />
                Home & Kitchen
              </Link>
            </li>
            <li>
              <Link to="/products?category=Sport Travel">
                <DribbbleSquareOutlined />
                Sport & Travel
              </Link>
            </li>
            <li>
              <Link to="/products?category=Home Audio">
                <PlayCircleOutlined />
                Home Audio
              </Link>
            </li>
            <li>
              <Link to="/products?category=garden">
                <GiftOutlined />
                Garden
              </Link>
            </li>
            <li>
              <Link to="/products?category=health-beauty">
                <CrownOutlined />
                Heath & Beauty
              </Link>
            </li>
          </ul>
        </div>
        <div className="wrapper-home-header-image">
          <div className="main_banner">
            <div className="form-image">
              {listBanner.map((item, index) => (
                <div
                  className={`image ${
                    index === currentImageIndex ? 'active' : ''
                  }`}
                  key={index}
                >
                  <img
                    src={require(`../../../../server/uploads/${item.image}`)}
                  />
                  <div className="content-image">
                    <h1>{item.trademark}</h1>
                    <p>{item.title}</p>
                    <Button onClick={() => {}}>Mua Ngay</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="secondary_banner">
            <img
              src="https://office-sup.monamedia.net/wp-content/uploads/2021/07/banner-home2-01.jpg"
              alt=""
            />
            <img
              src="https://office-sup.monamedia.net/wp-content/uploads/2024/05/banner-home2-02222.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="container wrapper-home-outstanding-products">
        <div className="title">
          <h2 className="title-outstanding">danh mục nổi bật</h2>
        </div>
        <div className="form-outstanding">
          {featuredCategories.map((item, index) => (
            <Link
              to={`/products?category=${item.link}`}
              key={index}
              className="render_outstanding"
            >
              <div className="image">
                <Image
                  src={require(`../../../../server/uploads/${item.image}`)}
                  preview={false}
                />
              </div>
              <p className="title">{item.name}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="container wrapper-home-preferential-products">
        <div className="title">
          <h2 className="title-preferential">sản phẩm giảm giá</h2>
        </div>
        <Swiper
          modules={[Pagination]}
          breakpoints={{
            375: {
              slidesPerView: 1,
              spaceBetween: 2,
            },
            425: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            575: {
              slidesPerView: 3,
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 32,
            },
          }}
        >
          {productDiscounted?.map((item, index) => (
            <SwiperSlide key={index}>
              <Ribbon text={`-${item.discount}%`} color="volcano">
                <Card product={item} />
              </Ribbon>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="container wrapper-home-fashion-products">
        <div className="title">
          <h2 className="title-products">Sản phẩm thời trang</h2>
          <button
            onClick={() => {
              window.location.href = '/products?category=Fashion Clothing';
            }}
          >
            Xem tất cả <ArrowRightOutlined />
          </button>
        </div>
        <Swiper
          modules={[Pagination]}
          breakpoints={{
            375: {
              slidesPerView: 1,
              spaceBetween: 2,
            },
            425: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            575: {
              slidesPerView: 3,
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 32,
            },
          }}
        >
          {productFashion?.map((item, index) => (
            <SwiperSlide key={index}>
              <Card product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="container wrapper-home-electronics-products">
        <div className="title">
          <h2 className="title-products">Thiết bị điện tử</h2>
          <button
            onClick={() => {
              window.location.href = '/products?category=Thiết bị điện tử';
            }}
          >
            Xem tất cả <ArrowRightOutlined />
          </button>
        </div>
        <Swiper
          modules={[Pagination]}
          breakpoints={{
            375: {
              slidesPerView: 1,
              spaceBetween: 2,
            },
            425: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            575: {
              slidesPerView: 3,
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 32,
            },
          }}
        >
          {productElectronics?.map((item, index) => (
            <SwiperSlide key={index}>
              <Card product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="container wrapper-home-book-products">
        <div className="title">
          <h2 className="title-products">Sách & Âm thanh</h2>
          <button
            onClick={() => {
              window.location.href = '/products?category=Book Audible';
            }}
          >
            Xem tất cả <ArrowRightOutlined />
          </button>
        </div>
        <Swiper
          modules={[Pagination]}
          breakpoints={{
            375: {
              slidesPerView: 1,
              spaceBetween: 2,
            },
            425: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            575: {
              slidesPerView: 3,
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 32,
            },
          }}
        >
          {productBook?.map((item, index) => (
            <SwiperSlide key={index}>
              <Card product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomePage;
