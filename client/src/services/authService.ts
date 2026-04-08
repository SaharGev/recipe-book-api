export async function login(identifier: string, password: string) {
  const isEmail = identifier.includes("@");

  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...(isEmail ? { email: identifier } : { phone: identifier }),
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  console.log("login response:", data);
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  
  return data;
}

export async function logout(refreshToken: string) {
  const response = await fetch("http://localhost:3000/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Logout failed");
  }

  return data;
}

export async function getRecentlyViewed() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch("http://localhost:3000/users/me/recently-viewed", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recently viewed items");
  }

  return data;
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) return null;

  const response = await fetch("http://localhost:3000/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;

  const data = await response.json();

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  return data.accessToken;
}