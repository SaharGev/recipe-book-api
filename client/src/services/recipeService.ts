// client/src/services/recipeService.ts
export async function getRecipe(id: string) {
    const response = await fetch(`http://localhost:3000/recipes/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch recipe');
    }
    return response.json();
}

export async function getMyRecipes(token: string) {
  const response = await fetch("http://localhost:3000/recipes/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recipes");
  }

  return data;
}