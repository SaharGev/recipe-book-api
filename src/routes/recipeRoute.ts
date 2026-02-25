//src/routes/recipeRoute.ts

import express from "express";
import recipeController from '../controllers/recipeController';

const router = express.Router();

router.post('/', recipeController.createNewRecipe);

export default router;

