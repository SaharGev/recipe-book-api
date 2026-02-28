//src/models/recipeModel.ts
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        owner: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        ingredients: {
            type: [String],
            required: true,
        },  
        cookTime: {
            type: Number,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        imageUrl: {
            type: String,
            required: false,
        },
    },
);

export default mongoose.model("Recipe", recipeSchema);