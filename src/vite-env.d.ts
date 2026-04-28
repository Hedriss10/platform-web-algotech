/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Em produção, base da API principal (sem barra final). Vazio = mesma origem (ex.: `/api/daycoval` relativo). */
  readonly VITE_API_URL?: string;
  /** Injetado em `vite.config`: "1" se `DAYCOVAL_API_KEY` (ou `VITE_…`) existia ao iniciar o Vite — proxy `/api/daycoval` ativo em dev. */
  readonly VITE_DAYCOVAL_PROXY_READY?: string;
  /** Pré-carregado a partir de `DAYCOVAL_LOGIN_USUARIO` no `.env` (build-time). */
  readonly VITE_DAYCOVAL_LOGIN_USUARIO?: string;
  /** Timeout Axios para chamadas Daycoval (ms). */
  readonly VITE_DAYCOVAL_TIMEOUT_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
