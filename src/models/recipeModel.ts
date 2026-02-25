//src/models/recipeModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipe extends Document {
    title: string;
    owner: string; //will be req.user.id
    description?: string;
    ingredients: string[];
    cookTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    isPublic: boolean;
    imageUrl?: string;
}

const RecipeSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },
    owner: { type: String, required: true },
    description: { type: String, default: '' },
    ingredients: { type: [String], required: true },
    cookTime: { type: Number, required: true, min: 1 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    isPublic: { type: Boolean, default: true },
    imageUrl: { type: String, default: '' },
}, { timestamps: true });

// const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema); 
export default mongoose.model<IRecipe>('Recipe', RecipeSchema);