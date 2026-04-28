export type LoanOperation = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  created_by: string;
};

export type CreateLoanOperationPayload = {
  name: string;
};

export type UpdateLoanOperationPayload = {
  name: string;
};
