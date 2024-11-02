import Products from '../models/products.js';

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
    const product = await Products.findById(req.params.id);
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
