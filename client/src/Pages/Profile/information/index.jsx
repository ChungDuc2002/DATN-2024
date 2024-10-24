import React, { useEffect, useState } from 'react';
import './style.scss';
import toast from 'react-hot-toast';
import axios from 'axios';

const InformationProfile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUserById = async () => {
      const token = JSON.parse(localStorage.getItem('auth'));
      const result = await axios.get('http://localhost:5000/info', {
        headers: {
          token: `Bearer ${token}`,
        },
      });
      setUser(result.data);
    };
    getUserById();
  }, []);

  const handleUpdateUser = async () => {
    try {
      const result = await axios.put(
        `http://localhost:5000/updateUser/${user._id}`,
        user
      );
      console.log(result);
      toast.success('Updated information success !');
    } catch (error) {
      toast.error('Updated information fail !');
    }
  };
  return (
    <div className="wrapper-my-profile">
      <form action="" onSubmit={handleUpdateUser}>
        <label htmlFor="">Email : </label>
        <input
          type="text"
          disabled
          value={user?.email}
          style={{ background: '#f5f5f5' }}
        />
        <label htmlFor="">Full Name :</label>
        <input
          type="text"
          value={user?.fullName}
          onChange={(e) => setUser({ ...user, fullName: e.target.value })}
        />
        <label htmlFor="">Phone :</label>
        <input
          type="text"
          value={user?.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
        />
        <label htmlFor="">Shipping Address :</label>
        <input
          type="text"
          value={user?.shippingAddress}
          onChange={(e) =>
            setUser({ ...user, shippingAddress: e.target.value })
          }
        />
        <button type="button">Hủy</button>
        <button type="submit">Lưu</button>
      </form>
    </div>
  );
};

export default InformationProfile;
