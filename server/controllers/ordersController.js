import Order from '../models/orders.js';

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      userId,
      status_payment: 'Completed',
    }).populate('products.productId');

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderIsPending = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      userId,
      status_payment: 'Pending',
    }).populate('products.productId');

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId }).populate(
      'products.productId'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status_order } = req.body;

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status_order = status_order;
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
