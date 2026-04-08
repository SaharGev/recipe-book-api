import { refreshAccessToken } from "./authService";

let setTokenGlobal: ((token: string | null) => void) | null = null;
let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

export function registerSetToken(fn: (token: string | null) => void) {
  setTokenGlobal = fn;
}

async function getNewToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push(resolve);
    });
  }

  isRefreshing = true;

  const newToken = await refreshAccessToken();

  isRefreshing = false;

  if (newToken) {
    setTokenGlobal?.(newToken);
    pendingRequests.forEach((cb) => cb(newToken));
  }

  pendingRequests = [];

  return newToken;
}

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  token: string | null = null
): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const newToken = await getNewToken();

    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      return fetch(url, { ...options, headers });
    }
  }

  return response;
}