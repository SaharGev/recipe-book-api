export async function getMyRecipeBooks(token: string) {
  const response = await fetch("/recipe-books/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recipe books");
  }

  return data;
}

export async function getRecipeBookById(id: string, token: string) {
  const response = await fetch(`/recipe-books/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recipe book");
  }

  return data.recipeBook;
}