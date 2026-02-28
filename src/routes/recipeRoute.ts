//src/routes/recipeRoute.ts

import express from "express";
import recipeController from '../controllers/recipeController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticate, recipeController.createNewRecipe);
router.get('/', authenticate, recipeController.getAllRecipes);
router.get('/my', authenticate, recipeController.getMyRecipes);
router.get('/:id', authenticate, recipeController.getRecipeById);
router.put('/:id', authenticate, recipeController.updateRecipe);
router.delete('/:id', authenticate, recipeController.deleteRecipe);

export default router;

