import { isAxiosError } from "axios";

/**
 * Corpo típico de erro da API (ex.: 409 com duplicado).
 * { "code": "EMPLOYEE_ALREADY_EXISTS", "message": "..." }
 */
export type ApiErrorBody = {
  code?: string;
  message?: string;
  detail?: unknown;
  errors?: unknown;
};

function formatDetailField(detail: unknown): string | null {
  if (typeof detail === "string") {
    const t = detail.trim();
    return t || null;
  }
  if (Array.isArray(detail)) {
    const msgs = detail
      .map((item) => {
        if (item && typeof item === "object" && "msg" in item) {
          const m = (item as { msg?: unknown }).msg;
          return typeof m === "string" ? m.trim() : null;
        }
        return null;
      })
      .filter((x): x is string => Boolean(x));
    if (msgs.length) return msgs.join("; ");
  }
  if (detail && typeof detail === "object") {
    const messages = (detail as { messages?: unknown }).messages;
    if (Array.isArray(messages) && messages.length > 0) {
      const parts = messages
        .map((m) =>
          typeof m === "string" ? m.trim() : m != null ? String(m) : ""
        )
        .filter(Boolean);
      if (parts.length) return parts.join("\n");
    }
  }
  return null;
}

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
    const detailMsg = formatDetailField(data.detail);
    if (detailMsg) {
      return detailMsg;
    }
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw;
  }
  return err.message || "Pedido sem sucesso.";
}
