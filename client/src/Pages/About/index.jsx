import React from 'react';
import './style.scss';
import { Image } from 'antd';
import CountUp from 'react-countup';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import FreeShipIcon from './../../Components/Icons/FreeShipIcon';
import SupportIcon from './../../Components/Icons/SupportIcon';
import PayMentIcon from './../../Components/Icons/PayMentIcon';
import StoreLocationIcon from './../../Components/Icons/StoreLocationIcon';
const mockdata = [
  {
    icon: <FreeShipIcon />,
    title: 'Free Shipping',
    des: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.',
  },
  {
    icon: <SupportIcon />,
    title: 'Support 24/7',
    des: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.',
  },
  {
    icon: <PayMentIcon />,
    title: 'Payment Secure',
    des: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.',
  },
  {
    icon: <StoreLocationIcon />,
    title: 'Store Location',
    des: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.',
  },
];
const AboutPage = () => {
  return (
    <div className="wrapper-about">
      <div className="wrapper-about-banner">
        <Image
          preview={false}
          src="https://trendstore.monamedia.net/wp-content/uploads/2024/01/about_image-2.jpg"
        />
        <h1 className="title-page-user">Về chúng tôi</h1>
      </div>
      <div className="container wrapper-about-info">
        <div className="form-image">
          <Image
            preview={false}
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </div>
        <div className="form-info">
          <h3>
            Câu chuyện về Duck_ Fashion bắt đầu vào năm 1985 với một cửa hàng
            nhỏ nằm ở Milan, Italy và với một sứ mệnh rõ ràng: tôn vinh và trao
            quyền cho phụ nữ thông qua quần áo tinh tế và phụ kiện tinh tế.
          </h3>
          <p>
            Hôm nay, chúng tôi khen ngợi bạn vì hành trình thú vị của niềm tin
            và phong cách. Bằng cách lắng nghe chặt chẽ và nắm lấy mong muốn của
            bạn, rất vui được mời bạn đến điểm đến mua sắm trực tuyến mới của
            bạn.
          </p>
          <p>
            Chúng tôi tự hào cống hiến hết mình để định hình thế giới trong đó
            mọi phụ nữ đều cảm thấy thoải mái và cảm hứng cần thiết để phát
            triển và thể hiện phong cách cá nhân của mình. Quần áo và phụ kiện
            là những phần mở rộng tô màu cho ngày của phụ nữ hiện đại. Vì lý do
            này, các đối tác với các thương hiệu uy tín, như Salvatore
            Ferragamo, Valentino, Versace, Gucci, Emilio Pucci, Roberto Cavalli,
            Bottega Veneta… và nhiều thương hiệu khác, những người đặt tiêu
            chuẩn cao trong việc chế tạo các thiết kế độc đáo, sử dụng các loại
            vải cao cấp.
          </p>
        </div>
      </div>
      <div className="wrapper-about-parameter">
        <div className="container">
          <div className="wrapper-about-parameter-content">
            <div className="wrapper-about-parameter-content-item">
              <h3>
                <CountUp end={70} duration={10} />%
              </h3>
              <p>Bán hàng trực tiếp</p>
            </div>
            <div className="wrapper-about-parameter-content-item">
              <h3>
                <CountUp end={64} duration={10} />+
              </h3>
              <p>Thị trường</p>
            </div>
            <div className="wrapper-about-parameter-content-item">
              <h3>
                {' '}
                <CountUp end={300} duration={10} />+
              </h3>
              <p>Nhân viên</p>
            </div>
            <div className="wrapper-about-parameter-content-item">
              <h3>
                {' '}
                <CountUp end={1000} duration={10} />+
              </h3>
              <p>Khách hàng hài lòng</p>
            </div>
          </div>
        </div>
      </div>
      <div className="wrapper-about-service">
        <div className="container">
          <h2>Dịch vụ</h2>
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
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
                slidesPerView: 2,
                spaceBetween: 12,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
          >
            {mockdata?.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="wrapper-about-service-item">
                  <span>{item.icon}</span>
                  <div className="wrapper-about-service-item-content">
                    <h3>{item.title}</h3>
                    <p>{item.des}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="wrapper-about-banner_second">
        <div className="form-image">
          <Image
            preview={false}
            src="https://trendstore.monamedia.net/wp-content/uploads/2024/01/p_bg.jpg"
          />
          <div className="content">
            <h3>phong cách</h3>
            <p>Tôi không chỉ thiết kế quần áo. Tôi thiết kế những giấc mơ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
