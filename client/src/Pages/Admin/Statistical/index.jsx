import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  UserOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import Set from 'core-js-pure/features/set';
import './style.scss';

const Statistical = () => {
  const [chartData, setChartData] = useState({});
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filter, setFilter] = useState('day');

  useEffect(() => {
    document.title = 'Statistical Page';
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:5000/user-count-over-time?filter=${filter}`
        );
        const productResponse = await axios.get(
          `http://localhost:5000/products/product-count-over-time?filter=${filter}`
        );
        const orderResponse = await axios.get(
          `http://localhost:5000/orders/order-count-over-time?filter=${filter}`
        );
        const revenueResponse = await axios.get(
          `http://localhost:5000/orders/total-revenue?filter=${filter}`
        );

        if (
          Array.isArray(userResponse.data) &&
          Array.isArray(productResponse.data) &&
          Array.isArray(orderResponse.data)
        ) {
          const userLabels = userResponse.data.map((item) => item._id);
          const userData = userResponse.data.map((item) => item.count);

          const productLabels = productResponse.data.map((item) => item._id);
          const productData = productResponse.data.map((item) => item.count);

          const orderLabels = orderResponse.data.map((item) => item._id);
          const orderData = orderResponse.data.map((item) => item.count);

          const labels = [
            ...Array.from(
              new Set([...userLabels, ...productLabels, ...orderLabels])
            ),
          ];

          const totalUserCount = userData.reduce(
            (acc, count) => acc + count,
            0
          );
          const totalProductCount = productData.reduce(
            (acc, count) => acc + count,
            0
          );
          const totalOrderCount = orderData.reduce(
            (acc, count) => acc + count,
            0
          );

          setTotalUserCount(totalUserCount);
          setTotalProductCount(totalProductCount);
          setTotalOrderCount(totalOrderCount);
          setTotalRevenue(revenueResponse.data.totalAmount);

          setChartData({
            labels,
            datasets: [
              {
                label: `Số lượng người dùng ${new Date().getFullYear()}`,
                data: labels.map((label) => {
                  const index = userLabels.indexOf(label);
                  return index !== -1 ? userData[index] : 0;
                }),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
              },
              {
                label: `Số lượng sản phẩm ${new Date().getFullYear()}`,
                data: labels.map((label) => {
                  const index = productLabels.indexOf(label);
                  return index !== -1 ? productData[index] : 0;
                }),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
              },
              {
                label: `Số lượng đơn hàng ${new Date().getFullYear()}`,
                data: labels.map((label) => {
                  const index = orderLabels.indexOf(label);
                  return index !== -1 ? orderData[index] : 0;
                }),
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
              },
              {
                label: 'Tổng số lượng người dùng',
                data: Array(labels.length).fill(totalUserCount),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderDash: [5, 5],
              },
              {
                label: 'Tổng số lượng sản phẩm',
                data: Array(labels.length).fill(totalProductCount),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderDash: [5, 5],
              },
              {
                label: 'Tổng số lượng đơn hàng',
                data: Array(labels.length).fill(totalOrderCount),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderDash: [5, 5],
              },
            ],
          });
        } else {
          console.error(
            'API response is not an array:',
            userResponse.data,
            productResponse.data,
            orderResponse.data
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [filter]);

  useEffect(() => {
    console.log('Chart data:', chartData);
  }, [chartData]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="wrapper-manager-statistical">
      <div className="wrapper-manager-statistical-header">
        <div className="select">
          <select onChange={handleFilterChange}>
            <option value="day">Ngày</option>
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
        </div>
        <div className="content">
          <div className="total-user">
            <div className="icon">
              <UserOutlined />
            </div>
            <div className="render">
              <p>Tổng số người dùng</p>
              <p>{totalUserCount}</p>
            </div>
          </div>
          <div className="total-product">
            <div className="icon">
              <ProductOutlined />
            </div>
            <div className="render">
              <p>Tổng số sản phẩm</p>
              <p>{totalProductCount}</p>
            </div>
          </div>
          <div className="total-order">
            <div className="icon">
              <ShoppingCartOutlined />
            </div>
            <div className="render">
              <p>Tổng số đơn hàng</p>
              <p>{totalOrderCount}</p>
            </div>
          </div>
          <div className="total-price">
            <div className="icon">
              <MoneyCollectOutlined />
            </div>
            <div className="render">
              <p>Tổng doanh thu</p>
              <p>
                {totalRevenue.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="wrapper-manager-statistical-body">
        <div className="title">
          <h2>overview</h2>
          <p>Statistics , Predictive Analytics Data , Big Data , ...</p>
        </div>
        <div className="products-category">
          <div className="chart-container">
            {chartData.labels ? (
              <Line data={chartData} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistical;
