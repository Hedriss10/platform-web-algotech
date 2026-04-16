export type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  document: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export type CreateEmployeePayload = {
  first_name: string;
  last_name: string;
  document: string;
  email: string;
  password: string;
  role: string;
};

export type UpdateEmployeePayload = {
  first_name?: string;
  last_name?: string;
  document?: string;
  email?: string;
  role?: string;
  password?: string;
};

export const EMPLOYEE_ROLE_OPTIONS = ["ADMIN", "EMPLOYEE"] as const;
