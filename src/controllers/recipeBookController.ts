// src/controllers/recipeBookController.ts

import e, { Request, Response } from "express";
import RecipeBook from "../models/recipeBookModel";
import Recipe from "../models/recipeModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/userModel";

const createRecipeBook = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { name, description, isPublic } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Book name is required" });
    }
    const existingBook = await RecipeBook.findOne({ name, owner: userId });
    if (existingBook) {
      return res.status(400).json({ message: "You already have a recipe book with this name" });
    }
    const newRecipeBook = await RecipeBook.create({
      name,
      description,
      owner: userId,
      recipes: [],
      recipesCount: 0,
      isPublic: isPublic !== undefined ? isPublic : false, // If isPublic is not provided, default to false
      collaborators: [], 
    });
    return res.status(201).json(newRecipeBook);
  } catch (err: any) {
    res.status(500).send('Error creating recipe book');
  } 
};

const addRecipeToBook = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { bookId, recipeId } = req.params;
    if (!recipeId) {
      return res.status(400).json({ message: "Recipe ID is required" });
    }
    const recipeBook = await RecipeBook.findById(bookId);
    if (!recipeBook) {
        return res.status(404).json({ message: "Recipe book not found" });
    }
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
    }
    const isOwner = recipeBook.owner.toString() === userId.toString();
    const isCollaborator = recipeBook.collaborators.some((collab: any) => collab.user.toString() === userId.toString());
    if (!isOwner && !isCollaborator) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const isRecipeOwnedByBookOwner =
    recipe.owner.toString() === recipeBook.owner.toString();
    if (!isRecipeOwnedByBookOwner) {
    return res.status(403).json({
        message: "You can only add recipes owned by the book owner",
        });
    }
    const alreadyAdded = recipeBook.recipes.some((r: any) => r.toString() === recipeId);
    if (alreadyAdded) {
        return res.status(400).json({ message: "Recipe already in book" });
    }
    recipeBook.recipes.push(recipe._id);
    recipeBook.recipesCount +=1;
    await recipeBook.save();
    return res.status(200).json({ message: "Recipe added to book successfully", recipeBook });
    } catch (err: any) {
      res.status(500).json({ message: "Error adding recipe to book", error: err.message });
  }
};

const removeRecipeFromBook = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { bookId, recipeId } = req.params;
    if (!recipeId) {
      return res.status(400).json({ message: "Recipe ID is required" });
    }
    const recipeBook = await RecipeBook.findById(bookId);
    if (!recipeBook) {
        return res.status(404).json({ message: "Recipe book not found" });
    }
    const isOwner = recipeBook.owner.toString() === userId.toString();
    const isCollaborator = recipeBook.collaborators.some((collab: any) => collab.user.toString() === userId.toString());
    if (!isOwner && !isCollaborator) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const recipeIndex = recipeBook.recipes.findIndex((r: any) => r.toString() === recipeId);
    if (recipeIndex === -1) {
        return res.status(404).json({ message: "Recipe not in book" });
    }
    recipeBook.recipes.splice(recipeIndex, 1);
    recipeBook.recipesCount -= 1;
    await recipeBook.save();
    return res.status(200).json({ message: "Recipe removed from book successfully", recipeBook });
  } catch (err: any) {
    res.status(500).json({ message: "Error removing recipe from book", error: err.message });
  }
};

const getAllRecipeBooks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const publicBooksQuery = { isPublic: true };
    const ownedBooksQuery = { owner: userId };
    const collaboratedBooksQuery = { "collaborators.user": userId };
    const recipeBooks = await RecipeBook.find({
        $or: [publicBooksQuery, ownedBooksQuery, collaboratedBooksQuery]
    }).populate("recipes").populate("owner", "username").populate("collaborators.user", "username");
    res.status(200).json({message: "Recipe books fetched successfully", recipeBooks });
    } catch (err: any) {
    res.status(500).json({ message: "Error fetching recipe books", error: err.message });
    }
};

const getMyRecipeBooks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const myBooks = await RecipeBook.find({ owner: userId }).populate("recipes").populate("owner", "username").populate("collaborators.user", "username");
    res.status(200).json({message: "My recipe books fetched successfully", recipeBooks: myBooks });
    }
    catch (err: any) {
    res.status(500).json({ message: "Error fetching my recipe books", error: err.message });
    }
};

const getRecipeBookById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { bookId } = req.params;
    const recipeBook = await RecipeBook.findById(bookId).populate("recipes").populate("owner", "username").populate("collaborators.user", "username");
    if (!recipeBook) {
        return res.status(404).json({ message: "Recipe book not found" });
    }
    const isOwner = recipeBook.owner._id.toString() === userId.toString();
    const isCollaborator = recipeBook.collaborators.some((collab: any) => collab.user._id.toString() === userId.toString());
    if (!recipeBook.isPublic && !isOwner && !isCollaborator) {
        return res.status(403).json({ message: "Forbidden" });
    }
    res.status(200).json({ message: "Recipe book fetched successfully", recipeBook });
    } catch (err: any) {
    res.status(500).json({ message: "Error fetching recipe book", error: err.message });
    }
};

const deleteRecipeBook = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { bookId } = req.params;
    const recipeBook = await RecipeBook.findById(bookId);
    if (!recipeBook) {
        return res.status(404).json({ message: "Recipe book not found" });
    }
    const isOwner = recipeBook.owner.toString() === userId.toString();
    const isCollaborator = recipeBook.collaborators.some((collab: any) => collab.user.toString() === userId.toString());
    if (!isOwner && !isCollaborator) {
        return res.status(403).json({ message: "Forbidden" });
    }
    await RecipeBook.findByIdAndDelete(bookId);
    res.status(200).json({ message: "Recipe book deleted successfully" });
    }
    catch (err: any) {
    res.status(500).json({ message: "Error deleting recipe book", error: err.message });
    }
};

//   try {
//     const userId = req.user?._id;
//     if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }
//     const { bookId } = req.params;
//     const { targetUserId } = req.body;
//     if (!targetUserId) {
//         return res.status(400).json({ message: "Target user ID is required" });
//     }
//     const recipeBook = await RecipeBook.findById(bookId);
//     if (!recipeBook) {
//         return res.status(404).json({ message: "Recipe book not found" });
//     }
//     const isOwner = recipeBook.owner.toString() === userId.toString();
//     if (!isOwner) {
//         return res.status(403).json({ message: "Only the owner can share the recipe book" });
//     }
//     if (targetUserId.toString() === userId.toString()) {
//         return res.status(400).json({ message: "owner already has full access to the book" });
//     }
//     const alreadyCollaborator = recipeBook.collaborators.some((collab: any) => collab.user.toString() === targetUserId.toString());
//     if (alreadyCollaborator) {
//         return res.status(400).json({ message: "User is already a collaborator" });
//     }
//     recipeBook.collaborators.push({ user: targetUserId });
//     await recipeBook.save();
//     res.status(200).json({ message: "Recipe book shared successfully", recipeBook });
//     }
//     catch (err: any) {
//     res.status(500).json({ message: "Error sharing recipe book", error: err.message });
//     }
// };

// const unshareRecipeBook = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user?._id;
//     if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }
//     const { bookId } = req.params;
//     const { targetUserId } = req.body;
//     if (!targetUserId) {
//         return res.status(400).json({ message: "Target user ID is required" });
//     }
//     const recipeBook = await RecipeBook.findById(bookId);
//     if (!recipeBook) {
//         return res.status(404).json({ message: "Recipe book not found" });
//     }
//     const isOwner = recipeBook.owner.toString() === userId.toString();
//     if (!isOwner) {
//         return res.status(403).json({ message: "Only the owner can remove collaborators" });
//     }
//     if (targetUserId.toString() === userId.toString()) {
//         return res.status(400).json({ message: "owner cannot be removed from collaborators" });
//     }
//     const collaboratorIndex = recipeBook.collaborators.findIndex((collab: any) => collab.user.toString() === targetUserId.toString());
//     if (collaboratorIndex === -1) {
//         return res.status(404).json({ message: "User is not a collaborator" });
//     }
//     recipeBook.collaborators.splice(collaboratorIndex, 1);
//     await recipeBook.save();
//     res.status(200).json({ message: "Collaborator removed successfully", recipeBook });
//   } catch (err: any) {
//     res.status(500).json({ message: "Error removing collaborator", error: err.message });
//   }
// };

const shareRecipeBook = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { bookId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Target user email is required" });
    }

    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const recipeBook = await RecipeBook.findById(bookId);
    if (!recipeBook) {
      return res.status(404).json({ message: "Recipe book not found" });
    }

    const isOwner = recipeBook.owner.toString() === userId.toString();
    if (!isOwner) {
      return res.status(403).json({ message: "Only the owner can share the recipe book" });
    }

    const alreadyCollaborator = recipeBook.collaborators.some(
      (collab: any) => collab.user.toString() === targetUser._id.toString()
    );

    if (alreadyCollaborator) {
      return res.status(400).json({ message: "User is already a collaborator" });
    }

    // add collaborator to book
    recipeBook.collaborators.push({ user: targetUser._id });
    await recipeBook.save();

    // add collaborator to all recipes in the book
    await Recipe.updateMany(
      { _id: { $in: recipeBook.recipes } },
      { $addToSet: { collaborators: { user: targetUser._id } } }
    );

    res.status(200).json({
      message: "Recipe book shared successfully",
      recipeBook,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Error sharing recipe book", error: err.message });
  }
};

const unshareRecipeBook = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { bookId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Target user email is required" });
    }

    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const recipeBook = await RecipeBook.findById(bookId);
    if (!recipeBook) {
      return res.status(404).json({ message: "Recipe book not found" });
    }

    const isOwner = recipeBook.owner.toString() === userId.toString();
    if (!isOwner) {
      return res.status(403).json({ message: "Only the owner can remove collaborators" });
    }

    const collaboratorIndex = recipeBook.collaborators.findIndex(
      (collab: any) => collab.user.toString() === targetUser._id.toString()
    );

    if (collaboratorIndex === -1) {
      return res.status(404).json({ message: "User is not a collaborator" });
    }

    // remove collaborator from book
    recipeBook.collaborators.splice(collaboratorIndex, 1);
    await recipeBook.save();

    // remove collaborator from recipes
    await Recipe.updateMany(
      { _id: { $in: recipeBook.recipes } },
      { $pull: { collaborators: { user: targetUser._id } } }
    );

    res.status(200).json({
      message: "Collaborator removed successfully",
      recipeBook,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Error removing collaborator", error: err.message });
  }
};

//only owner or collaborator can update book details also if it public or not
const updateRecipeBook = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { bookId } = req.params;
    const { name, description, isPublic } = req.body;
    const recipeBook = await RecipeBook.findById(bookId);
    if (!recipeBook) {
        return res.status(404).json({ message: "Recipe book not found" });
    }

    const isOwner = recipeBook.owner.toString() === userId.toString();
    const isCollaborator = recipeBook.collaborators.some((collab: any) => collab.user.toString() === userId.toString());
    if (!isOwner && !isCollaborator) {
        return res.status(403).json({ message: "Forbidden" });
    }
    if (name!== undefined) {
        recipeBook.name = name;
    }
    if (description !== undefined) {
        recipeBook.description = description;
    }
    if (isPublic !== undefined) {
        recipeBook.isPublic = isPublic;
    }
    await recipeBook.save();
    res.status(200).json({ message: "Recipe book updated successfully", recipeBook });
    }
    catch (err: any) {
    res.status(500).json({ message: "Error updating recipe book", error: err.message });
    } 
  };
//   try {
//     const userId = req.user?._id;
//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const { bookId } = req.params;
//     const originalBook = await RecipeBook.findById(bookId).populate("recipes");
//     if (!originalBook) {
//       return res.status(404).json({ message: "Recipe book not found" });
//     }

//     const isOwner = originalBook.owner.toString() === userId.toString();
//     const isCollaborator = originalBook.collaborators.some(
//       (collab: any) => collab.user.toString() === userId.toString()
//     );

//     if (!originalBook.isPublic && !isOwner && !isCollaborator) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     // 1️⃣ שכפול כל מתכון בספר
//     const duplicatedRecipes = await Promise.all(
//       originalBook.recipes.map(async (recipe: any) => {
//         const newRecipe = await Recipe.create({
//           ...recipe.toObject(),
//           _id: undefined,          // כדי שמונגו יצור _id חדש
//           title: `Copy of ${recipe.title}`,
//           collaborators: [],       // מתכון חדש בלי שותפים
//         });
//         return newRecipe._id;
//       })
//     );

//     // 2️⃣ יצירת הספר החדש עם המתכונים המשוכפלים
//     const duplicatedBook = await RecipeBook.create({
//       name: `Copy of ${originalBook.name}`,
//       description: originalBook.description,
//       owner: userId,
//       recipes: duplicatedRecipes,
//       recipesCount: duplicatedRecipes.length,
//       isPublic: false,
//       collaborators: [],
//     });

//     return res.status(201).json({
//       message: "Recipe book duplicated successfully",
//       recipeBook: duplicatedBook,
//     });
//   } catch (err: any) {
//     res.status(500).json({ message: "Error duplicating recipe book", error: err.message });
//   }
// };

const duplicateRecipeBook = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { bookId } = req.params;

    const originalBook = await RecipeBook
      .findById(bookId)
      .populate("recipes");

    if (!originalBook) {
      return res.status(404).json({ message: "Recipe book not found" });
    }

    const isOwner = originalBook.owner.toString() === userId.toString();
    const isCollaborator = originalBook.collaborators.some(
      (c: any) => c.user.toString() === userId.toString()
    );

    if (!originalBook.isPublic && !isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // create new recipes for the new book
    const newRecipeIds = [];

    for (const recipe of originalBook.recipes as any[]) {

      const recipeObj = recipe.toObject();

      delete recipeObj._id;
      delete recipeObj.createdAt;
      delete recipeObj.updatedAt;

      const newRecipe = await Recipe.create({
        ...recipeObj,
        title: `Copy of ${recipe.title}`, 
        owner: userId,
        collaborators: []
      });

      newRecipeIds.push(newRecipe._id);
    }

    const newBook = await RecipeBook.create({
      name: `Copy of ${originalBook.name}`,
      description: originalBook.description,
      owner: userId,
      recipes: newRecipeIds,
      recipesCount: newRecipeIds.length,
      isPublic: false,
      collaborators: []
    });

    return res.status(201).json({
      message: "Recipe book duplicated successfully",
      recipeBook: newBook
    });

  } catch (err: any) {
    res.status(500).json({
      message: "Error duplicating recipe book",
      error: err.message
    });
  }
};

export default {
  createRecipeBook,
  addRecipeToBook,
  removeRecipeFromBook,
  getAllRecipeBooks,
  getMyRecipeBooks,
  getRecipeBookById,
  deleteRecipeBook,
  shareRecipeBook,
  unshareRecipeBook,
  updateRecipeBook,
  duplicateRecipeBook,
};