import type {
  CreateFinancialAgreementPayload,
  FinancialAgreement,
  UpdateFinancialAgreementPayload,
} from "../types/financial-agreement";
import { apiClient } from "./api-base-client";

export async function fetchFinancialAgreementsByBankId(
  bankId: string
): Promise<FinancialAgreement[]> {
  const { data } = await apiClient.get<FinancialAgreement[]>(
    `/api/v2/financial-agreements/banks/${bankId}`
  );
  return Array.isArray(data) ? data : [];
}

export async function fetchFinancialAgreementById(
  id: string
): Promise<FinancialAgreement> {
  const { data } = await apiClient.get<FinancialAgreement>(
    `/api/v2/financial-agreements/${id}`
  );
  return data;
}

export async function createFinancialAgreement(
  payload: CreateFinancialAgreementPayload
): Promise<FinancialAgreement> {
  const { data } = await apiClient.post<FinancialAgreement>(
    "/api/v2/financial-agreements",
    payload
  );
  return data;
}

export async function updateFinancialAgreement(
  id: string,
  payload: UpdateFinancialAgreementPayload
): Promise<FinancialAgreement> {
  const { data } = await apiClient.patch<FinancialAgreement>(
    `/api/v2/financial-agreements/${id}`,
    payload
  );
  return data;
}

export async function deleteFinancialAgreement(id: string): Promise<void> {
  await apiClient.delete(`/api/v2/financial-agreements/${id}`);
}
