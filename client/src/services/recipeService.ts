// client/src/services/recipeService.ts
export async function getRecipe(id: string) {
    const response = await fetch(`http://localhost:3000/recipes/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch recipe');
    }
    return response.json();
}