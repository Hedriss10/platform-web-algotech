import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Login from "../module/login/Login";

function resolvePostLoginTarget(
  fromState: string | undefined,
): string {
  const fallback = "/";
  if (!fromState || !fromState.startsWith("/")) return fallback;
  // Evita loop: /login → login → redirect /login
  if (fromState === "/login") return fallback;
  return fromState;
}

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const rawFrom = (location.state as { from?: string } | null)?.from;
  const to = resolvePostLoginTarget(rawFrom);

  if (isAuthenticated) {
    return <Navigate to={to} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <Login />
      </div>
    </div>
  );
}
