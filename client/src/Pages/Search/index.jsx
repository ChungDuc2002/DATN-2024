import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './style.scss';
import { Col, Row } from 'antd';
import CardComponent from './../../Components/Card/index';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const location = useLocation();

  useEffect(() => {
    const fetchSearchResults = async () => {
      const query = new URLSearchParams(location.search);
      const searchQuery = query.get('query');
      setSearchQuery(searchQuery);
      if (searchQuery) {
        try {
          const response = await axios.get(
            `http://localhost:5000/products/searchProductByName`,
            {
              params: { name: searchQuery, sort: sortOption },
            }
          );
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    };

    fetchSearchResults();
  }, [location.search, sortOption]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="wrapper-search">
      {' '}
      <div className="container search-results">
        <div className="search-results-header">
          <h1>
            Kết quả tìm kiếm cho : {'" '} {searchQuery}
            {' "'}
          </h1>
          <div className="group-select">
            <p>Hiển thị theo</p>
            <select
              name=""
              id=""
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>
        </div>
        <Row gutter={[16, 16]}>
          {searchResults.map((result, index) => (
            <Col key={index} xs={24} sm={24} md={12} lg={12} xl={6}>
              <CardComponent product={result} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default SearchPage;
