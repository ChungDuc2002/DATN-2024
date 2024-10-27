import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Pagination, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './style.scss';
import toast from 'react-hot-toast';
import moment from 'moment';

const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  //* LOGIC GET ALL USERS---------------
  useEffect(() => {
    document.title = 'Quản lý người dùng';
    const fetchUser = async () => {
      const token = localStorage.getItem('authAdmin');
      const tokenParse = JSON.parse(token);
      try {
        const res = await axios.get('http://localhost:5000/getAllUsers', {
          headers: {
            token: `Bearer ${tokenParse}`,
          },
        });
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  //* LOGIC PAGINATION---------------
  // Tính toán chỉ mục bắt đầu và kết thúc của người dùng trên trang hiện tại
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Xử lý sự kiện chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //* LOGIC TABLE USERS---------------
  const columns = [
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },

    {
      title: 'Created At',
      key: 'createdAt',
      render: (text, record) => (
        <span>{moment(record.createdAt).format('DD/MM/YYYY')}</span>
      ),
    },
    {
      title: 'Updated At',
      key: 'createdAt',
      render: (text, record) => (
        <span>{moment(record.updatedAt).format('DD/MM/YYYY - h:mm:ss a')}</span>
      ),
    },
    {
      title: 'Role',
      key: 'isAdmin',
      render: (text, record) => (
        <span
          className={record.isAdmin ? 'role_render-admin' : 'role_render-user'}
        >
          {record.isAdmin ? 'Admin' : 'User'}
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
            onClick={() => {
              handleEdit(record);
            }}
            className="btn-action"
          >
            <EditOutlined />
          </Button>
          <Button
            onClick={() => {
              handleDelete(record);
            }}
            className="btn-action"
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  //* LOGIC DELETE USER---------------
  const handleDelete = async (record) => {
    if (
      window.confirm(`Are you sure you want to detete user ${record.fullName}`)
    ) {
      try {
        const result = await axios.delete(
          `http://localhost:5000/deleteUser/${record._id}`
        );
        if (result.status === 200) {
          const newUser = users.filter((user) => user._id !== record._id);
          setUsers(newUser);
          toast.success('Delete user success');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //* LOGIC OPEN MODAL UPDATE USER---------------
  const [open, setOpen] = React.useState(false);
  const [modalAddNewUser, setModalAddNewUser] = React.useState(false);
  const [item, setItem] = React.useState(false);

  const handleCancel = () => {
    setOpen(false);
    setModalAddNewUser(false);
  };
  const handleEdit = (record) => {
    setOpen(true);
    setItem(record);
  };

  //* LOGIC SEARCH USER---------------
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    if (search === '') {
      return setSearchResult([]);
    } else {
      const filteredUsers = currentUsers.filter((user) =>
        user.fullName.toLowerCase().includes(search.toLowerCase())
      );
      setSearchResult(filteredUsers);
    }
  };
  return (
    <div className="wrapper-manager-user">
      <div className="group-btn">
        <input
          autoFocus
          className="search-user"
          type="text"
          placeholder="Tìm kiếm tại đây . . ."
          value={search}
          onChange={(e) => {
            handleSearch();
            setSearch(e.target.value);
          }}
          onBlur={handleSearch}
        />
        <Button
          className="btn-add-user"
          onClick={() => {
            setModalAddNewUser(!modalAddNewUser);
          }}
        >
          Thêm mới người dùng
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={searchResult.length > 0 ? searchResult : currentUsers}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={usersPerPage}
        total={users.length}
        onChange={handlePageChange}
      />
      <Modal
        open={open}
        onCancel={handleCancel}
        closeIcon={false}
        footer={false}
      >
        {item && <ModalEditUser id={item} onCancel={handleCancel} />}
      </Modal>
      <Modal
        open={modalAddNewUser}
        onCancel={handleCancel}
        closeIcon={false}
        footer={false}
      >
        <AddNewUser onCancel={handleCancel} />
      </Modal>
    </div>
  );
};

function ModalEditUser({ id, onCancel }) {
  //* LOGIC UPDATE USER---------------

  const [userUpdate, setUserUpdate] = useState({});

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/getUserById/${id._id}`
        );
        setUserUpdate(res.data);
        console.log(id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserById();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const result = await axios.put(
        `http://localhost:5000/updateUser/${id._id}`,
        userUpdate
      );
      if (result.status === 200) {
        toast.success('Update user success');
      }
    } catch (error) {
      toast.error('Update user fail !');
    }
  };

  const handleCancel = () => {
    onCancel();
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="title-admin">Update User</h1>
        <div className="row">
          <label htmlFor="">Full Name </label>
          <input
            type="text"
            autoFocus
            value={userUpdate?.fullName}
            onChange={(e) =>
              setUserUpdate({ ...userUpdate, fullName: e.target.value })
            }
          />
        </div>
        <div className="row">
          <label htmlFor="">Email </label>
          <input
            type="email"
            placeholder=""
            value={userUpdate?.email}
            onChange={(e) =>
              setUserUpdate({ ...userUpdate, email: e.target.value })
            }
          />
        </div>
        <div className="row">
          <label htmlFor="">Phone </label>
          <input
            type="text"
            placeholder=""
            value={userUpdate?.phone}
            onChange={(e) =>
              setUserUpdate({ ...userUpdate, phone: e.target.value })
            }
          />
        </div>
        <div className="row">
          <label htmlFor="">Address </label>
          <input
            type="text"
            placeholder=""
            value={userUpdate?.shippingAddress}
            onChange={(e) =>
              setUserUpdate({
                ...userUpdate,
                shippingAddress: e.target.value,
              })
            }
          />
        </div>
        <div className="row">
          <label htmlFor="">Role </label>
          <select
            name=""
            id=""
            value={userUpdate?.isAdmin}
            onChange={(e) =>
              setUserUpdate({ ...userUpdate, isAdmin: e.target.value })
            }
          >
            <option value="false">User</option>
            <option value="true">Admin</option>
          </select>
        </div>
        <div className="group-btn">
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </>
  );
}
function AddNewUser({ onCancel }) {
  //* LOGIC ADD NEW USER---------------
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async () => {
    try {
      const result = await axios.post('http://localhost:5000/createUser', {
        fullName,
        email,
        phone,
        shippingAddress,
        password,
        isAdmin,
      });
      if (result.status === 200) {
        toast.success('Add new user success');
      }
    } catch (error) {
      toast.error('Add new user fail !');
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="wrapper-add-user">
      <form onSubmit={handleSubmit}>
        <h1 className="title-admin">Add New User</h1>
        <div className="row">
          <label htmlFor="">Full Name </label>
          <input
            type="text"
            autoFocus
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="row">
          <label htmlFor="">Email </label>
          <input
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="row">
          <label htmlFor="">Phone </label>
          <input
            type="text"
            placeholder=""
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="row">
          <label htmlFor="">Address </label>
          <input
            type="text"
            placeholder=""
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />
        </div>
        <div className="row">
          <label htmlFor="">Password </label>
          <input
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="row">
          <label htmlFor="">Role </label>
          <select
            name=""
            id=""
            value={isAdmin}
            onChange={(e) => setIsAdmin(e.target.value)}
          >
            <option value="false">User</option>
            <option value="true">Admin</option>
          </select>
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
export default ManagerUsers;