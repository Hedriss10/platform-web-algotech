import type {
  MargemIncluirPropostaBody,
  MargemIncluirSimulacoesBody,
  MargemSimulacaoRequestBody,
} from "../types/daycoval-margem";
import { daycovalHttp } from "./daycoval-http";

function headers(loginUsuario: string) {
  return { "Login-Usuario": loginUsuario.trim() };
}

/** `GET /margem/empregadores` */
export async function margemListarEmpregadores(loginUsuario: string) {
  const { data } = await daycovalHttp.get<unknown>("/margem/empregadores", {
    headers: headers(loginUsuario),
  });
  return data;
}

/** `POST /margem/simula-proposta-consignado/margem` */
export async function margemSimularProposta(
  loginUsuario: string,
  body: MargemSimulacaoRequestBody
): Promise<unknown> {
  const { data } = await daycovalHttp.post<unknown>(
    "/margem/simula-proposta-consignado/margem",
    body,
    { headers: headers(loginUsuario) }
  );
  return data;
}

/** `POST /margem/inclui-simulacoes` — body é array JSON. */
export async function margemIncluirSimulacoes(
  loginUsuario: string,
  body: MargemIncluirSimulacoesBody
): Promise<unknown> {
  const { data } = await daycovalHttp.post<unknown>(
    "/margem/inclui-simulacoes",
    body,
    { headers: headers(loginUsuario) }
  );
  return data;
}

/** `POST /margem/inclui-proposta` */
export async function margemIncluirProposta(
  loginUsuario: string,
  body: MargemIncluirPropostaBody
): Promise<unknown> {
  const { data } = await daycovalHttp.post<unknown>(
    "/margem/inclui-proposta",
    body,
    { headers: headers(loginUsuario) }
  );
  return data;
}

/** `GET /margem/status-proposta/detalhado/:codProposta` */
export async function margemStatusPropostaDetalhado(
  loginUsuario: string,
  codProposta: string
): Promise<unknown> {
  const { data } = await daycovalHttp.get<unknown>(
    `/margem/status-proposta/detalhado/${encodeURIComponent(codProposta)}`,
    { headers: headers(loginUsuario) }
  );
  return data;
}
