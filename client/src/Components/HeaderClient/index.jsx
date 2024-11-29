import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BellOutlined,
  CloseOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  ExclamationCircleOutlined,
  MenuOutlined,
} from '@ant-design/icons';
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
import { Image, Button, Divider, Input, Drawer, Badge } from 'antd';
import axios from 'axios';
import logo from '../../Assets/logo.png';
import UserIcon from '../Icons/UserIcon';
import CartIcon from '../Icons/CartIcon';
import SearchIcon from '../Icons/SearchIcon';
import HeartIcon from '../Icons/HeartIcon';
import { debounce } from 'lodash';
import './header.scss';

const HeaderClient = () => {
  const { Search } = Input;
  const auth = localStorage.getItem('auth');

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // State để lưu trữ kết quả tìm kiếm

  // !  get last name from full name
  const userName = localStorage.getItem('fullName');
  let lastWord = '';
  if (userName) {
    const newName = userName.split(' ');
    lastWord = newName[newName.length - 1];
  }

  const [products, setProducts] = useState([]);
  const [favorite, setFavorite] = useState();
  const [userId, setUserId] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [createdAt, setCreatedAt] = useState('');

  //* LOGIC - Call api get name

  useEffect(() => {
    const resName = async () => {
      const token = JSON.parse(localStorage.getItem('auth'));
      if (token) {
        try {
          const result = await axios.get('http://localhost:5000/info', {
            headers: {
              token: `Bearer ${token}`,
            },
          });
          if (result.status === 200) {
            localStorage.setItem('fullName', result.data.fullName);
            setUserId(result.data._id);
            setCreatedAt(result.data.createdAt);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    resName();
  }, []);

  const fetchFavorite = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/favorites/getFavorites/${userId}`
        );
        setFavorite(response.data.length);
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  useEffect(() => {
    fetchFavorite();
    const interval = setInterval(() => {
      fetchFavorite();
    }, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchCart = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/carts/getCart/${userId}`
        );
        setProducts(response.data.products);
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  useEffect(() => {
    fetchCart();

    const interval = setInterval(() => {
      fetchCart();
    }, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  //* LOGIC - Kiểm tra thời gian để chào hỏi
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour >= 18 && currentHour <= 23) {
      setGreeting('Chào buổi tối');
    } else if (currentHour >= 0 && currentHour <= 12) {
      setGreeting('Chào buổi sáng');
    } else if (currentHour >= 13 && currentHour <= 17) {
      setGreeting('Chào buổi chiều');
    }
  }, []);

  //* Tính toán số ngày từ ngày tạo tài khoản đến thời điểm hiện tại
  const calculateDaysSinceCreation = () => {
    if (!createdAt) return 0;
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  };

  //* LOGIC - Tìm kiếm

  const onSearch = useCallback(
    debounce(async (value) => {
      if (value.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/products/searchProductByName`,
          {
            params: { name: value },
          }
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    }, 300),
    []
  );

  const handleNavigateProductById = (id) => () => {
    navigate(`/product/${id}`);
    setIsModalOpen(false);
    setSearchResults([]);
  };

  const handleViewAllSearch = () => {
    const searchQuery = document.querySelector('.ant-input').value;
    navigate(`/search?query=${searchQuery}`);
    setIsModalOpen(false);
    setSearchResults([]);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/orders/notifications/${userId}`
      );
      const sortedNotifications = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <>
      <header className="wrapper-header">
        <Button
          className="menu-icon"
          type="link"
          aria-label="Bar icon"
          icon={<MenuOutlined style={{ fontSize: '20px' }} />}
          onClick={() => setOpenDrawer(true)}
        />
        <div className="nav">
          <ul>
            <li>
              <Link to="/about">về chúng tôi</Link>
            </li>

            <li className="show-modal">
              <Link to="/products?category=Thiết bị điện tử">cửa hàng</Link>
              <div className="modal-category">
                <Image src={logo} preview={false} />
                <h1>Danh mục sản phẩm </h1>
                <Divider />
                <div className="list-category">
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
                  </ul>
                  <ul>
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
              </div>
            </li>
            <li>
              <Link to="/contact">liên hệ</Link>
            </li>
          </ul>
        </div>
        <div className="logo">
          <Link to="/">
            <Image src={logo} preview={false} />
          </Link>
        </div>
        <div className="action">
          <ul>
            <li
              className="search-icon"
              onClick={() => {
                setIsModalOpen(!isModalOpen);
              }}
            >
              <SearchIcon />
            </li>
            <li className="favorites">
              <Link to="/favorite">
                <Badge count={favorite}>
                  <HeartIcon />
                </Badge>
              </Link>
            </li>
            <li className="show-modal">
              <UserIcon />
              {auth ? (
                <div className="modal-user">
                  <h1>
                    {greeting},{lastWord}{' '}
                  </h1>
                  <p className="time">
                    Chúng ta đã đồng hành cùng nhau trong{' '}
                    {calculateDaysSinceCreation()} ngày
                  </p>
                  <Divider />
                  <p>
                    <Link to="/profile/1">Đơn hàng của tôi</Link>
                  </p>
                  <p>
                    <Link to="/profile/2">Chờ thanh toán</Link>
                  </p>
                  <p>
                    <Link to="/profile/4">Đơn hàng đã giao</Link>
                  </p>
                  <p>
                    <Link to="/profile/3">Thông tin cá nhân</Link>
                  </p>
                  <Divider />
                  <Button
                    onClick={() => {
                      localStorage.removeItem('auth');
                      navigate('/login');
                    }}
                  >
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="modal-login">
                  <Button
                    onClick={() => {
                      navigate('/login');
                    }}
                  >
                    đăng nhập
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/register');
                    }}
                  >
                    đăng ký tài khoản
                  </Button>
                </div>
              )}
            </li>
            <li className="modal-notification">
              <Badge count={notifications.length}>
                <BellOutlined
                  style={{
                    fontSize: '20px',
                    color: '#777777',
                  }}
                />
              </Badge>
              <div className="notifications-dropdown">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div key={index} className="notification-item">
                      {notification.products.map((product, idx) => (
                        <div key={idx} className="product-info">
                          <div className="image">
                            <img
                              src={`http://localhost:5000/uploads/${product.productId.images[0]}`}
                              alt={product.productId.name}
                              className="product-image"
                            />
                          </div>
                          <div className="render-notification">
                            <p>{product.productId.name}</p>
                            <p>{notification.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="not-notification-item">
                    <ExclamationCircleOutlined />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </li>
            <li>
              <Link to="/cart">
                <Badge count={products.length > 0 ? products.length : 0}>
                  <CartIcon />
                </Badge>
              </Link>
            </li>
          </ul>
        </div>
      </header>

      {/* --------------Modal search------------- */}
      {isModalOpen && (
        <div className="modal-search">
          <div className="header-search">
            <h1>Search</h1>
            <button
              onClick={() => {
                setIsModalOpen(!isModalOpen);
              }}
            >
              <CloseOutlined />
            </button>
          </div>
          <div className="form-search">
            <div className="input-search">
              <Search
                placeholder="Search"
                allowClear
                onChange={(e) => onSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="content-search">
            {searchResults.slice(0, 4).map((product) => (
              <div key={product._id} className="search-result-item">
                <Image
                  src={require(`../../../../server/uploads/${product.images[0]}`)}
                  alt={product.name}
                  preview={false}
                />
                <div className="info-product-search">
                  <h3
                    className="name-product"
                    onClick={handleNavigateProductById(product._id)}
                  >
                    {product.name}
                  </h3>
                  <p>
                    {product.discount ? (
                      <div className="price-discount">
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
                    ) : (
                      <p>
                        <span style={{ color: '#e4003a' }}>
                          {new Intl.NumberFormat().format(product.price)}đ
                        </span>
                      </p>
                    )}
                  </p>
                  <p className="trademark">Chungduc_MO</p>
                </div>
              </div>
            ))}
            {searchResults.length > 4 && (
              <p className="view-all" onClick={handleViewAllSearch}>
                <DoubleLeftOutlined /> -Xem tất cả- <DoubleRightOutlined />
              </p>
            )}
          </div>
        </div>
      )}

      {/*  ------------Menu responsive---------- */}

      <Drawer placement="left" onClose={onClose} open={openDrawer}>
        <div className="logo-mobile">
          {' '}
          <Image src={logo} preview={false} />
        </div>
        <div className="nav-mobile">
          <ul>
            <li>
              <Link to="/">trang chủ</Link>
            </li>
            <li>
              <Link to="/#">cửa hàng</Link>
            </li>
            <li>
              <Link to="/about">về chúng tôi</Link>
            </li>
            <li>
              <Link to="/#">tin tức</Link>
            </li>
            <li>
              <Link to="/contact">liên hệ</Link>
            </li>
            {auth ? (
              <li>
                <Link to="/profile/3">tài khoản của tôi</Link>
              </li>
            ) : (
              ''
            )}
          </ul>
        </div>
        <div className="btn-auth-mobile">
          {auth ? (
            <Button
              onClick={() => {
                localStorage.removeItem('auth');
                navigate('/login');
              }}
            >
              Đăng xuất
            </Button>
          ) : (
            <Button
              onClick={() => {
                localStorage.removeItem('auth');
                navigate('/login');
              }}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default HeaderClient;
