import PayOS from '@payos/node';
import dotenv from 'dotenv';
import Order from '../models/orders.js';
import Product from '../models/products.js';
import Cart from '../models/carts.js';
import mongoose from 'mongoose';

dotenv.config();

const payos = new PayOS(
  process.env.JWT_CLIENT_ID,
  process.env.JWT_API_KEY,
  process.env.JWT_CHECK_SUMKEY
);

const generateOrderCode = () => {
  return Math.floor(Math.random() * 9007199254740991) + 1; // Tạo số ngẫu nhiên từ 1 đến 9007199254740991
};

export async function createPaymentLink(req, res) {
  try {
    const {
      amount,
      currency,
      description,
      customerEmail,
      customerPhone,
      userId,
      userInfo,
      products,
    } = req.body;

    const orderCode = generateOrderCode();

    // Log các tham số đầu vào để kiểm tra
    console.log('Payment Request:', {
      amount,
      currency,
      orderCode,
      description,
      customerEmail,
      customerPhone,
      userId,
      userInfo,
      products,
    });

    const payment = await payos.createPaymentLink({
      amount,
      currency,
      orderCode,
      description,
      customerEmail,
      customerPhone,
      returnUrl: 'http://localhost:3000/payment-success',
      cancelUrl: 'http://localhost:3000/',
    });

    // Log kết quả trả về từ PayOS
    console.log('Payment Response:', payment);

    const newOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      userId,
      products,
      userInfo,
      totalAmount: amount,
      status_payment: 'Pending',
      status_order: 'Pending',
      orderCode,
    });
    await newOrder.save();

    return res.json({
      checkoutUrl: payment.checkoutUrl,
      orderId: newOrder._id.toString(),
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ message: error.message });
  }
}

export async function paymentSuccess(req, res) {
  try {
    const { orderId, products, userId } = req.body;

    // Log giá trị của products để kiểm tra
    console.log('Products:', products);

    // Kiểm tra nếu products không phải là một mảng
    if (!Array.isArray(products)) {
      throw new Error('Products must be an array');
    }

    console.log('Products before loop:', products);

    // Trừ số lượng sản phẩm trong kho
    for (const product of products) {
      await Product.updateOne(
        { _id: product.productId },
        { $inc: { inventory_quantity: -product.quantity } }
      );
    }

    // Clear giỏ hàng của người dùng
    await Cart.updateOne({ userId }, { $set: { products: [] } });

    // Cập nhật trạng thái đơn hàng
    await Order.updateOne(
      { _id: orderId },
      { $set: { status_payment: 'Completed' } }
    );

    return res
      .status(200)
      .json({ message: 'Payment success and inventory updated' });
  } catch (error) {
    console.error('Error processing payment success:', error);
    return res.status(500).json({ message: error.message });
  }
}

// Thanh toán lai cho đơn hàng đã hủy
export async function reactivatePayment(req, res) {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status_payment !== 'Pending') {
      return res.status(400).json({ message: 'Order is not pending' });
    }
    console.log('Order Code:', order.orderCode);

    try {
      const orderCode = generateOrderCode();

      const payment = await payos.createPaymentLink({
        amount: order.totalAmount,
        currency: 'VND',
        orderCode: orderCode,
        description: 'Payment for order',
        customerEmail: order.userInfo.email,
        customerPhone: order.userInfo.phone,
        returnUrl: 'http://localhost:3000/payment-success',
        cancelUrl: 'http://localhost:3000/',
      });

      // Log kết quả trả về từ PayOS
      console.log('Payment Response:', payment);

      return res.json({ checkoutUrl: payment.checkoutUrl });
    } catch (payosError) {
      console.error('Error from PayOS:', payosError);
      return res.status(500).json({ message: 'Error creating payment link' });
    }
  } catch (error) {
    console.error('Error reactivating payment:', error);
    return res.status(500).json({ message: error.message });
  }
}
