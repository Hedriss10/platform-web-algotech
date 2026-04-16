import { Button } from "../components/ui";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/60 px-6 py-10 text-slate-900 sm:px-10">
      <header className="flex flex-col gap-6 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Início
          </h1>
          <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-slate-600">
            Área autenticada — o token é enviado automaticamente nas chamadas
            feitas com{" "}
            <code className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
              apiClient
            </code>
            .
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={logout}>
          Sair
        </Button>
      </header>
      <section className="mt-10 flex max-w-lg flex-col gap-2 text-sm text-slate-800">
        <p>
          <span className="text-slate-500">E-mail:</span> {user?.email ?? "—"}
        </p>
        <p>
          <span className="text-slate-500">Papel:</span> {user?.role ?? "—"}
        </p>
        <p>
          <span className="text-slate-500">ID:</span>{" "}
          <span className="font-mono text-xs text-slate-700">
            {user?.id ?? "—"}
          </span>
        </p>
      </section>
    </div>
  );
}
