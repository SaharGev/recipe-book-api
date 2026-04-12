// src/models/userModel.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
    },

    googleId: {
      type: String,
    },

    refreshTokens: {
      type: [String],
      default: [],
    },

    profileImageUrl: {
      type: String,
    },
    recentlyViewedRecipes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Recipe",
      default: [],
    },

    recentlyViewedBooks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "RecipeBook",
      default: [],
    },

    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);