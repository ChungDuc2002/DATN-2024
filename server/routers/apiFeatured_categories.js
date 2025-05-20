import { Router } from 'express';
import multer from 'multer';

const apiFeaturred_categories = Router();

import * as featured_categoriesController from '../controllers/featured_categoriesController.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

//! GET API------------
apiFeaturred_categories.get(
  '/getAllFeaturedCategories',
  featured_categoriesController.getFeaturedCategories
);

apiFeaturred_categories.get(
  '/getFeaturedCategoryById/:id',
  featured_categoriesController.getFeaturedCategoryById
);

//! POST API----------
apiFeaturred_categories.post(
  '/createFeaturedCategory',
  upload.single('image'),
  featured_categoriesController.createFeaturedCategory
);

//! PUT API-----------
apiFeaturred_categories.put(
  '/updateFeaturedCategory/:id',
  upload.single('image'),
  featured_categoriesController.updateFeaturedCategory
);

//! DELETE API--------
apiFeaturred_categories.delete(
  '/deleteFeaturedCategory/:id',
  featured_categoriesController.deleteFeaturedCategory
);

export default apiFeaturred_categories;
