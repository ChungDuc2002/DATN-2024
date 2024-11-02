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
    category: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
      enum: ['fashion', 'electronics', 'book'],
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
          ref: 'User',
        },
        text: {
          type: String,
        },
        rate: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        image_comment: [
          {
            type: String, // Đường dẫn đến hình ảnh
          },
        ],
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
    book_category: {
      type: String,
      enum: ['Sách giáo khoa', 'Sách tham khảo', 'Truyện'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
