import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Image, Button, Divider, Input, Drawer, Badge } from 'antd';
import image_modal from '../../Assets/image_shop.png';
import axios from 'axios';
import logo from '../../Assets/logo.png';
import UserIcon from '../Icons/UserIcon';
import CartIcon from '../Icons/CartIcon';
import SearchIcon from '../Icons/SearchIcon';
import HeartIcon from '../Icons/HeartIcon';
import './header.scss';

const HeaderClient = () => {
  const { Search } = Input;
  const auth = localStorage.getItem('auth');

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  // !  get last name from full name
  const userName = localStorage.getItem('fullName');
  const newName = userName.split(' ');
  const lastWord = newName[newName.length - 1];

  //* LOGIC - Call api get name

  useEffect(() => {
    document.title = 'Cart Page';

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

  const onSearch = (value) => {
    console.log(value);
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
          // onClick={() => setIsSideMenuMobile(!isSideMenuMobile)}
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
              <Link to="/">cửa hàng</Link>
              <div className="modal-shop">
                <div className="flex">
                  <div className="form-modal">
                    <h3>thời trang</h3>
                    <ul>
                      <li>
                        <Link>women</Link>
                      </li>
                      <li>
                        <Link>man</Link>
                      </li>
                      <li>
                        <Link>bags</Link>
                      </li>
                      <li>
                        <Link>footwear</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="form-modal">
                    <h3>bộ sưu tập</h3>
                    <ul>
                      <li>
                        <Link>thu / đông</Link>
                      </li>
                      <li>
                        <Link>black rose</Link>
                      </li>
                      <li>
                        <Link>romantic</Link>
                      </li>
                      <li>
                        <Link>sky</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="form-modal">
                    <h3>ưu đãi</h3>
                    <ul>
                      <li>
                        <Link>sale</Link>
                      </li>
                      <li>
                        <Link>new arrival</Link>
                      </li>
                      <li>
                        <Link> best seller</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="form-modal-image">
                    <Image preview={false} src={image_modal} />
                  </div>
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
                      // localStorage.removeItem('fullName');
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
                onSearch={onSearch}
                autoFocus
              />
            </div>
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
