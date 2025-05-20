import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import './style.scss';
import toast from 'react-hot-toast';

const ManagerFeaturedCategory = () => {
  const [modalAddNewFeaturedCategory, setModalAddNewFeaturedCategory] =
    useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [idFeaturedCategory, setIdFeaturedCategory] = useState(null);
  const [listFeaturedCategory, setListFeaturedCategory] = useState([]);

  useEffect(() => {
    document.title = 'Quản lý danh mục nổi bật';
    const getAllFeaturedCategory = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/featured_categories/getAllFeaturedCategories'
        );
        setListFeaturedCategory(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllFeaturedCategory();
  }, []);

  //* Table render
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <img
          src={require(`../../../../../../server/uploads/${record.image}`)}
          alt={record.title}
          className="render_image"
        />
      ),
    },
    { title: 'Tiêu đề', dataIndex: 'name', key: 'name' },
    {
      title: 'Created At',
      key: 'createdAt',
      render: (text, record) => (
        <span>
          {moment(record.createdAt).format('DD/MM/YYYY - h :mm :ss a')}
        </span>
      ),
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
              handleEditFeaturedCategory(record);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            className="btn-action"
            onClick={() => {
              handleDeleteFeaturedCategory(record);
            }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  const handleEditFeaturedCategory = (record) => {
    setIdFeaturedCategory(record._id);
    setOpenModalEdit(true);
  };

  const handleDeleteFeaturedCategory = async (record) => {
    if (
      window.confirm('Are you sure you want to delete this featured category ?')
    ) {
      try {
        const result = await axios.delete(
          `http://localhost:5000/featured_categories/deleteFeaturedCategory/${record._id}`
        );
        if (result.status === 200) {
          toast.success('Delete featured category success');
          const newFeaturedCategory = listFeaturedCategory.filter(
            (item) => item._id !== record._id
          );
          setListFeaturedCategory(newFeaturedCategory);
        }
      } catch (error) {
        toast.error('Delete featured category fail !');
      }
    }
  };

  const handleCancel = () => {
    setModalAddNewFeaturedCategory(false);
    setOpenModalEdit(false);
  };
  return (
    <div className="wrapper-manager-feature-category">
      <div className="group-btn">
        <Button
          className="btn-add-feature-category"
          onClick={() => {
            setModalAddNewFeaturedCategory(!modalAddNewFeaturedCategory);
          }}
        >
          Thêm mới danh mục nổi bật
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={listFeaturedCategory}
        pagination={{ pageSize: 4 }}
      />
      <Modal
        open={modalAddNewFeaturedCategory}
        onCancel={handleCancel}
        closeIcon={false}
        footer={false}
      >
        <AddNewFeaturedCategory onCancel={handleCancel} />
      </Modal>
      <Modal
        open={openModalEdit}
        onCancel={handleCancel}
        closeIcon={false}
        footer={false}
      >
        {idFeaturedCategory && (
          <ModalEditFeaturedCategory
            id={idFeaturedCategory}
            onCancel={handleCancel}
          />
        )}
      </Modal>
    </div>
  );
};

function AddNewFeaturedCategory({ onCancel }) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const onInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitImage = async () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('link', link);

    await axios.post(
      'http://localhost:5000/featured_categories/createFeaturedCategory',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="wrapper-add-banner">
      <h1 className="title-admin">Thêm mới danh mục nổi bật</h1>
      <form action="" onSubmit={submitImage}>
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Selected"
            className="render_add-new-banner"
          />
        )}
        <input type="file" accept="image/*" onChange={onInputChange} />
        <input
          type="text"
          placeholder="Tiêu đề"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Slug"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
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

function ModalEditFeaturedCategory({ id, onCancel }) {
  const [imageUpdate, setImageUpdate] = useState();
  const [previewImage, setPreviewImage] = useState(null);
  const [featuredCategoryUpdate, setFeaturedCategoryUpdate] = useState(null);

  //! State để theo dõi việc có chọn hình ảnh hay không
  const [isImageSelected, setIsImageSelected] = useState(false);

  useEffect(() => {
    const getFeaturedCategoryById = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/featured_categories/getFeaturedCategoryById/${id}`
        );
        setFeaturedCategoryUpdate(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFeaturedCategoryById();
    console.log(imageUpdate);
  }, []);
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsImageSelected(true);
    } else {
      setIsImageSelected(false);
    }
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUpdate(file);
      setPreviewImage(reader.result);
      setFeaturedCategoryUpdate({ ...featuredCategoryUpdate, image: file });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleUpdate = async (e) => {
    if (!isImageSelected) {
      e.preventDefault();
      alert('Please select image');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('image', featuredCategoryUpdate.image);
      formData.append('name', featuredCategoryUpdate.name);
      formData.append('link', featuredCategoryUpdate.link);

      const result = await axios.put(
        `http://localhost:5000/featured_categories/updateFeaturedCategory/${id}`,
        formData
      );
      if (result.status === 200) {
        toast.success('Update featured category success');
      }
      console.log(featuredCategoryUpdate.image);
    } catch (error) {
      toast.error('Update featured category fail !');
    }
  };

  const handleCancel = () => {
    onCancel();
  };
  return (
    <div className="wrapper-edit-banner">
      <h1 className="title-admin">Edit Banner</h1>
      <form action="" onSubmit={handleUpdate}>
        {featuredCategoryUpdate && (
          <div className="form_edit">
            {featuredCategoryUpdate.image && (
              <img
                src={
                  previewImage ||
                  require(`../../../../../../server/uploads/${featuredCategoryUpdate.image}`)
                }
                alt="Banner"
                className="render_img"
              />
            )}

            <input
              type="file"
              onChange={handleImageChange}
              style={{ border: 'none', padding: '0' }}
            />
            <input
              type="text"
              value={featuredCategoryUpdate.name}
              onChange={(e) =>
                setFeaturedCategoryUpdate({
                  ...featuredCategoryUpdate,
                  name: e.target.value,
                })
              }
            />
            <input
              type="text"
              value={featuredCategoryUpdate.link}
              onChange={(e) =>
                setFeaturedCategoryUpdate({
                  ...featuredCategoryUpdate,
                  link: e.target.value,
                })
              }
            />
            <div className="group-btn">
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
export default ManagerFeaturedCategory;
