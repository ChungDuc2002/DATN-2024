import Order from '../models/orders.js';

export const getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      {
        $match: { status_payment: 'Completed' }, // Chỉ tính các đơn hàng đã thanh toán
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    if (totalRevenue.length === 0) {
      return res.status(200).json({ totalAmount: 0 });
    }

    res.status(200).json(totalRevenue[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderCountOverTime = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchOrderByCode = async (req, res) => {
  try {
    const { orderCode } = req.query;

    if (!orderCode) {
      return res.status(400).json({ message: 'Order code is required' });
    }

    const order = await Order.findOne({
      orderCode: {
        $regex: new RegExp(orderCode),
        $options: 'i',
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId');

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId }).populate(
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

export const getOrderByUserIdAndId = async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    const order = await Order.findOne({
      userId,
      _id: orderId,
    }).populate('products.productId');

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
