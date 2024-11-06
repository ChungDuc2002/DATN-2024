import { Router } from 'express';
const apiUsers = Router();

import * as userController from '../controllers/usersController.js';
import * as middlewareController from '../middlewares/middlewareControllers.js';

// get a users
apiUsers.get(
  '/getAllUsers',
  middlewareController.verifyToken,
  userController.getAllUsers
);
apiUsers.get('/reset-password/:id/:token', userController.resetPassword);
apiUsers.get('/getUserById/:id', userController.getUserById);
apiUsers.get('/info', middlewareController.verifyToken, userController.info);
apiUsers.get('/searchUser', userController.searchUserByName);

// post a user
apiUsers.post('/refreshToken', userController.requestRefreshToken);
apiUsers.post('/createUser', userController.createUser);
apiUsers.post('/login', userController.Login);
apiUsers.post('/register', userController.Register);
apiUsers.post('/forgot-password', userController.forgotPassword);
apiUsers.post('/reset-password/:id/:token', userController.postResetPassword);
// put a user
apiUsers.put(
  '/updateUser/:id',
  // middlewareController.verifyTokenAndAdmin,
  userController.updateUser
);

// delete a user
apiUsers.delete('/deleteUser/:id', userController.deleteUser);

// update a user
// apiUsers.push();

export default apiUsers;
