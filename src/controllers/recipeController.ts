//src/controllers/recipeController.ts

import { Request, Response } from 'express';
import Recipe, { IRecipe } from '../models/recipeModel';

const createNewRecipe = async (req: Request, res: Response) => {
    const recipe = req.body;
    console.log(recipe);
    try {
        const newRecipe = await Recipe.create(recipe);
        res.status(201).json(newRecipe);
    } catch (err: any) {
        res.status(500).send('Error creating recipe');
    }
};

const getAllRecipes = async (req: Request, res: Response) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (err: any) {
        res.status(500).send('Error fetching recipes');
    }
};

export default { createNewRecipe, getAllRecipes };
