import { createContext, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  refreshToken: null,
  setToken: () => {},
  setRefreshToken: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
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