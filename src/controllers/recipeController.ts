//src/controllers/recipeController.ts

import { Request, Response } from 'express';
import Recipe from '../models/recipeModel';
import { AuthRequest } from '../middlewares/authMiddleware';

const createNewRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const recipeData = req.body;
    const newRecipe = await Recipe.create({ ...recipeData, owner: userId });
    return res.status(201).json(newRecipe);
  } catch (err: any) {
    res.status(500).send('Error creating recipe');
  }
};

const getAllRecipes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    } 
    // public recipes + recipes owned by the user
    const recipes = await Recipe.find({ $or: [
      { isPublic: true },
       { owner: userId },
       { collaborators: { $elemMatch: { user: userId } } }] });
    return res.json(recipes); 
  } catch (err: any) {
    res.status(500).send('Error fetching recipes');
  }
};

const getMyRecipes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const myRecipes = await Recipe.find({ owner: userId });
    return res.json(myRecipes);
  } catch (err: any) {
    res.status(500).send('Error fetching my recipes');
  } 
};

const getRecipeById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    const isOwner = recipe.owner.toString() === userId.toString();
    const isCollaborator = recipe.collaborators?.some(
      (c) => c.user && c.user.toString() === userId.toString());
    if (!recipe.isPublic && !isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.json(recipe);
  } catch (err: any) {
    res.status(500).send('Error fetching recipe');
  }
};

const updateRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const recipeId = req.params.id;
    const updatedData = req.body;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    const isOwner = recipe.owner.toString() === userId.toString();
    const isCollaborator = recipe.collaborators?.some(
      (c: any) => c.user.toString() === userId.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      updatedData,
      { new: true, runValidators: true }
    );

    return res.json(updatedRecipe);
  } catch (err: any) {
    res.status(500).send("Error updating recipe");
  }
}

const deleteRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    const isOwner = recipe.owner.toString() === userId.toString();
    const isCollaborator = recipe.collaborators.some(
      (c: any) => c.user.toString() === userId.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Recipe.findByIdAndDelete(recipeId);
    return res.json({ message: "Recipe deleted successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Error deleting recipe");
  }
};

export default { createNewRecipe, getAllRecipes, getMyRecipes, getRecipeById, updateRecipe, deleteRecipe};

