// client/src/pages/RecipePage.tsx  
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getRecipe} from "../services/recipeService";
import IngredientList from "../components/IngredientList";

interface Recipe {
    title: string;
    description: string;
    ingredients: string[];
    cookTime: number;
    difficulty: "easy" | "medium" | "hard";
    imageUrl?: string;
}

export default function RecipePage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        if (id) {
            getRecipe(id)
                .then(setRecipe);
        }
    }, [id]);

    if (!recipe) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            {/* Recipe Image */}
            {recipe.imageUrl && (
                <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    style={{ width: "100%", borderRadius: "10px", marginBottom: "1rem" }}
                />
            )}
            {/* Recipe Title */}
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {recipe.title}
            </h2>

            {/* Recipe Description */}
            {recipe.description && (
                <p style={{ fontSize: "1rem", color: "#555", marginBottom: "1rem" }}>
                {recipe.description}
                </p>
            )}

            {/* Recipe Difficulty and Cooking Time */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <span>קושי: {recipe.difficulty}</span>
                <span>זמן: {recipe.cookTime} דק'</span>
            </div>

            {/* Recipe Ingredients */}
            <h3>מרכיבים:</h3>
            <IngredientList ingredients={recipe.ingredients} />
            </div>
    );
}

