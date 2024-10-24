import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    inventory_quantity: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
    },
    color: {
      type: String,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          // ref: 'User', // Tham chiếu đến schema của người dùng nếu cần
        },
        text: {
          type: String,
          // required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // *Model Product Fashions
    sizes: {
      type: String,
      enum: ['S', 'M', 'L', 'XL'],
    },
    material: {
      type: String,
    },

    // *Model Product Electronics

    // *Model Product Book
    type: {
      type: String,
      enum: ['textbook', 'reference_books', 'comic'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
