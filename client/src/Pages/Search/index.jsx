import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Col, Row, Divider } from 'antd';
import CardComponent from './../../Components/Card/index';
import './style.scss';

const SearchPage = () => {
  //! State to store search results
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  //! Get the current URL location
  const location = useLocation();

  //! State to store filter options
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

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
              params: {
                name: searchQuery,
                sort: sortOption,
                categories: selectedCategories.join(','),
                prices: selectedPrices.join(','),
              },
            }
          );
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    };

    fetchSearchResults();
  }, [location.search, sortOption, selectedCategories, selectedPrices]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategories((prevCategories) =>
      e.target.checked
        ? [...prevCategories, category]
        : prevCategories.filter((c) => c !== category)
    );
  };

  const handlePriceChange = (e) => {
    const price = e.target.value;
    setSelectedPrices((prevPrices) =>
      e.target.checked
        ? [...prevPrices, price]
        : prevPrices.filter((p) => p !== price)
    );
  };

  return (
    <div className="container wrapper-search">
      {' '}
      <div className="filter-search">
        <h1>Bộ Lọc</h1>
        <div className="filter-item">
          <h3>Category</h3>
          <ul>
            <li>
              <input
                type="checkbox"
                name=""
                id=""
                value="Thiết bị điện tử"
                onChange={handleCategoryChange}
              />
              <label htmlFor="">Thiết bị điện tử</label>
            </li>
            <li>
              <input
                type="checkbox"
                name=""
                id=""
                value="Fashion Clothing"
                onChange={handleCategoryChange}
              />
              <label htmlFor="">Fashion & Clothing</label>
            </li>
            <li>
              <input
                type="checkbox"
                name=""
                id=""
                value="Book Audible"
                onChange={handleCategoryChange}
              />
              <label htmlFor="">Book & Audible</label>
            </li>
            <li>
              <input
                type="checkbox"
                name=""
                id=""
                value="Accessories"
                onChange={handleCategoryChange}
              />
              <label htmlFor="">Accessories</label>
            </li>
            <li>
              <input
                type="checkbox"
                name=""
                id=""
                value=" Sport Travel"
                onChange={handleCategoryChange}
              />
              <label htmlFor=""> Sport & Travel</label>
            </li>
            <li>
              <input
                type="checkbox"
                name=""
                id=""
                value="Home Kitchen"
                onChange={handleCategoryChange}
              />
              <label htmlFor="">Home & Kitchen</label>
            </li>
            <li>
              <input
                type="checkbox"
                name=""
                id=""
                value="TV Home Appliances"
                onChange={handleCategoryChange}
              />
              <label htmlFor="">TV & Home Appliances</label>
            </li>
            <li>
              <input
                type="checkbox"
                name=""
                id=""
                value="Babies Toys"
                onChange={handleCategoryChange}
              />
              <label htmlFor="">Babies & Toys</label>
            </li>
          </ul>
        </div>
        <div className="filter-item">
          <h3>Price</h3>
          <ul>
            <li>
              <input
                type="checkbox"
                name=""
                id=""
                value="0-500000"
                onChange={handlePriceChange}
              />
              <label htmlFor="">0 - 500.000</label>
            </li>
            <li>
              <input
                type="checkbox"
                name=""
                id=""
                value="500000-1000000"
                onChange={handlePriceChange}
              />
              <label htmlFor="">500.000 - 1.000.0000</label>
            </li>
            <li>
              <input
                type="checkbox"
                name=""
                id=""
                value="1000000-N"
                onChange={handlePriceChange}
              />
              <label htmlFor="">1.000.000 - N</label>
            </li>
          </ul>
        </div>
      </div>
      <div className="search-results">
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
        <Divider />
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
