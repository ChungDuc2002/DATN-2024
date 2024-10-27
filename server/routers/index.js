import userApi from './apiUsers.js';
import slidesApi from './apiSlides.js';
import productsApi from './apiProducts.js';
import contactApi from './apiContacts.js';
import cartApi from './apiCarts.js';

export const InitRouters = (app) => {
  app.use('/', userApi);
  app.use('/slides', slidesApi);
  app.use('/products', productsApi);
  app.use('/contacts', contactApi);
  app.use('/carts', cartApi);
};
