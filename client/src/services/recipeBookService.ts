import { apiFetch } from "./apiClient";

export async function getMyRecipeBooks(token: string) {
  const response = await apiFetch("http://localhost:3000/recipe-books/my", {}, token);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recipe books");
  }

  return data;
}

export async function getRecipeBookById(id: string, token: string) {
  const response = await apiFetch(`http://localhost:3000/recipe-books/${id}`, {}, token);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recipe book");
  }

  return data.recipeBook;
}