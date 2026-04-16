//src/controllers/recipeController.ts

import { Request, Response } from 'express';
import Recipe from '../models/recipeModel';
import { AuthRequest } from '../middlewares/authMiddleware';
import RecipeBook from '../models/recipeBookModel';
import User from "../models/userModel";

const createNewRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {title} = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const existingRecipe = await Recipe.findOne({ title, owner: userId });
    if (existingRecipe) {
      return res.status(400).json({ message: "You already have a recipe with this title" });
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

const getSharedWithMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const recipes = await Recipe.find({
      "collaborators.user": userId,
      owner: { $ne: userId },
    });
    return res.json(recipes);
  } catch (err: any) {
    res.status(500).send("Error fetching shared recipes");
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
    const recipe = await Recipe.findById(recipeId)
      .populate("collaborators.user", "username profileImageUrl")
      .populate("owner", "username profileImageUrl");
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    const isOwner = recipe.owner.toString() === userId.toString();
    const isCollaborator = recipe.collaborators.some(
      (c: any) => {
        const collabId = typeof c.user === "object" ? c.user._id.toString() : c.user.toString();
        return collabId === userId.toString();
      }
    );
    if (!recipe.isPublic && !isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { recentlyViewedRecipes: recipe._id },
    });

    await User.findByIdAndUpdate(userId, {
      $push: {
        recentlyViewedRecipes: {
          $each: [recipe._id],
          $position: 0,
          $slice: 10,
        },
      },
    });

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

    // remove recipe from all recipe books and decrease count
    await RecipeBook.updateMany(
      { recipes: recipeId },
      {
        $pull: { recipes: recipeId },
        $inc: { recipesCount: -1 }
      }
    );

    await Recipe.findByIdAndDelete(recipeId);

    return res.json({ message: "Recipe deleted successfully" });

  } catch (err: any) {
    console.error(err);
    res.status(500).send("Error deleting recipe");
  }
};

const updateRecipeImage = async (req: AuthRequest, res: Response) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user?._id;
    const { imageUrl } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.owner.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    recipe.imageUrl = imageUrl;
    await recipe.save();

    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update recipe image" });
  }
};

const shareRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "email is required" });

    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const isOwner = recipe.owner.toString() === userId.toString();
    if (!isOwner) return res.status(403).json({ message: "Only the owner can share the recipe" });

    const targetUser = await User.findOne({ email });
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const alreadyCollaborator = recipe.collaborators.some(
      (c: any) => c.user.toString() === targetUser._id.toString()
    );
    if (alreadyCollaborator) return res.status(400).json({ message: "User already has access" });

    recipe.collaborators.push({ user: targetUser._id });
    await recipe.save();

    return res.status(200).json({ message: "Recipe shared successfully", recipe });
  } catch (err: any) {
    res.status(500).json({ message: "Error sharing recipe" });
  }
};

const unshareRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "email is required" });

    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const isOwner = recipe.owner.toString() === userId.toString();
    if (!isOwner) return res.status(403).json({ message: "Only the owner can unshare the recipe" });

    const targetUser = await User.findOne({ email });
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const index = recipe.collaborators.findIndex(
      (c: any) => c.user.toString() === targetUser._id.toString()
    );
    if (index !== -1) {
      recipe.collaborators.splice(index, 1);
    }
    await recipe.save();

    return res.status(200).json({ message: "Recipe unshared successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Error unsharing recipe" });
  }
};

export default { createNewRecipe,
  getAllRecipes,
  getMyRecipes,
  getSharedWithMe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  updateRecipeImage,
  shareRecipe,
  unshareRecipe
};