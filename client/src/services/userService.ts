import type { User } from "../types/user";
import { apiFetch } from "./apiClient";

export async function getCurrentUser(token: string): Promise<User> {
  const response = await apiFetch("http://localhost:3000/users/me", {}, token);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch current user");
  }

  return data;
}

export async function updateCurrentUser(token: string, data: { username?: string; email?: string; phone?: string }) {
  const response = await apiFetch("http://localhost:3000/users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }, token);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user");
  }

  return result;
}

export async function updateProfileImage(token: string, imageUrl: string) {
  const response = await apiFetch("http://localhost:3000/users/profile-image", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profileImageUrl: imageUrl }),
  }, token);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update profile image");
  }

  return result;
}

export async function uploadProfileImage(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiFetch("http://localhost:3000/upload/image", {
    method: "POST",
    body: formData,
  }, token);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload image");
  }

  return data.url;
}