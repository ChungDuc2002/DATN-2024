import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Modal, Pagination, Radio, Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import './style.scss';
import toast from 'react-hot-toast';

const ElectronicsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productPage = 4;
  useEffect(() => {
    document.title = 'Electronics Page';
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/products/getProductByType',
          {
            params: {
              type: 'electronics',
            },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchProducts();
  }, []);

  //* LOGIC PAGINATION---------------
  const indexOfLastUser = currentPage * productPage;
  const indexOfFirstUser = indexOfLastUser - productPage;
  const currentUsers = products.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPrice = (price) => {
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
    return formattedPrice;
  };
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <img
          src={require(`../../../../../../server/uploads/${record.images[0]}`)}
          alt={record.title}
          className="render_image"
        />
      ),
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => renderPrice(text),
    },
    {
      title: 'Quantity',
      dataIndex: 'inventory_quantity',
      key: 'inventory_quantityinventory_quantity',
    },

    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    // {
    //   title: 'Size',
    //   dataIndex: 'sizes',
    //   key: 'sizes',
    // },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
    },
    {
      title: 'Updated At',
      key: 'updatedAt',
      render: (text, record) => (
        <span>
          {moment(record.updatedAt).format('DD/MM/YYYY - h :mm :ss a')}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button
            style={{ marginRight: '5px' }}
            className="btn-action"
            onClick={() => {
              handleEditProduct(record);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            className="btn-action"
            onClick={() => {
              handleDeleteProduct(record);
            }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleEditProduct = (record) => {
    setOpen(true);
    console.log(record);
    setItem(record._id);
  };

  const handleDeleteProduct = async (record) => {
    if (window.confirm('Bạn có chắc muốn xóa banner này không ?')) {
      try {
        const result = await axios.delete(
          `http://localhost:5000/products/deleteProduct/${record._id}`
        );
        if (result.status === 200) {
          const newBanner = products.filter((item) => item._id !== record._id);
          setProducts(newBanner);
          toast.success('Delete banner success');
        }
      } catch (error) {
        toast.error('Delete banner fail');
      }
    }
  };

  return (
    <div className="wrapper-fashion-page">
      <Table columns={columns} dataSource={currentUsers} pagination={false} />
      <Pagination
        current={currentPage}
        pageSize={productPage}
        total={products.length}
        onChange={handlePageChange}
      />
      <Modal
        open={open}
        // onCancel={handleCancel}
        closeIcon={false}
        footer={false}
        width={950}
      >
        {item && <ModalEditProduct id={item} onCancel={handleCancel} />}
      </Modal>
    </div>
  );
};

function ModalEditProduct({ id, onCancel }) {
  const [productId, setProductId] = useState({});
  const [images, setImages] = useState([]);
  const [imageUpdate, setImageUpdate] = useState([]);
  //! --------------------
  const [selectedValueColor, setSelectedValueColor] = useState('');
  const [selectedValueTypeProduct, setSelectedValueTypeProduct] = useState('');
  const [selectedValueCategory, setSelectedValueCategory] = useState('');

  // State để theo dõi việc có chọn hình ảnh hay không
  const [isImageSelected, setIsImageSelected] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/products/getProductById/${id}`
        );
        setProductId(response.data);
        console.log('id', productId);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (productId.color) {
      setSelectedValueColor(productId.color);
    }
    if (productId.category) {
      setSelectedValueTypeProduct(productId.type);
    }
    if (productId.category) {
      setSelectedValueCategory(productId.category);
    }
  }, [productId]);

  const handleCancel = () => {
    onCancel();
    setImageUpdate([]);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);
    const imageUrls = selectedImages.map((image) => URL.createObjectURL(image));
    setImageUpdate(imageUrls);
    setIsImageSelected(true); // Đã chọn hình ảnh
  };

  const handleSubmit = async (e) => {
    if (!isImageSelected) {
      e.preventDefault();
      toast.error('Please select image');
      return;
    }
    const formData = new FormData();
    formData.append('name', productId.name);
    const imagesArray = [...images];
    imagesArray.forEach((image) => {
      formData.append('images', image);
    });
    formData.append('price', productId.price);
    formData.append('discount', productId.discount);
    formData.append('description', productId.description);
    formData.append('inventory_quantity', productId.inventory_quantity);
    formData.append('brand', productId.brand);
    formData.append('material', productId.material);
    formData.append('color', selectedValueColor);
    formData.append('type', selectedValueTypeProduct);
    formData.append('category', selectedValueCategory);

    try {
      const result = await axios.put(
        `http://localhost:5000/products/updateProduct/${id}`,
        formData
      );
      console.log(result);
      if (result.status === 200) {
        toast.success('Update product success');
        onCancel();
      }
    } catch (error) {
      toast.error('Update product fail');
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
    <div className="wrapper-modal-edit-product">
      <form action="" onSubmit={handleSubmit}>
        <h1 className="title-admin">Edit Fashion Product</h1>
        <div className="body">
          <div className="group-form-input">
            <div className="form">
              <label htmlFor="">Name</label>
              <input
                type="text"
                value={productId.name}
                onChange={(e) =>
                  setProductId({ ...productId, name: e.target.value })
                }
              />
            </div>
            <div className="form">
              <label htmlFor="">Price</label>
              <input
                type="number"
                value={productId.price}
                onChange={(e) =>
                  setProductId({ ...productId, price: e.target.value })
                }
              />
            </div>
            <div className="form">
              <label htmlFor="">Discount (%)</label>
              <input
                type="number"
                value={productId.discount}
                onChange={(e) =>
                  setProductId({ ...productId, discount: e.target.value })
                }
              />
            </div>
            <div className="form">
              <label htmlFor="">Description</label>
              <textarea
                value={productId.description}
                onChange={(e) =>
                  setProductId({ ...productId, description: e.target.value })
                }
              />
            </div>
            <div className="form">
              <label htmlFor="">Quantity</label>
              <input
                type="number"
                value={productId.inventory_quantity}
                onChange={(e) =>
                  setProductId({
                    ...productId,
                    inventory_quantity: e.target.value,
                  })
                }
              />
            </div>
            <div className="form">
              <label htmlFor="">Brand</label>
              <input
                type="text"
                value={productId.brand}
                onChange={(e) =>
                  setProductId({ ...productId, brand: e.target.value })
                }
              />
            </div>
            <div className="form">
              <label htmlFor="">Material</label>
              <input
                type="text"
                value={productId.material}
                onChange={(e) =>
                  setProductId({ ...productId, material: e.target.value })
                }
              />
            </div>
          </div>
          <div className="group-form-select">
            <div className="form">
              <label htmlFor="" style={{ display: 'block' }}>
                Image
              </label>
              {imageUpdate.length > 0
                ? imageUpdate.map((imageUrl, index) => (
                    <div key={index} className="image-item">
                      <img
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        className="render_add-new-product"
                      />
                      <p>{images[index].name}</p>
                    </div>
                  ))
                : productId.images &&
                  productId.images.map((image, index) => (
                    <div key={index} className="image-item">
                      <img
                        src={require(`../../../../../../server/uploads/${image}`)}
                        alt={`Image ${index + 1}`}
                        className="render_add-new-product"
                      />
                      <p>{image.name}</p>
                    </div>
                  ))}
              <input
                type="file"
                style={{ border: 'none', outline: 'none' }}
                onChange={handleImageChange}
                ref={inputRef}
                onFocus={(e) => (e.target.style.outline = 'none')}
                multiple
              />
            </div>
            <div className="form">
              <label htmlFor="">Color</label>
              <Radio.Group
                block
                options={optionsColor}
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
                optionType="button"
                buttonStyle="solid"
                value={selectedValueTypeProduct}
                onChange={(e) => setSelectedValueTypeProduct(e.target.value)}
              />
            </div>
            <div className="form">
              <label htmlFor="">Category</label>
              <Checkbox.Group
                options={optionsChecked}
                defaultValue={['Thiết bị điện tử']}
                value={selectedValueCategory}
                onChange={(checkedValues) =>
                  setSelectedValueCategory(checkedValues)
                }
              />
            </div>
          </div>
        </div>
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
export default ElectronicsPage;
