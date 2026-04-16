import { createContext } from "react";
import type { JwtPayload } from "../types/auth";

export type AuthContextValue = {
  user: JwtPayload | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
