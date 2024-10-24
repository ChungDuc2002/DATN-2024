import { Button, Image, Modal, Radio, Select } from 'antd';
import React, { useEffect, useState } from 'react';
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
  const [selectedValueCategory, setSelectedValueCategory] =
    useState('Thời Trang');
  const [selectedValueColor, setSelectedValueColor] = useState('Black');
  const [selectedValueSize, setSelectedValueSize] = useState('S');
  const [selectedValueType, setSelectedValueType] = useState('textbook');
  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [inventory_quantity, setInventory_Quantity] = useState('');
  const [brand, setBrand] = useState('');
  const [material, setMaterial] = useState('');

  const handleCancel = () => {
    onCancel();
    setImages([]);
  };

  const handleChange = (value) => {
    setSelectedValue(value);
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
    formData.append('category', selectedValueCategory);
    formData.append('color', selectedValueColor);
    formData.append('sizes', selectedValueSize);
    formData.append('type', selectedValueType);

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
  const optionsCategory = [
    {
      label: 'Thời Trang',
      value: 'Thời Trang',
    },
    {
      label: 'Đồ Điện Tử',
      value: 'Đồ Điện Tử',
    },
    {
      label: 'Sách',
      value: 'Sách',
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
      value: 'textbook',
    },
    {
      label: 'Sách tham khảo',
      value: 'reference_books',
    },
    {
      label: 'Truyện',
      value: 'comic',
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
                  <label htmlFor="">Images</label>
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
                  <label htmlFor="">Category</label>
                  <Radio.Group
                    block
                    options={optionsCategory}
                    defaultValue="Thời Trang"
                    optionType="button"
                    buttonStyle="solid"
                    value={selectedValueCategory}
                    onChange={(e) => setSelectedValueCategory(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Kích thước</label>
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
                  <label htmlFor="">Images</label>
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
                  <label htmlFor="">Category</label>
                  <Radio.Group
                    block
                    options={optionsCategory}
                    defaultValue="Đồ Điện Tử"
                    optionType="button"
                    buttonStyle="solid"
                    value={selectedValueCategory}
                    onChange={(e) => setSelectedValueCategory(e.target.value)}
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
                  <label htmlFor="">Images</label>
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
                    style={{ border: 'none', outline: 'none' }}
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                    onFocus={(e) => (e.target.style.outline = 'none')}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Category</label>
                  <Radio.Group
                    block
                    options={optionsCategory}
                    defaultValue="Sách"
                    optionType="button"
                    buttonStyle="solid"
                    value={selectedValueCategory}
                    onChange={(e) => setSelectedValueCategory(e.target.value)}
                  />
                </div>
                <div className="form">
                  <label htmlFor="">Type</label>
                  <Radio.Group
                    block
                    options={optionsTypeBook}
                    defaultValue="textbook"
                    optionType="button"
                    buttonStyle="solid"
                    value={selectedValueType}
                    onChange={(e) => setSelectedValueType(e.target.value)}
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
