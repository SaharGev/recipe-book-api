import { createContext } from "react";

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