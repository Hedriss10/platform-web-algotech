import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthShell } from "../components/layout/AuthShell";
import { decodeJwtPayload, isTokenExpired } from "../lib/jwt";
import { loginRequest, logout as logoutService } from "../service/auth";
import {
  clearStoredTokens,
  getStoredAccessToken,
} from "../service/token-storage";
import type { JwtPayload } from "../types/auth";
import { AuthContext, type AuthContextValue } from "./auth-context";

/**
 * A proteção de rotas fica em `ProtectedRoute` (redireciona para /login).
 * Aqui só gerimos sessão (token + utilizador) e o ecrã inicial “A carregar…”.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setAuthReady(true);
      return;
    }
    const payload = decodeJwtPayload(token);
    if (!payload || isTokenExpired(payload)) {
      clearStoredTokens();
      setUser(null);
    } else {
      setUser(payload);
    }
    setAuthReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginRequest({ email, password });
      const payload = decodeJwtPayload(res.access_token);
      setUser(payload);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  if (!authReady) {
    return (
      <AuthShell>
        <p className="text-center text-sm font-medium text-slate-500">
          A carregar…
        </p>
      </AuthShell>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
