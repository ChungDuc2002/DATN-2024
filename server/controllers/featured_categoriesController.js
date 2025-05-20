import featured_category from '../models/featured_categories.js';

export async function createFeaturedCategory(req, res) {
  try {
    const { name, link } = req.body;
    const image = req.file.filename;
    const newFeaturedCategory = new featured_category({
      name,
      image,
      link,
    });
    await newFeaturedCategory.save();
    return res.status(200).json(newFeaturedCategory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getFeaturedCategories(req, res) {
  try {
    const listFeaturedCategory = await featured_category.find();
    return res.status(200).json(listFeaturedCategory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getFeaturedCategoryById(req, res) {
  try {
    const { id } = req.params;
    const featuredCategory = await featured_category.findById(id);
    return res.status(200).json(featuredCategory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateFeaturedCategory(req, res) {
  const image = req.file.filename;
  try {
    const { id } = req.params;
    const result = await featured_category.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        image: image,
        name: req.body.name,
        link: req.body.link,
      }
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function deleteFeaturedCategory(req, res) {
  try {
    const { id } = req.params;
    const result = await featured_category.findByIdAndDelete(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
