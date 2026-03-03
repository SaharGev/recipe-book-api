// src/routes/recipeBookRoute.ts

import express from "express";
import recipeBookController from '../controllers/recipeBookController';
import { authenticate } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/', authenticate, recipeBookController.createRecipeBook);
router.post('/:bookId/recipes/:recipeId', authenticate, recipeBookController.addRecipeToBook);
router.delete('/:bookId/recipes/:recipeId', authenticate, recipeBookController.removeRecipeFromBook);
router.get('/', authenticate, recipeBookController.getAllRecipeBooks);
router.get('/my', authenticate, recipeBookController.getMyRecipeBooks);
router.get('/:bookId', authenticate, recipeBookController.getRecipeBookById);
router.delete('/:bookId', authenticate, recipeBookController.deleteRecipeBook);
router.post('/:bookId/share', authenticate, recipeBookController.shareRecipeBook);
router.post('/:bookId/unshare', authenticate, recipeBookController.unshareRecipeBook);
router.put('/:bookId', authenticate, recipeBookController.updateRecipeBook);
router.post('/:bookId/duplicate', authenticate, recipeBookController.duplicateRecipeBook);

export default router;