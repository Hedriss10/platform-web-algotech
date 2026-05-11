import type {
  CreateProposalPayload,
  CreateProposalResponse,
  ProposalDetailResponse,
  ProposalListRecord,
  ProposalUpdatePayload,
  ProposalUploadItem,
  ProposalUploadResponse,
} from "../types/proposal";
import { apiClient } from "./api-base-client";

export async function fetchProposals(): Promise<ProposalListRecord[]> {
  const { data } =
    await apiClient.get<ProposalListRecord[]>("/api/v2/proposals");
  return Array.isArray(data) ? data : [];
}

export async function fetchProposalById(
  id: string
): Promise<ProposalDetailResponse> {
  const { data } = await apiClient.get<ProposalDetailResponse>(
    `/api/v2/proposals/${id}`
  );
  return data;
}

export async function updateProposal(
  id: string,
  payload: ProposalUpdatePayload
): Promise<ProposalDetailResponse> {
  const { data } = await apiClient.patch<ProposalDetailResponse>(
    `/api/v2/proposals/${id}`,
    payload
  );
  return data;
}

export async function deleteProposal(id: string): Promise<void> {
  await apiClient.delete(`/api/v2/proposals/${id}`);
}

/**
 * Envia ficheiros para o object storage. Cada ficheiro deve ir no campo `files`.
 * Remove o Content-Type JSON predefinido do cliente para o browser enviar multipart com boundary.
 */
export async function uploadProposalDocuments(
  files: File[]
): Promise<ProposalUploadItem[]> {
  const form = new FormData();
  for (const file of files) {
    form.append("files", file, file.name);
  }

  const { data } = await apiClient.post<ProposalUploadResponse>(
    "/api/v2/proposals/documents/upload",
    form,
    {
      transformRequest: [
        (body, headers) => {
          if (body instanceof FormData) {
            if (headers && typeof headers === "object") {
              const h = headers as Record<string, string | undefined>;
              delete h["Content-Type"];
            }
          }
          return body;
        },
      ],
    }
  );
  return Array.isArray(data?.items) ? data.items : [];
}

export async function createProposal(
  payload: CreateProposalPayload
): Promise<CreateProposalResponse> {
  const { data } = await apiClient.post<CreateProposalResponse>(
    "/api/v2/proposals",
    payload
  );
  return data;
}
