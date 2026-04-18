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

export async function getFriends(token: string) {
  const response = await apiFetch("http://localhost:3000/users/friends", {}, token);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch friends");
  }

  return data.friends;
}

export async function getFriendsPaginated(token: string, page = 1, limit = 10) {
  const response = await apiFetch(
    `http://localhost:3000/users/friends?page=${page}&limit=${limit}`,
    {},
    token
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch friends");
  }
  return data;
}

export async function addFriend(token: string, identifier: string) {
  const response = await apiFetch("http://localhost:3000/users/friends", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier }),
  }, token);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add friend");
  }

  return data;
}

export async function removeFriend(token: string, friendId: string) {
  const response = await apiFetch(`http://localhost:3000/users/friends/${friendId}`, {
    method: "DELETE",
  }, token);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove friend");
  }

  return data;
}

export async function searchUsers(token: string, query: string) {
  const response = await apiFetch(
    `http://localhost:3000/users/search?query=${encodeURIComponent(query)}`,
    {},
    token
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to search users");
  }

  return data.users;
}