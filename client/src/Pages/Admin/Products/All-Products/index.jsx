import React from 'react';
import { Input } from 'antd';

const AllProductsPage = () => {
  const { Search } = Input;

  return (
    <div className="wrapper-all-products">
      {' '}
      <div className="wrapper-all-products-header">
        <Search
          placeholder="Search by order code ..."
          allowClear
          // onChange={(e) => onSearch(e.target.value)}
          // onSearch={handleSearch}
          //   onChange={handleSearchChange}
        />
        <div className="group-select">
          <select>
            <option value="all">Filter</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      <div className="wrapper-all-products-body"></div>
    </div>
  );
};

export default AllProductsPage;
