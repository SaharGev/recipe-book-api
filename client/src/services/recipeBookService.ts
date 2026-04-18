// src/services/recipeBookService.ts
import { apiFetch } from "./apiClient";

export async function getMyRecipeBooks(token: string, page = 1, limit = 6) {
  const response = await apiFetch(
    `http://localhost:3000/recipe-books/my?page=${page}&limit=${limit}`,
    {},
    token
  );

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

export async function searchUsers(query: string, token: string) {
  const res = await fetch(
    `http://localhost:3000/recipe-books/search-users?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to search users");
  }

  return data;
}

export async function getPublicRecipeBooks(token: string, page = 1, limit = 6) {
  const response = await apiFetch(
    `http://localhost:3000/recipe-books/public?page=${page}&limit=${limit}`,
    {},
    token
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch public recipe books");
  }

  return data;
}