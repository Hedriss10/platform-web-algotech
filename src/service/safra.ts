import type {
  MargemBpoRequestBody,
  MargemBpoResponse,
  SafraBank,
} from "../types/safra";
import { apiClient } from "./api-base-client";

const PREFIX = "/api/v2/safra";

export async function safraListarBancos(): Promise<SafraBank[]> {
  const { data } = await apiClient.get<SafraBank[]>(`${PREFIX}/banks`);
  return data;
}

export async function safraConsultarMargemBpo(
  body: MargemBpoRequestBody
): Promise<MargemBpoResponse> {
  const { data } = await apiClient.post<MargemBpoResponse>(
    `${PREFIX}/margin/bpo`,
    body
  );
  return data;
}
