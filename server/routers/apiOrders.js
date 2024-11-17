import { Router } from 'express';

const apiOrders = Router();

import * as orderController from '../controllers/ordersController.js';

//! GET API------------
apiOrders.get('/total-revenue', orderController.getTotalRevenue);

apiOrders.get('/order-count-over-time', orderController.getOrderCountOverTime);

apiOrders.get('/searchOrderByCode', orderController.searchOrderByCode);

apiOrders.get('/getAllOrders', orderController.getAllOrders);

apiOrders.get('/getOrdersByUserId/:userId', orderController.getOrdersByUserId);

apiOrders.get('/getOrderIsPending/:userId', orderController.getOrderIsPending);

apiOrders.get('/getOrderById/:orderId', orderController.getOrderById);

apiOrders.get(
  '/getOrdersByUserIdAndId/:userId/:orderId',
  orderController.getOrderByUserIdAndId
);

//! POST API------------

//! PUT API------------
apiOrders.put('/updateOrderStatus/:orderId', orderController.updateOrderStatus);

export default apiOrders;
