import users from '../models/users.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

//! Logic - Search user ----------------------------
export async function searchUserByName(req, res) {
  try {
    const nameUser = await users.find({
      fullName: { $regex: req.query.fullName, $options: 'i' },
    });
    return res.status(200).json(nameUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//! Logic - Forget password -----------------------

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const oldUser = await users.findOne({ email });
    if (!oldUser) {
      return res.status(404).json({ message: 'User Not Exists!' });
    }
    const secret = process.env.JWT_ACCESS_KEY + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: '3m',
    });

    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nguyenchungduc2002@gmail.com',
        pass: 'vphkbllyoiythqod',
      },
    });

    var mailOptions = {
      from: 'youremail@gmail.com',
      to: email,
      subject: 'Password Reset',
      priority: 'high',
      html: `
      <h1 style="opacity:0.8 ; color: orange;font-family: 'Poppins', sans-serif; font-weight: 500; ">Welcome to Duck Fashion</h1>
      <h2 style="color:#333 ;font-family: 'Poppins', sans-serif; font-weight: 500;">Được biết bạn có yêu cầu khôi phục lại mật khẩu đã bị mất . Chúng tôi đã gửi cho bạn một liên kết ở phía dưới ...</h2>
      <h3 style="font-family: 'Poppins', sans-serif; font-weight: 500;">Vui lòng Click <a href="${link}">vào đây</a> để khôi phục lại mật khẩu.</h3>
      <h4 style="font-family: 'Poppins', sans-serif; font-weight: 500;">Lưu ý : Link khôi phục chỉ tồn tại trong vòng 3p .</h4>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0h9CGRHNCU421t_qoLQuvyrduVBCOqap42A&s" alt="Image"/>
      <p style="font-size:15px ;font-family: 'Poppins', sans-serif; font-weight: 500;">Cảm ơn bạn vì đã tin tưởng sử dụng dịch vụ của chúng tôi . Thank !</p>
      `,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent :' + info.response);
      }
    });
    console.log(link);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function resetPassword(req, res) {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await users.findOne({ _id: id });
  if (!oldUser) {
    return res.status(404).json('User Not Exits');
  }
  const secret = process.env.JWT_ACCESS_KEY + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    return res.render('index', { email: verify.email, status: 'Not Verified' });
  } catch (error) {
    return res.status(500).json('Not Verified');
  }
}

export async function postResetPassword(req, res) {
  const { id, token } = req.params;
  const { password } = req.body;
  const oldUser = await users.findOne({ _id: id });
  if (!oldUser) {
    return res.status(404).json('User Not Exits');
  }
  const secret = process.env.JWT_ACCESS_KEY + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await users.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    return res.render('index', { email: verify.email, status: 'Verified' });
  } catch (error) {
    return res.status(500).json('Something Went Wrong');
  }
}
//! Logic - Get all users --------------------------

export async function getAllUsers(req, res) {
  try {
    const user = await users.find();
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//! Logic - Get info user -------------------------

export async function info(req, res) {
  try {
    const user = await users.findById(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//! Logic - Get user by id -------------------------

export async function getUserById(req, res) {
  try {
    const user = await users.findById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//! Logic - Create user ----------------------------
export async function createUser(req, res) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    const user = await users.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashed,
      phone: req.body.phone,
      shippingAddress: req.body.shippingAddress,
      isAdmin: req.body.isAdmin,
    });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//! Logic - Delete user ----------------------------

export async function deleteUser(req, res) {
  try {
    const user = await users.findByIdAndDelete(req.params.id);
    return res.status(200).json('User has been deleted');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//! Logic - Update user ----------------------------

export async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const result = await users.findByIdAndUpdate(
      id,
      {
        //* đặt các trường và giá trị mới cho bản ghi người dùng dựa trên req.body
        $set: req.body,
      },
      //* trả về bản ghi mới sau khi cập nhật
      { new: true }
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// export async function updateProfile(req,res){

// }
//! Logic - Login ----------------------------------

function generateAccessToken(user) {
  //* Create access Token
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: '365d',
    }
  );
}

function generateRefreshToken(user) {
  //* Create refresh Token
  return jwt.sign(
    {
      id: user.id,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_REFRESH_KEY,
    {
      expiresIn: '365d',
    }
  );
}

export async function Login(req, res) {
  try {
    const user = await users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Email is not found' });
    }
    const vadlidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!vadlidPassword) {
      return res.status(400).json({ message: 'Password is not found' });
    }
    if (user && vadlidPassword) {
      //* Create token
      const accessToken = generateAccessToken(user);

      //* Create refresh token
      const refreshToken = generateRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });

      const { password, ...other } = user._doc;
      return res.status(200).json({ ...other, accessToken });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//! Logic - Register ----------------------------------

export async function Register(req, res) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    const { confirmPassword } = req.body;

    if (req.body.password !== confirmPassword) {
      return res.status(400).json({ message: 'Password is not match' });
    } else {
      const user = await users.create({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashed,
      });
      return res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Request refresh Token

export async function requestRefreshToken(req, res) {
  //! Take refresh token from user
  const refreshToken = req.cookies.refreshToken; // refreshToken == 'refreshToken'

  if (!refreshToken) return res.status(401).json("You're not authenticated");

  //! Logic : Check the user's refresh Token then use the id information
  //! provided in the refresh_Token to recreate a new accessToken
  const oldToken = await users.findOne({
    refreshToken: refreshToken,
  });

  console.log('oldTK', oldToken);

  if (!oldToken) {
    return res.json({
      status: 404,
      message: 'Token not available',
    });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (error, user) => {
    if (error) {
      console.log(error);
    }

    //! Create new accessToken , refreshToken
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    //! add new refresh token to array

    try {
      // await Users.findByIdAndUpdate(oldToken._id, {
      //   refreshToken: refreshToken,
      // });
      // await Users.updateOne(oldToken._id, {
      //   refreshToken: newRefreshToken,
      // });
      oldToken.refreshToken = newRefreshToken;
      oldToken.save();

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      return res.status(500).json({ message: error.message });
    }
  });
}
