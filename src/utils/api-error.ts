import { isAxiosError } from "axios";

/**
 * Corpo típico de erro da API Hub.
 * Inclui `UPSTREAM_HTTP_ERROR` quando a Safra (ou outro parceiro) falha.
 */
export type ApiErrorBody = {
  code?: string;
  message?: string;
  detail?: unknown;
  errors?: unknown;
  upstream_status?: number;
  upstream_body?: string;
  upstream_message?: string;
  upstream_json?: unknown;
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

function extractMessageFromUnknownJson(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const o = json as Record<string, unknown>;

  for (const key of ["mensagem", "message", "detail", "erro", "title"]) {
    const v = o[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }

  const criticas = o.criticas;
  if (Array.isArray(criticas) && criticas.length > 0) {
    return criticas.map((c) => String(c)).join("; ");
  }

  const nestedErro = o.erro;
  if (nestedErro && typeof nestedErro === "object") {
    const desc = (nestedErro as { descricao?: unknown }).descricao;
    if (typeof desc === "string" && desc.trim()) return desc.trim();
  }

  const fieldErrors = o.errors;
  if (
    fieldErrors &&
    typeof fieldErrors === "object" &&
    !Array.isArray(fieldErrors)
  ) {
    const parts: string[] = [];
    for (const [field, val] of Object.entries(
      fieldErrors as Record<string, unknown>
    )) {
      if (Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === "string" && item.trim()) {
            parts.push(`${field}: ${item.trim()}`);
          }
        }
      } else if (typeof val === "string" && val.trim()) {
        parts.push(`${field}: ${val.trim()}`);
      }
    }
    if (parts.length) return parts.join("; ");
  }

  return null;
}

function formatUpstreamError(data: ApiErrorBody): string | null {
  const status = data.upstream_status;
  const prefix =
    status != null ? `Safra / parceiro (HTTP ${status})` : "Safra / parceiro";

  const upstreamMsg = data.upstream_message?.trim();
  if (upstreamMsg) return `${prefix}: ${upstreamMsg}`;

  const fromJson = extractMessageFromUnknownJson(data.upstream_json);
  if (fromJson) return `${prefix}: ${fromJson}`;

  const body = data.upstream_body?.trim();
  if (body) {
    try {
      const parsed = JSON.parse(body) as unknown;
      const extracted = extractMessageFromUnknownJson(parsed);
      if (extracted) return `${prefix}: ${extracted}`;
    } catch {
      if (body.length <= 600) return `${prefix}: ${body}`;
    }
  }

  if (status === 401) {
    return `${prefix}: credenciais Safra inválidas ou token expirado. Verifique API_SAFRA no Hub.`;
  }
  if (status === 403) {
    return `${prefix}: acesso negado pela API Safra.`;
  }
  if (status === 503 || status === 502) {
    return `${prefix}: serviço indisponível ou em manutenção.`;
  }

  const generic = data.message?.trim();
  if (
    generic &&
    !generic.includes("upstream_status") &&
    !generic.includes("upstream_body")
  ) {
    return generic;
  }

  return status != null
    ? `${prefix}: falha na chamada. Confira credenciais Safra no servidor e os dados do convênio.`
    : null;
}

export function getApiErrorMessage(err: unknown): string {
  if (!isAxiosError(err)) {
    return "Erro inesperado.";
  }
  const raw = err.response?.data;
  if (raw && typeof raw === "object") {
    const data = raw as ApiErrorBody;

    if (data.code === "UPSTREAM_HTTP_ERROR" || data.upstream_status != null) {
      const upstream = formatUpstreamError(data);
      if (upstream) return upstream;
    }

    const validation = formatValidationErrorsList(data.errors);
    if (typeof data.message === "string" && data.message.trim()) {
      const msg = data.message.trim();
      if (
        msg.includes("upstream_body") &&
        (data.upstream_status != null || data.upstream_body)
      ) {
        const upstream = formatUpstreamError(data);
        if (upstream) return upstream;
      }
      return validation ? `${msg}: ${validation}` : msg;
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
