import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { JwtPayload } from "../types/auth";
import { loginRequest, logout as logoutService } from "../service/auth";
import { clearStoredTokens, getStoredAccessToken } from "../service/token-storage";
import { decodeJwtPayload, isTokenExpired } from "../lib/jwt";
import { AuthContext, type AuthContextValue } from "./auth-context";

function DevProjectStrip() {
    if (!import.meta.env.DEV) return null;
    return (
        <div
            className="fixed left-0 right-0 top-0 z-[9999] bg-emerald-700 px-3 py-1 text-center text-xs font-medium text-white shadow-md"
            role="status"
        >
            Dev · platform-web-algotech — se não vires esta faixa, não estás a servir este código.
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
        [user, isLoading, login, logout],
    );

    if (!authReady) {
        return (
            <>
                <DevProjectStrip />
                <div className="flex min-h-screen items-center justify-center bg-zinc-950 pt-8 text-zinc-300">
                    Carregando…
                </div>
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
