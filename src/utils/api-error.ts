import { isAxiosError } from "axios";

/**
 * Corpo típico de erro da API (ex.: 409 com duplicado).
 * { "code": "EMPLOYEE_ALREADY_EXISTS", "message": "..." }
 */
export type ApiErrorBody = {
  code?: string;
  message?: string;
  detail?: string;
};

export function getApiErrorMessage(err: unknown): string {
  if (!isAxiosError(err)) {
    return "Erro inesperado.";
  }
  const raw = err.response?.data;
  if (raw && typeof raw === "object") {
    const data = raw as ApiErrorBody;
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (typeof data.detail === "string" && data.detail.trim()) {
      return data.detail;
    }
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw;
  }
  return err.message || "Pedido sem sucesso.";
}
