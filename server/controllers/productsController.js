import Products from '../models/products.js';

export async function getProductCountByCategory(req, res) {
  try {
    // Lấy dữ liệu số lượng sản phẩm theo danh mục
    const products = await Products.aggregate([
      {
        $unwind: '$category',
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo danh mục tăng dần
    ]);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//* LOGIC GET PRODUCT COUNT OVER TIME
export async function getProductCountOverTime(req, res) {
  try {
    // Giả sử bạn muốn lấy dữ liệu số lượng sản phẩm theo ngày
    const products = await Products.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo ngày tăng dần
    ]);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//* LOGIC GET PRODUCT BY COMMENTS
export async function getProductByComments(req, res) {
  try {
    const products = await Products.find({ 'comments.0': { $exists: true } })
      .populate('comments.user', 'fullName')
      .exec();

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: 'No products with comments found' });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//* LOGIC SEARCH PRODUCT BY NAME
export async function searchProductByName(req, res) {
  try {
    const { name, sort, categories, prices } = req.query;
    let sortOption = {};
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = {};
    }

    const searchName = typeof name === 'string' ? name : '';
    let filter = {
      name: { $regex: searchName, $options: 'i' },
    };

    if (categories) {
      filter.category = { $in: categories.split(',') };
    }

    if (prices) {
      const priceRanges = prices.split(',').map((price) => {
        const [min, max] = price.split('-').map(Number);
        return { min, max: max || Infinity };
      });

      filter.$or = priceRanges.map((range) => ({
        price: { $gte: range.min, $lte: range.max },
      }));
    }

    const products = await Products.find(filter).sort(sortOption);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//* LOGIC DELETE COMMENT FROM PRODUCT - ADMIN

export const deleteCommentFromProduct = async (req, res) => {
  const { productId, commentId } = req.params;

  try {
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const commentIndex = product.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    product.comments.splice(commentIndex, 1);
    await product.save();

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* LOGIC GET PRODUCT BY CATEGORY

export const getProductByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await Products.find({ category: { $in: [category] } });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: 'No products found in this category' });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* LOGIC ADD COMMENT TO PRODUCT

export const addCommentToProduct = async (req, res) => {
  const { productId } = req.params;
  const { userId, text, rate } = req.body;
  const images = req.files.map((file) => file.filename);

  try {
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newComment = {
      user: userId,
      text,
      rate,
      image_comment: images,
      createdAt: new Date(),
    };

    product.comments.push(newComment);
    await product.save();

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//* LOGIC GET PRODUCT BY TYPE

export async function getProductByType(req, res) {
  try {
    const products = await Products.find({ type: req.query.type });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//* LOGIC GET PRODUCT BY DISCOUNT

export async function getProductByDiscount(req, res) {
  try {
    const discountedProducts = await Products.find({ discount: { $gt: 0 } }); // Lấy ra các sản phẩm có giảm giá
    return res.status(200).json(discountedProducts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
//* LOGIC GET ALL PRODUCT
export async function getAllProduct(req, res) {
  try {
    const products = await Products.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//* LOGIC GET PRODUCT BY ID
export async function getProductById(req, res) {
  try {
    // * Populate comments.user để lấy thông tin của user đã comment
    const product = await Products.findById(req.params.id).populate(
      'comments.user',
      'fullName '
    );
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//* LOGIC CREATE PRODUCT
export async function createProduct(req, res) {
  const images = req.files.map((file) => file.filename);
  const selectedCategoriesData = req.body.category.split(',');

  try {
    const newProduct = new Products({
      name: req.body.name,
      images: images,
      price: req.body.price,
      type: req.body.type,
      category: selectedCategoriesData,
      description: req.body.description,
      inventory_quantity: req.body.inventory_quantity,
      brand: req.body.brand,
      color: req.body.color,
      comments: req.body.comments,
      sizes: req.body.sizes,
      material: req.body.material,
      book_category: req.body.book_category,
    });
    await newProduct.save();
    return res.status(200).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//* LOGIC DELETE PRODUCT
export async function deleteProduct(req, res) {
  try {
    await Products.findByIdAndDelete(req.params.id);
    return res.status(200).json('Product has been deleted');
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//* LOGIC PUT - UPDATE PRODUCT

export async function updateProduct(req, res) {
  const images = req.files.map((file) => file.filename);
  const selectedCategoriesData = req.body.category.split(',');

  try {
    const id = req.params.id;
    const result = await Products.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          name: req.body.name,
          images: images,
          price: req.body.price,
          discount: req.body.discount,
          type: req.body.type,
          category: selectedCategoriesData,
          description: req.body.description,
          inventory_quantity: req.body.inventory_quantity,
          brand: req.body.brand,
          color: req.body.color,
          comments: req.body.comments,
          sizes: req.body.sizes,
          material: req.body.material,
          book_category: req.body.book_category,
        },
      },
      { new: true }
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
