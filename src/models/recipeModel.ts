//src/models/recipeModel.ts
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
    {
        title: {
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
        collaborators: [
        {
            user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            },
            // role: {
            // type: String,
            // enum: ["editor", "viewer"],
            // default: "editor",
            // },
        },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);