import React from 'react';
import { Checkbox } from 'antd';
const BookPage = () => {
  const optionsChecked = [
    {
      label: 'Apple',
      value: 'Apple',
    },
    {
      label: 'Pear',
      value: 'Pear',
    },
    {
      label: 'Orange',
      value: 'Orange',
    },
  ];
  return (
    <div>
      <Checkbox.Group
        options={optionsChecked}
        defaultValue={['Pear']}
        // onChange={onChange}
      />
    </div>
  );
};

export default BookPage;
