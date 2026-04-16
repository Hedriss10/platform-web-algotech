import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      await login(data.email, data.password);
    } catch (err) {
      if (isAxiosError(err)) {
        const msg =
          (err.response?.data as { detail?: string; message?: string })
            ?.detail ??
          (err.response?.data as { message?: string })?.message ??
          err.message;
        setSubmitError(
          typeof msg === "string" ? msg : "Falha ao entrar. Tente de novo."
        );
      } else {
        setSubmitError("Erro inesperado. Tente de novo.");
      }
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm space-y-4 rounded-xl border border-white/10 bg-zinc-900/80 p-8 shadow-xl backdrop-blur"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-white">Entrar</h2>
        <p className="text-sm text-zinc-400">
          Use o e-mail e a senha da sua conta.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          E-mail
        </label>
        <input
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none ring-emerald-500/50 focus:border-emerald-500 focus:ring-2"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">Senha</label>
        <input
          type="password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none ring-emerald-500/50 focus:border-emerald-500 focus:ring-2"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      {submitError && (
        <p className="rounded-lg bg-red-950/80 px-3 py-2 text-sm text-red-200">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
