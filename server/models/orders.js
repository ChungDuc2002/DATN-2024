import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
    userInfo: { type: Object },
    orderCode: { type: String },
    totalAmount: { type: Number },
    status_payment: { type: String, default: 'Pending' },
    status_order: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipping', 'Completed'],
      default: 'Pending',
    },
    notifications: [notificationSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
