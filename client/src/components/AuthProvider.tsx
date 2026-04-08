import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { registerSetToken } from "../services/apiClient";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshTokenState] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  };

  useEffect(() => {
    registerSetToken(setToken);
  }, []);

  const setRefreshToken = (newToken: string | null) => {
    setRefreshTokenState(newToken);
    if (newToken) {
      localStorage.setItem("refreshToken", newToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, refreshToken, setToken, setRefreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}