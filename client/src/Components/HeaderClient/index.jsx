import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CloseOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  MenuOutlined,
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
  const newName = userName.split(' ');
  const lastWord = newName[newName.length - 1];

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
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    resName();
  }, []);

  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState('');

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
            <li>
              <Link>tin tức</Link>
            </li>
            <li className="show-modal">
              <Link to="/products">cửa hàng</Link>
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
                <Badge count={1}>
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
                  <Divider />
                  <p>
                    <Link to="/profile">Đơn hàng của tôi</Link>
                  </p>
                  <p>
                    <Link to="/">Yêu cầu đổi trả</Link>
                  </p>
                  <p>
                    <Link to="/profile">Thông tin cá nhân</Link>
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
                <Link to="/profile">tài khoản của tôi</Link>
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
