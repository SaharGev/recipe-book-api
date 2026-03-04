//src/routes/recipeRoute.ts

import express from "express";
import recipeController from '../controllers/recipeController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/recipes', authenticate, recipeController.createNewRecipe);
router.get('/recipes', authenticate, recipeController.getAllRecipes);
router.get('/recipes/my', authenticate, recipeController.getMyRecipes);
router.get('/recipes/:id', authenticate, recipeController.getRecipeById);
router.put('/recipes/:id', authenticate, recipeController.updateRecipe);
router.delete('/recipes/:id', authenticate, recipeController.deleteRecipe);

export default router;

