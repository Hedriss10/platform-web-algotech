import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Início</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Área autenticada — o token é enviado automaticamente nas chamadas
            feitas com{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs">
              apiClient
            </code>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
        >
          Sair
        </button>
      </header>
      <section className="mt-8 space-y-2 text-zinc-300">
        <p>
          <span className="text-zinc-500">E-mail:</span> {user?.email ?? "—"}
        </p>
        <p>
          <span className="text-zinc-500">Papel:</span> {user?.role ?? "—"}
        </p>
        <p>
          <span className="text-zinc-500">ID:</span>{" "}
          <span className="font-mono text-sm">{user?.id ?? "—"}</span>
        </p>
      </section>
    </div>
  );
}
