import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  return (
    <AuthContext.Provider
      value={{ token, refreshToken, setToken, setRefreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}