import Order from '../models/orders.js';

export const getUpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_order } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status_order = status_order;

    // Thêm thông báo
    order.notifications.push({
      userId: order.userId,
      message: `Your order status has been updated to ${status_order}`,
    });

    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

export const getSuccessOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({
      userId,
      status_payment: 'Completed',
      status_order: 'Completed',
    }).populate('products.productId');

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getWaitingOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      userId,
      status_payment: 'Completed',
      status_order: { $in: ['Pending', 'Processing', 'Shipping'] },
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

    // ! Thêm thông báo
    order.notifications.push({
      userId: order.userId,
      message: `Trạng thái đơn hàng của bạn đã được cập nhật thành ${status_order}`,
    });

    await order.save();

    //! Xóa thông báo sau 5 phút
    setTimeout(async () => {
      try {
        const updatedOrder = await Order.findOne({ _id: orderId });
        if (updatedOrder) {
          updatedOrder.notifications = updatedOrder.notifications.filter(
            (notifi) => notifi.message !== notification.message
          );
          await updatedOrder.save();
        }
      } catch (error) {
        console.error('Error removing notification:', error);
      }
    }, 30 * 1000);

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate('products.productId')
      .select('notifications products');
    const notifications = orders.flatMap((order) =>
      order.notifications.map((notification) => ({
        ...notification.toObject(),
        products: order.products,
      }))
    );

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
