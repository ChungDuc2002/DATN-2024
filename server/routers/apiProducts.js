import { Router } from 'express';

const apiProducts = Router();

import multer from 'multer';

import * as productsController from '../controllers/productsController.js';

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

//!  Get API ---------------

apiProducts.get('/getAllProducts', productsController.getAllProduct);

apiProducts.get('/getProductByType', productsController.getProductByType);

apiProducts.get(
  '/getProductByDiscount',
  productsController.getProductByDiscount
);
apiProducts.get('/getProductById/:id', productsController.getProductById);

apiProducts.get(
  '/getProductByCategory/:category',
  productsController.getProductByCategory
);

apiProducts.get('/searchProductByName', productsController.searchProductByName);
//! Post API ---------------

apiProducts.post(
  '/createProduct',
  upload.array('images', 10),
  productsController.createProduct
);

apiProducts.post(
  '/addComment/:productId',
  upload.array('image_comment', 10),
  productsController.addCommentToProduct
);

//! Put API ---------------

apiProducts.put(
  '/updateProduct/:id',
  upload.array('images', 10),

  productsController.updateProduct
);

//! Delete API ------------

apiProducts.delete('/deleteProduct/:id', productsController.deleteProduct);
export default apiProducts;
