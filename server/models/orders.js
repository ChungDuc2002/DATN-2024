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
    totalAmount: { type: Number },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
