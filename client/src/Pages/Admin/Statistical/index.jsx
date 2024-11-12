import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, PolarArea } from 'react-chartjs-2';
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
import './style.scss';

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

const Statistical = () => {
  const [chartData, setChartData] = useState({});
  const [productChartData, setProductChartData] = useState({});
  const [productCategoryData, setProductCategoryData] = useState({});

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const chartResponse = await axios.get(
          'http://localhost:5000/user-count-over-time'
        );

        if (Array.isArray(chartResponse.data)) {
          const labels = chartResponse?.data?.map((item) => item._id);
          const data = chartResponse?.data?.map((item) => item.count);

          const totalUserCount = data.reduce((acc, count) => acc + count, 0);
          setChartData({
            labels,
            datasets: [
              {
                label: `Số lượng người dùng ${new Date().getFullYear()}`,
                data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
              },
              {
                label: 'Tổng số lượng người dùng',
                data: Array(data.length).fill(totalUserCount),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderDash: [5, 5],
              },
            ],
          });
        } else {
          console.error('API response is not an array:', chartResponse.data);
        }

        const productChartResponse = await axios.get(
          'http://localhost:5000/products/product-count-over-time'
        );
        console.log('Product API Response:', productChartResponse.data);

        // Kiểm tra và xử lý dữ liệu trả về từ API
        if (Array.isArray(productChartResponse.data)) {
          const productLabels = productChartResponse.data.map(
            (item) => item._id
          );
          const productData = productChartResponse.data.map(
            (item) => item.count
          );

          console.log('Product Labels:', productLabels); // Log labels
          console.log('Product Data:', productData); // Log data

          // Tính tổng số lượng sản phẩm
          const totalProductCount = productData.reduce(
            (acc, count) => acc + count,
            0
          );

          setProductChartData({
            labels: productLabels,
            datasets: [
              {
                label: `Số lượng sản phẩm ${new Date().getFullYear()}`,
                data: productData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
              },
              {
                label: 'Tổng số lượng sản phẩm',
                data: Array(productData.length).fill(totalProductCount),
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderDash: [5, 5],
              },
            ],
          });
        } else {
          console.error(
            'Product API response is not an array:',
            productChartResponse.data
          );
        }
        const productCategoryResponse = await axios.get(
          'http://localhost:5000/products/product-count-by-category'
        );
        console.log(
          'Product Category API Response:',
          productCategoryResponse.data
        );

        // Kiểm tra và xử lý dữ liệu trả về từ API
        if (Array.isArray(productCategoryResponse.data)) {
          const labels = productCategoryResponse.data.map((item) => item._id);
          const data = productCategoryResponse.data.map((item) => item.count);

          console.log('Product Category Labels:', labels); // Log labels
          console.log('Product Category Data:', data); // Log data

          setProductCategoryData({
            labels,
            datasets: [
              {
                label: 'Số lượng sản phẩm theo danh mục',
                data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error(
            'Product Category API response is not an array:',
            productCategoryResponse.data
          );
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };
    fetchUserCount();
  }, []);

  useEffect(() => {
    console.log('Chart data:', chartData);
  }, [chartData]);

  return (
    <div className="wrapper-manager-statistical">
      <div className="wrapper-manager-statistical-header">
        <div className="users">
          <div className="chart-container">
            {chartData.labels ? (
              <Line data={chartData} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>
          <h3>Total Users</h3>
        </div>
        <div className="products">
          <div className="chart-container">
            {productChartData.labels ? (
              <Line data={productChartData} />
            ) : (
              <p>Loading product chart...</p>
            )}
          </div>
          <h3>Total Products</h3>
        </div>
      </div>
      <div className="wrapper-manager-statistical-body">
        <div className="products-category">
          {' '}
          <div className="chart-container">
            {productCategoryData.labels ? (
              <PolarArea data={productCategoryData} />
            ) : (
              <p>Loading product category chart...</p>
            )}
          </div>
          <h3>Product By Category</h3>
        </div>
      </div>
    </div>
  );
};

export default Statistical;
