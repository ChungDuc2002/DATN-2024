import { Router } from 'express';

const apiFavorites = Router();

import * as favoritesController from '../controllers/favoriteController.js';

//! GET API------------
apiFavorites.get('/getFavorites/:userId', favoritesController.getFavorites);

//! POST API------------
apiFavorites.post('/addToFavorite', favoritesController.addToFavorite);

//! DELETE API------------
apiFavorites.delete(
  '/removeFavorite/:userId/:productId',
  favoritesController.removeFavorite
);

export default apiFavorites;
