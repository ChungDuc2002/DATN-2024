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

apiProducts.get('/getAllProduct', productsController.getAllProduct);

apiProducts.get('/getProductByType', productsController.getProductByType);

apiProducts.get(
  '/getProductByDiscount',
  productsController.getProductByDiscount
);
apiProducts.get('/getProductById/:id', productsController.getProductById);

//! Post API ---------------

apiProducts.post(
  '/createProduct',
  upload.array('images', 10),
  productsController.createProduct
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
