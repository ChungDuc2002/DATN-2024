import { Router } from 'express';

const apiCarts = Router();

import * as cartsController from '../controllers/cartsController.js';

//! GET API------------

apiCarts.get('/getCart/:userId', cartsController.getCart);

//! POST API------------
apiCarts.post('/addToCart', cartsController.addToCart);

//! DELETE API------------

apiCarts.delete(
  '/deleteProduct/:userId/:productId',
  cartsController.removeFromCart
);
//! PUT API------------

export default apiCarts;
