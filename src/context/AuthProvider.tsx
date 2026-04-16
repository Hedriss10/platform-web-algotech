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
import { titlePlatform } from "../utils/title-platform";
import { AuthContext, type AuthContextValue } from "./auth-context";

function DevProjectStrip() {
  if (!import.meta.env.DEV) return null;
  return (
    <div
      className="fixed left-0 right-0 top-0 z-[10000] bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 px-3 py-1 text-center text-xs font-semibold text-white shadow-md shadow-blue-900/20"
      role="status"
    >
      Desenvolvimento da plataforma {titlePlatform} - Essa versão é de teste.
    </div>
  );
}

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
      <>
        <DevProjectStrip />
        <AuthShell>
          <p className="text-center text-sm font-medium text-slate-500">
            A carregar…
          </p>
        </AuthShell>
      </>
    );
  }

  return (
    <>
      <DevProjectStrip />
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
