/** Prefixo público; em dev o Vite encaminha `/api/daycoval` para o host Daycoval com `apikey`. */
export const DAYCOVAL_PUBLIC_PREFIX = "/api/daycoval";

const STORAGE_LOGIN = "daycoval.loginUsuario";
const STORAGE_LAST_SIM_REQ = "daycoval.margem.lastSimRequestJson";
const STORAGE_LAST_SIM_RES = "daycoval.margem.lastSimulacaoJson";

export function getStoredLastSimRequestMargem(): unknown | null {
  try {
    const raw = globalThis.sessionStorage?.getItem(STORAGE_LAST_SIM_REQ);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function setStoredLastSimRequestMargem(body: unknown): void {
  try {
    globalThis.sessionStorage?.setItem(
      STORAGE_LAST_SIM_REQ,
      JSON.stringify(body)
    );
  } catch {
    /* ignore */
  }
}

export function getStoredLastSimulacaoMargem(): unknown | null {
  try {
    const raw = globalThis.sessionStorage?.getItem(STORAGE_LAST_SIM_RES);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function setStoredLastSimulacaoMargem(data: unknown): void {
  try {
    globalThis.sessionStorage?.setItem(
      STORAGE_LAST_SIM_RES,
      JSON.stringify(data)
    );
  } catch {
    /* ignore */
  }
}

export function getStoredDaycovalLoginUsuario(): string {
  try {
    return globalThis.sessionStorage?.getItem(STORAGE_LOGIN)?.trim() ?? "";
  } catch {
    return "";
  }
}

/** Valor de `DAYCOVAL_LOGIN_USUARIO` no `.env`, injetado no build pelo Vite (`VITE_DAYCOVAL_*`). */
export function getEnvDaycovalLoginUsuario(): string {
  return String(import.meta.env.VITE_DAYCOVAL_LOGIN_USUARIO ?? "").trim();
}

/** Preferência: sessão; senão default da plataforma (`.env`). */
export function resolveDefaultDaycovalLoginUsuario(): string {
  const stored = getStoredDaycovalLoginUsuario().trim();
  if (stored) return stored;
  return getEnvDaycovalLoginUsuario();
}

export function setStoredDaycovalLoginUsuario(login: string): void {
  try {
    const v = login.trim();
    if (v) {
      globalThis.sessionStorage?.setItem(STORAGE_LOGIN, v);
    } else {
      globalThis.sessionStorage?.removeItem(STORAGE_LOGIN);
    }
  } catch {
    /* ignore */
  }
}

/** Base URL da app (produção: `VITE_API_URL` sem barra final; dev: vazio = relativo). */
export function getAppOriginBase(): string {
  if (import.meta.env.DEV) {
    return "";
  }
  return (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
}
