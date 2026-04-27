import type {
  Banker,
  CreateBankerPayload,
  UpdateBankerPayload,
} from "../types/banker";
import { apiClient } from "./api-base-client";

export async function fetchBankers(): Promise<Banker[]> {
  const { data } = await apiClient.get<Banker[]>("/api/v2/bankers");
  return Array.isArray(data) ? data : [];
}

export async function fetchBankerById(id: string): Promise<Banker> {
  const { data } = await apiClient.get<Banker>(`/api/v2/bankers/${id}`);
  return data;
}

export async function createBanker(
  payload: CreateBankerPayload
): Promise<Banker> {
  const { data } = await apiClient.post<Banker>("/api/v2/bankers", payload);
  return data;
}

export async function updateBanker(
  id: string,
  payload: UpdateBankerPayload
): Promise<Banker> {
  const { data } = await apiClient.patch<Banker>(
    `/api/v2/bankers/${id}`,
    payload
  );
  return data;
}

export async function deleteBanker(id: string): Promise<void> {
  await apiClient.delete(`/api/v2/bankers/${id}`);
}
