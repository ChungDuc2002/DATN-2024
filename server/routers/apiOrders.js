import { Router } from 'express';

const apiOrders = Router();

import * as orderController from '../controllers/ordersController.js';

//! GET API------------
apiOrders.get('/getOrdersByUserId/:userId', orderController.getOrdersByUserId);

apiOrders.get('/getOrderIsPending/:userId', orderController.getOrderIsPending);

apiOrders.get('/getOrderById/:userId/:orderId', orderController.getOrderById);

//! POST API------------

//! PUT API------------
apiOrders.put('/updateOrderStatus/:orderId', orderController.updateOrderStatus);

export default apiOrders;
