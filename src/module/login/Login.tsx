import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { titlePlatform } from "../../utils/title-platform";
import { Toastify } from "../../utils/toastify";

const loginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function getLoginErrorMessage(err: unknown): string {
  if (!isAxiosError(err)) {
    return "Erro inesperado. Tenta de novo.";
  }
  const status = err.response?.status;
  const data = err.response?.data as
    | { detail?: string; message?: string }
    | undefined;
  const fromApi = data?.detail ?? data?.message;
  if (typeof fromApi === "string" && fromApi.trim()) {
    return fromApi;
  }
  if (status === 401 || status === 403) {
    return "E-mail ou senha incorretos.";
  }
  if (status === 422) {
    return "Dados inválidos. Verifica o e-mail e a senha.";
  }
  if (status === 429) {
    return "Muitas tentativas. Aguarda um momento e tenta de novo.";
  }
  if (status && status >= 500) {
    return "Serviço indisponível. Tenta mais tarde.";
  }
  return "Não foi possível iniciar sessão. Tenta de novo.";
}

export default function Login() {
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data.email, data.password);
      Toastify("Sessão iniciada com sucesso.", {
        type: "success",
        position: "bottom-right",
        theme: "light",
        autoClose: 2500,
      });
    } catch (err) {
      const message = getLoginErrorMessage(err);
      Toastify(message, {
        type: "error",
        position: "bottom-right",
        theme: "light",
        autoClose: 4000,
      });
    }
  });

  return (
    <form
      className="rounded-2xl border border-white/60 bg-white/95 p-8 shadow-2xl shadow-blue-900/10 ring-1 ring-slate-200/80 backdrop-blur-sm sm:p-9"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="mb-7">
        <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900">
          {titlePlatform}
        </h2>
        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-slate-600">
          Email e senha para acessar o sistema.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <div className="mt-7">
        <Button type="submit" variant="primary" fullWidth loading={isLoading}>
          {isLoading ? "A iniciar sessão…" : "Entrar"}
        </Button>
      </div>
    </form>
  );
}
