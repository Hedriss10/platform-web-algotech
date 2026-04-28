import axios from "axios";
import { DAYCOVAL_PUBLIC_PREFIX, getAppOriginBase } from "../config/daycoval";

function resolveDaycovalTimeoutMs(): number {
  const raw = import.meta.env.VITE_DAYCOVAL_TIMEOUT_MS;
  const n = raw ? Number.parseInt(String(raw), 10) : 30_000;
  return Number.isFinite(n) && n >= 3000 ? n : 30_000;
}

/** Cliente HTTP apenas para rotas Daycoval (sem `Authorization` Bearer da API principal). */
export const daycovalHttp = axios.create({
  baseURL: `${getAppOriginBase()}${DAYCOVAL_PUBLIC_PREFIX}`,
  timeout: resolveDaycovalTimeoutMs(),
  headers: {
    "Content-Type": "application/json",
  },
});
