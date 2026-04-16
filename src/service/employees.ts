import type {
  CreateEmployeePayload,
  Employee,
  UpdateEmployeePayload,
} from "../types/employee";
import { apiClient } from "./api-base-client";

export async function fetchEmployees(): Promise<Employee[]> {
  const { data } = await apiClient.get<Employee[]>("/api/v2/employees");
  return Array.isArray(data) ? data : [];
}

export async function createEmployee(
  payload: CreateEmployeePayload
): Promise<Employee> {
  const { data } = await apiClient.post<Employee>("/api/v2/employees", payload);
  return data;
}

export async function updateEmployee(
  id: string,
  payload: UpdateEmployeePayload
): Promise<Employee> {
  const body: Record<string, string> = {
    first_name: payload.first_name ?? "",
    last_name: payload.last_name ?? "",
    document: payload.document ?? "",
    email: payload.email ?? "",
    role: payload.role ?? "",
  };
  if (payload.password?.trim()) {
    body.password = payload.password.trim();
  }
  const { data } = await apiClient.patch<Employee>(
    `/api/v2/employees/${id}`,
    body
  );
  return data;
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiClient.delete(`/api/v2/employees/${id}`);
}
