import Products from '../models/products.js';

//* LOGIC GET PRODUCT BY CATEGORY

export async function getProductByCategory(req, res) {
  try {
    const products = await Products.find({ category: req.query.category });
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
  try {
    const newProduct = new Products({
      name: req.body.name,
      images: images,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      inventory_quantity: req.body.inventory_quantity,
      brand: req.body.brand,
      color: req.body.color,
      comments: req.body.comments,
      sizes: req.body.sizes,
      material: req.body.material,
      type: req.body.type,
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
          category: req.body.category,
          description: req.body.description,
          inventory_quantity: req.body.inventory_quantity,
          brand: req.body.brand,
          color: req.body.color,
          comments: req.body.comments,
          sizes: req.body.sizes,
          material: req.body.material,
          type: req.body.type,
        },
      },
      { new: true }
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
