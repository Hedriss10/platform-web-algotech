import { isAxiosError } from "axios";

/**
 * Corpo típico de erro da API (ex.: 409 com duplicado).
 * { "code": "EMPLOYEE_ALREADY_EXISTS", "message": "..." }
 */
export type ApiErrorBody = {
  code?: string;
  message?: string;
  detail?: string;
  errors?: unknown;
};

function formatValidationErrorsList(errors: unknown): string | null {
  if (!Array.isArray(errors) || errors.length === 0) return null;
  const parts = errors.map((item) => {
    if (typeof item === "string") return item.trim();
    if (item && typeof item === "object" && "msg" in item) {
      const m = (item as { msg?: unknown }).msg;
      if (typeof m === "string" && m.trim()) return m.trim();
    }
    try {
      return JSON.stringify(item);
    } catch {
      return String(item);
    }
  });
  const joined = parts.filter(Boolean).join("; ");
  return joined || null;
}

export function getApiErrorMessage(err: unknown): string {
  if (!isAxiosError(err)) {
    return "Erro inesperado.";
  }
  const raw = err.response?.data;
  if (raw && typeof raw === "object") {
    const data = raw as ApiErrorBody;
    const validation = formatValidationErrorsList(data.errors);
    if (typeof data.message === "string" && data.message.trim()) {
      return validation
        ? `${data.message.trim()}: ${validation}`
        : data.message;
    }
    if (validation) {
      return validation;
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
