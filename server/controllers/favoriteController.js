import Favorite from '../models/favorite.js';

//! GET API------------

//! POST API------------

export async function addToFavorite(req, res) {
  try {
    const { userId, productId } = req.body;

    // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: 'Sản phẩm đã có trong danh sách yêu thích' });
    }

    const newFavorite = new Favorite({ userId, productId });
    await newFavorite.save();

    return res.status(201).json({
      message: 'Sản phẩm đã được thêm vào danh sách yêu thích',
      favorite: newFavorite,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function removeFavorite(req, res) {
  try {
    const { userId, productId } = req.params;

    await Favorite.findOneAndDelete({ userId, productId });

    return res
      .status(200)
      .json({ message: 'Sản phẩm đã được xóa khỏi danh sách yêu thích' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getFavorites(req, res) {
  try {
    const { userId } = req.params;

    const favorites = await Favorite.find({ userId }).populate('productId');

    return res.status(200).json(favorites);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
