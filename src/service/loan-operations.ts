import type {
  CreateLoanOperationPayload,
  LoanOperation,
  UpdateLoanOperationPayload,
} from "../types/loan-operation";
import { apiClient } from "./api-base-client";

export async function fetchLoanOperations(): Promise<LoanOperation[]> {
  const { data } = await apiClient.get<LoanOperation[]>(
    "/api/v2/loan-operations"
  );
  return Array.isArray(data) ? data : [];
}

export async function fetchLoanOperationById(
  id: string
): Promise<LoanOperation> {
  const { data } = await apiClient.get<LoanOperation>(
    `/api/v2/loan-operations/${id}`
  );
  return data;
}

export async function createLoanOperation(
  payload: CreateLoanOperationPayload
): Promise<LoanOperation> {
  const { data } = await apiClient.post<LoanOperation>(
    "/api/v2/loan-operations",
    payload
  );
  return data;
}

export async function updateLoanOperation(
  id: string,
  payload: UpdateLoanOperationPayload
): Promise<LoanOperation> {
  const { data } = await apiClient.patch<LoanOperation>(
    `/api/v2/loan-operations/${id}`,
    payload
  );
  return data;
}

export async function deleteLoanOperation(id: string): Promise<void> {
  await apiClient.delete(`/api/v2/loan-operations/${id}`);
}
