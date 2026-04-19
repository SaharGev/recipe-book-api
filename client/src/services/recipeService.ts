import { apiFetch } from "./apiClient";

export async function getRecipe(id: string, token: string) {
  const response = await apiFetch(`http://localhost:3000/recipes/${id}`, {}, token);

  if (!response.ok) {
    throw new Error("Failed to fetch recipe");
  }

  return response.json();
}

export async function getMyRecipes(token: string) {
  const response = await apiFetch("http://localhost:3000/recipes/my", {}, token);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recipes");
  }

  return data;
}

export async function toggleLike(recipeId: string, token: string) {
  const response = await apiFetch("http://localhost:3000/likes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetType: "recipe",
      targetId: recipeId,
    }),
  }, token);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to toggle like");
  }

  return data;
}

export async function getMyLikes(token: string) {
  const response = await apiFetch("http://localhost:3000/likes", {}, token);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch likes");
  }

  return data;
}

export async function getPublicRecipes(token: string, page = 1, limit = 6) {
  const response = await apiFetch(
    `http://localhost:3000/recipes/public?page=${page}&limit=${limit}`,
    {},
    token
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch public recipes");
  }

  return data;
}

export async function getSharedWithMeRecipes(token: string, page = 1, limit = 6) {
  const response = await apiFetch(
    `http://localhost:3000/recipes/shared-with-me?page=${page}&limit=${limit}`,
    {},
    token
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch shared recipes");
  }

  return data;
}