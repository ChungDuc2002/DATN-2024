import Cart from '../models/carts.js';
import Product from '../models/products.js';

//! GET API------------
export async function getCart(req, res) {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy giỏ hàng cho userId đã cung cấp' });
    }

    const products = await Product.find({
      _id: { $in: cart.products.map((item) => item.productId) },
    });

    // return res.status(200).json({ cart, products });
    const productsWithQuantities = products.map((product) => {
      const cartProduct = cart.products.find(
        (item) => item.productId === product._id.toString()
      );
      return {
        ...product.toObject(),
        quantity: cartProduct.quantity,
      };
    });

    return res.status(200).json({ products: productsWithQuantities });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//! POST API------------

export async function addToCart(req, res) {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      const productIndex = cart.products.findIndex(
        (product) => product.productId === productId
      );
      if (productIndex >= 0) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      await cart.save();
      return res.status(200).json(cart);
    }
    const newCart = new Cart({
      userId,
      products: [{ productId, quantity }],
    });
    await newCart.save();
    return res.status(200).json(newCart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//! DELETE API------------

export async function removeFromCart(req, res) {
  const { userId, productId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy giỏ hàng cho userId đã cung cấp' });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.productId === productId
    );

    if (productIndex >= 0) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      return res.status(200).json(cart);
    }

    return res
      .status(404)
      .json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
