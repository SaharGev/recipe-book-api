// src/models/recipeBookModel.ts
import mongoose from "mongoose";

const recipeBookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
    },

    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],

    recipesCount: {
      type: Number,
      default: 0,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        // role: {
        //   type: String,
        //   enum: ["editor", "viewer"],
        //   default: "editor",
        // },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("RecipeBook", recipeBookSchema);