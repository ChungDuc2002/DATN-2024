import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Image } from 'antd';
import {
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

const HomePage = () => {
  const [listBanner, setListBanner] = useState([]);
  const [productDiscounted, setProductsDiscounted] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    document.title = 'Trang chủ';
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
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % listBanner.length);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [listBanner]);

  const mockDataOutstanding = [
    {
      image:
        'https://office-sup.monamedia.net/wp-content/uploads/2021/06/cat-home2-01.jpg',
      title: 'Thiết bị điện tử',
    },
    {
      image:
        'https://office-sup.monamedia.net/wp-content/uploads/2021/06/cat-home2-03.jpg',
      title: 'TV & Home Appliances',
    },
    {
      image:
        'https://office-sup.monamedia.net/wp-content/uploads/2021/06/cat-home2-04.jpg',
      title: 'Health & Beauty',
    },

    {
      image:
        'https://office-sup.monamedia.net/wp-content/uploads/2021/06/cat-home2-06.jpg',
      title: 'Home & Kitchen',
    },
    {
      image:
        'https://office-sup.monamedia.net/wp-content/uploads/2021/06/cat-home2-07.jpg',
      title: 'Sports & Travel',
    },
    {
      image:
        'https://office-sup.monamedia.net/wp-content/uploads/2021/06/cat-home2-08.jpg',
      title: 'Book & Audible',
    },
    {
      image:
        'https://office-sup.monamedia.net/wp-content/uploads/2021/06/cat-home2-10.jpg',
      title: 'Game & Toys',
    },
    {
      image:
        'https://office-sup.monamedia.net/wp-content/uploads/2021/06/cat-home2-12.jpg',
      title: 'Pet Supplies',
    },
  ];
  return (
    <div className="wrapper-home">
      <div className="container wrapper-home-header">
        <div className="wrapper-home-header-menu">
          <ul>
            <li>
              <Link to="/contact">
                <MobileOutlined />
                Thiết bị điện tử
              </Link>
            </li>
            <li>
              <Link to="/">
                <CiCircleOutlined />
                Fashion & Clothing
              </Link>
            </li>
            <li>
              <Link to="/">
                <BookOutlined />
                Book & Audible
              </Link>
            </li>
            <li>
              <Link to="/">
                <CustomerServiceOutlined />
                Accessories
              </Link>
            </li>
            <li>
              <Link to="/">
                <VideoCameraAddOutlined />
                TV & Home Appliances
              </Link>
            </li>
            <li>
              <Link to="/">
                <CrownOutlined />
                Heath & Beauty
              </Link>
            </li>
            <li>
              <Link to="/">
                <RedditOutlined />
                Babies & Toys
              </Link>
            </li>
            <li>
              <Link to="/">
                <HomeOutlined />
                Home & Kitchen
              </Link>
            </li>
            <li>
              <Link to="/">
                <DribbbleSquareOutlined />
                Sport & Travel
              </Link>
            </li>

            <li>
              <Link to="/">
                <GiftOutlined />
                Garden
              </Link>
            </li>
            <li>
              <Link to="/">
                <PlayCircleOutlined />
                Home Audio
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
        <h2 className="title-outstanding">danh mục nổi bật</h2>
        <div className="form-outstanding">
          {mockDataOutstanding?.map((item, index) => (
            <div className="render_outstanding" key={index}>
              <div className="image">
                <Image src={item.image} preview={false} />
              </div>
              <p className="title">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="container wrapper-home-preferential-products">
        <h2 className="title-preferential">sản phẩm giảm giá</h2>
        <Swiper
          modules={[Pagination]}
          // pagination={{ clickable: true }}
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
              <Card product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomePage;
