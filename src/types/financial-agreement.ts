export type FinancialAgreement = {
  id: string;
  name: string;
  bank_id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  created_by: string;
};

export type CreateFinancialAgreementPayload = {
  name: string;
  bank_id: string;
};

export type UpdateFinancialAgreementPayload = {
  name: string;
};
