import axios from "axios";
import { getStoredAccessToken } from "./token-storage";

/**
 * Em desenvolvimento, use URLs relativas (`/api/...`) para o proxy do Vite.
 * Em produção, `VITE_API_URL` deve apontar para a origem da API (sem barra final).
 */
function getBaseURL(): string {
  if (import.meta.env.DEV) {
    return "";
  }
  const url = import.meta.env.VITE_API_URL ?? "";
  return url.replace(/\/$/, "");
}

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
