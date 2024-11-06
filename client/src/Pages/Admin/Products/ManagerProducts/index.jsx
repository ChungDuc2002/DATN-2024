import { Button, Checkbox, Image, Modal, Radio, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './style.scss';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManagerProduct = () => {
  const [modalAddNewProduct, setModalAddNewProduct] = useState(false);

  useEffect(() => {
    document.title = 'Quản lý sản phẩm';
  }, []);

  const handleCancel = () => {
    setModalAddNewProduct(false);
  };
  return (
    <div className="wrapper-manager-products">
      <div className="wrapper-manager-products-group-btn">
        <Button
          className="btn-add-product"
          onClick={() => {
            setModalAddNewProduct(!modalAddNewProduct);
          }}
        >
          Thêm mới sản phẩm
        </Button>
      </div>
      <h2>product management catalog</h2>
      <div className="wrapper-manager-products-content">
        <div className="form-body">
          <Image
            src="https://www.creativefabrica.com/wp-content/uploads/2022/03/04/Fashion-logo-fashion-clothes-shop-Graphics-26436626-1-1-580x386.png"
            preview={false}
          />
          <h1>Fashions Product </h1>
        </div>
        <div className="form-body">
          <Image
            src="https://st5.depositphotos.com/47283978/61947/v/450/depositphotos_619472118-stock-illustration-retro-vintage-electronic-solder-service.jpg"
            preview={false}
          />
          <h1>Electronics Product </h1>
        </div>
        <div className="form-body">
          <Image
            src="https://static.vecteezy.com/system/resources/previews/022/242/738/non_2x/smart-learning-education-book-shop-store-logo-design-template-free-vector.jpg"
            preview={false}
          />
          <h1>Books Product </h1>
        </div>
      </div>
      <Modal
        open={modalAddNewProduct}
        closeIcon={false}
        footer={false}
        width={950}
      >
        <AddNewProduct onCancel={handleCancel} />
      </Modal>
    </div>
  );
};

function AddNewProduct({ onCancel }) {
  const [selectedValue, setSelectedValue] = useState('Thời Trang');
  const [selectedValueType, setSelectedValueType] = useState('fashion');
  const [selectedValueCategory, setSelectedValueCategory] = useState('');
  const [selectedValueColor, setSelectedValueColor] = useState('Black');
  const [selectedValueSize, setSelectedValueSize] = useState('S');
  const [selectedValueTypeBook, setSelectedValueTypeBook] =
    useState('Sách giáo khoa');
  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [inventory_quantity, setInventory_Quantity] = useState('');
  const [brand, setBrand] = useState('');
  const [material, setMaterial] = useState('');

  const inputRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCancel = () => {
    onCancel();
    setImages([]);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    const imagesArray = [...images];
    imagesArray.forEach((image) => {
      formData.append('images', image);
    });
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('inventory_quantity', inventory_quantity);
    formData.append('brand', brand);
    formData.append('material', material);
    formData.append('type', selectedValueType);
    formData.append('category', selectedValueCategory);
    formData.append('color', selectedValueColor);
    formData.append('sizes', selectedValueSize);
    formData.append('book_category', selectedValueTypeBook);

    try {
      await axios.post(
        'http://localhost:5000/products/createProduct',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Create product success !');
    } catch (error) {
      toast.error('Create product fail !');
    }
  };

  const optionsColor = [
    {
      label: 'Black',
      value: 'Black',
    },
    {
      label: 'White',
      value: 'White',
    },
    {
      label: 'Gray',
      value: 'Gray',
    },
  ];
  const optionsType = [
    {
      label: 'Thời Trang',
      value: 'fashion',
    },
    {
      label: 'Đồ Điện Tử',
      value: 'electronics',
    },
    {
      label: 'Sách',
      value: 'book',
    },
  ];
  const optionsSize = [
    {
      label: 'S',
      value: 'S',
    },
    {
      label: 'M',
      value: 'M',
    },
    {
      label: 'L',
      value: 'L',
    },
    {
      label: 'XL',
      value: 'XL',
    },
  ];
  const optionsTypeBook = [
    {
      label: 'Sách giáo khoa',
      value: 'Sách giáo khoa',
    },
    {
      label: 'Sách tham khảo',
      value: 'Sách tham khảo',
    },
    {
      label: 'Truyện',
      value: 'Truyện',
    },
  ];
  const optionsChecked = [
    {
      label: 'Thiết bị điện tử',
      value: 'Thiết bị điện tử',
    },
    {
      label: 'TV & Home Appliances',
      value: 'TV Home Appliances',
    },
    {
      label: 'Fashion & Clothing',
      value: 'Fashion Clothing',
    },
    {
      label: 'Book & Audible',
      value: 'Book Audible',
    },
    {
      label: 'Accessories',
      value: 'Accessories',
    },
    {
      label: 'Babies & Toys',
      value: 'Babies Toys',
    },
    {
      label: 'Home & Kitchen',
      value: 'Home Kitchen',
    },
    {
      label: 'Sport & Travel',
      value: 'Sport Travel',
    },
    {
      label: 'Home Audio',
      value: 'Home Audio',
    },
  ];

  return (
    <div className="wrapper-add-new-product">
      <form action="" onSubmit={handleSubmit}>
        <h1 className="title-admin">Add New Product</h1>
        <div className="group-select-option">
          <h3>Chọn sản phẩm bạn muốn thêm</h3>
          <Select
            defaultValue="Thời Trang"
            onChange={handleChange}
            options={[
              {
                value: 'Thời Trang',
                label: 'Thời Trang',
              },
              {
                value: 'Đồ Điện Tử',
                label: 'Đồ Điện Tử',
              },
              {
                value: 'Sách ',
                label: 'Sách ',
              },
            ]}
          />
        </div>

        {selectedValue === 'Thời Trang' && (
          <div className="wrapper-add-new-product-fashion">
            <form action="">
              <div className="group-form-input">
                <div className="form">
                  <label htmlFor="">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form">
                  <label htmlFor="">Price</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form">
                  <label htmlFor="">Description</label>
                  <textarea
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Quantity</label>
                  <input
                    type="number"
                    value={inventory_quantity}
                    onChange={(e) => setInventory_Quantity(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  />
                </div>
              </div>
              <div className="group-form-select">
                <div className="form">
                  <label htmlFor="" style={{ display: 'block' }}>
                    Images
                  </label>
                  {images.length > 0 &&
                    Array.from(images).map((image, index) => (
                      <>
                        <div className="form-image">
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Selected"
                            key={index}
                            className="render_add-new-product"
                          />
                          <p>{image.name}</p>{' '}
                        </div>
                      </>
                    ))}
                  <br />
                  <input
                    type="file"
                    ref={inputRef}
                    style={{ border: 'none', outline: 'none' }}
                    multiple
                    onChange={handleImageChange}
                    onFocus={(e) => (e.target.style.outline = 'none')}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Color</label>
                  <Radio.Group
                    block
                    options={optionsColor}
                    defaultValue="Black"
                    optionType="button"
                    buttonStyle="solid"
                    value={selectedValueColor}
                    onChange={(e) => setSelectedValueColor(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Type Product</label>
                  <Radio.Group
                    block
                    options={optionsType}
                    defaultValue="fashion"
                    optionType="button"
                    buttonStyle="solid"
                    value={selectedValueType}
                    onChange={(e) => setSelectedValueType(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Sizes</label>
                  <Radio.Group
                    block
                    options={optionsSize}
                    defaultValue="S"
                    optionType="button"
                    buttonStyle="solid"
                    value={selectedValueSize}
                    onChange={(e) => setSelectedValueSize(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Category</label>
                  <Checkbox.Group
                    options={optionsChecked}
                    value={selectedValueCategory}
                    onChange={(checkedValues) =>
                      setSelectedValueCategory(checkedValues)
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        )}
        {selectedValue === 'Đồ Điện Tử' && (
          <div className="wrapper-add-new-product-electronics">
            <form action="">
              <div className="group-form-input">
                <div className="form">
                  <label htmlFor="">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form">
                  <label htmlFor="">Price</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form">
                  <label htmlFor="">Description</label>
                  <textarea
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Quantity</label>
                  <input
                    type="number"
                    value={inventory_quantity}
                    onChange={(e) => setInventory_Quantity(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  />
                </div>
              </div>
              <div className="group-form-select">
                <div className="form">
                  <label htmlFor="" style={{ display: 'block' }}>
                    Images
                  </label>
                  {images.length > 0 &&
                    Array.from(images).map((image, index) => (
                      <>
                        <div className="form-image">
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Selected"
                            key={index}
                            className="render_add-new-product"
                          />
                          <p>{image.name}</p>{' '}
                        </div>
                      </>
                    ))}
                  <br />
                  <input
                    type="file"
                    ref={inputRef}
                    style={{ border: 'none', outline: 'none' }}
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                    onFocus={(e) => (e.target.style.outline = 'none')}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Color</label>
                  <Radio.Group
                    block
                    options={optionsColor}
                    defaultValue="Black"
                    optionType="button"
                    buttonStyle="solid"
                    value={selectedValueColor}
                    onChange={(e) => setSelectedValueColor(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Type Product</label>
                  <Radio.Group
                    block
                    options={optionsType}
                    defaultValue="electronics"
                    optionType="button"
                    buttonStyle="solid"
                    value={selectedValueType}
                    onChange={(e) => setSelectedValueType(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Category</label>
                  <Checkbox.Group
                    options={optionsChecked}
                    value={selectedValueCategory}
                    onChange={(checkedValues) =>
                      setSelectedValueCategory(checkedValues)
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        )}
        {selectedValue === 'Sách ' && (
          <div className="wrapper-add-new-product-book">
            <form action="">
              <div className="group-form-input">
                <div className="form">
                  <label htmlFor="">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form">
                  <label htmlFor="">Price</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form">
                  <label htmlFor="">Description</label>
                  <textarea
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Quantity</label>
                  <input
                    type="number"
                    value={inventory_quantity}
                    onChange={(e) => setInventory_Quantity(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  />
                </div>
              </div>
              <div className="group-form-select">
                <div className="form">
                  <label htmlFor="" style={{ display: 'block' }}>
                    Images
                  </label>
                  {images.length > 0 &&
                    Array.from(images).map((image, index) => (
                      <>
                        <div className="form-image">
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Selected"
                            key={index}
                            className="render_add-new-product"
                          />
                          <p>{image.name}</p>{' '}
                        </div>
                      </>
                    ))}
                  <br />
                  <input
                    type="file"
                    ref={inputRef}
                    style={{ border: 'none', outline: 'none' }}
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                    onFocus={(e) => (e.target.style.outline = 'none')}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Type Product</label>
                  <Radio.Group
                    block
                    options={optionsType}
                    defaultValue="book"
                    optionType="button"
                    buttonStyle="solid"
                    value={selectedValueType}
                    onChange={(e) => setSelectedValueType(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Type Book</label>
                  <Radio.Group
                    block
                    options={optionsTypeBook}
                    defaultValue="Sách giáo khoa"
                    optionType="button"
                    buttonStyle="solid"
                    value={selectedValueTypeBook}
                    onChange={(e) => setSelectedValueTypeBook(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Category</label>
                  <Checkbox.Group
                    options={optionsChecked}
                    value={selectedValueCategory}
                    onChange={(checkedValues) =>
                      setSelectedValueCategory(checkedValues)
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="group-btn">
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}

export default ManagerProduct;
