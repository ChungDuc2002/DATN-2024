import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      //   required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          //   required: true,
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
      enum: ['Pending', 'Processing', 'Completed', 'Shipped', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
