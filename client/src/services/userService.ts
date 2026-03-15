import type { User } from "../types/user";

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch("http://localhost:3000/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch current user");
  }

  return data;
}