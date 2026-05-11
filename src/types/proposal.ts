/** Resposta do upload de documentos da proposta */
export type ProposalUploadItem = {
  url: string;
  key: string;
  content_type: string;
  size_bytes: number;
};

export type ProposalUploadResponse = {
  items: ProposalUploadItem[];
};

export type ProposalDocumentInput = {
  document_path: string;
};

/**
 * Tipo de documento oficial da proposta (enum do backend).
 * O número do CPF fica em `cpf`; o número do RG em `rg_document`.
 */
export const DOCUMENT_TYPE_VALUES = [
  "CPF",
  "CNPJ",
  "RG",
  "CNH",
  "PASSPORT",
  "DRIVER_LICENSE",
  "OTHER",
] as const;

export type DocumentTypeValue = (typeof DOCUMENT_TYPE_VALUES)[number];

export function isOfficialDocumentType(v: string): v is DocumentTypeValue {
  return (DOCUMENT_TYPE_VALUES as readonly string[]).includes(v);
}

export type ProposalGender = "MALE" | "FEMALE";

export const LOAN_STATUS_VALUES = [
  "WAITING_TYPING",
  "TYPING_PENDING",
  "CONTRACT_IN_TYPING",
  "BANK_ANALYSIS_ACCEPTED",
  "BANK_PENDING",
  "WAITING_PAYMENT",
  "PAID",
  "REJECTED",
] as const;

export type LoanStatusValue = (typeof LOAN_STATUS_VALUES)[number];

export type ProposalUpsertBody = {
  name: string;
  document?: DocumentTypeValue;
  birth_date?: string;
  financial_agreements_id: string;
  gender?: ProposalGender;
  email?: string;
  cpf: string;
  place_of_birth?: string;
  birth_city?: string;
  birth_state?: string;
  rg_document?: string;
  issuing_authority?: string;
  issuing_state?: string;
  mother_name?: string;
  father_name?: string;
  neighborhood?: string;
  address?: string;
  address_number?: string;
  address_complement?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  gross_salary?: number;
  net_salary?: number;
  mobile_phone?: string;
  home_phone?: string;
  work_phone?: string;
  notes?: string;
  issue_date?: string;
};

export type AccountUpsertBody = {
  bank_agency?: string;
  pix_key?: string;
  account_number?: string;
  agency_digit?: string;
  agency_operation?: string;
  agency_operation_digit?: string;
  account_type?: string;
  payment_type?: string;
  bank_id?: string;
};

export type LoanUpsertBody = {
  server_password?: string;
  registration_number?: string;
  dispatch_date?: string;
  available_margin?: number;
  status?: LoanStatusValue;
  term_start?: number;
  term_end?: number;
  operation_amount?: number;
  finance_table_id?: number;
  financial_agreement_id?: string;
  loan_operation_id?: number;
};

export type CreateProposalPayload = {
  proposal: ProposalUpsertBody;
  account?: AccountUpsertBody | null;
  documents?: ProposalDocumentInput[];
  loans?: LoanUpsertBody[];
};

/** Registo devolvido após POST /api/v2/proposals (campos usados no cliente) */
export type ProposalCreated = {
  id: string;
  name: string;
  financial_agreements_id: string;
  cpf: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  created_by: string;
  email?: string | null;
};

/** Linha da listagem `GET /proposals` (mestre). */
export type ProposalListRecord = ProposalCreated;

/** Proposta no detalhe / update (mestre + campos estendidos). */
export type ProposalFullRecord = ProposalCreated & Partial<ProposalUpsertBody>;

export type ProposalUpdatePayload = Partial<ProposalUpsertBody>;

export type ProposalDocumentRecord = {
  id: string;
  proposal_id: string;
  document_path: string;
  created_at?: string;
  updated_at?: string;
};

export type ProposalAccountRecord = {
  id: string;
  [key: string]: unknown;
};

export type ProposalLoanRecord = LoanUpsertBody & {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

/** `GET /proposals/{id}` — agregado (igual retorno do POST /proposals). */
export type ProposalDetailResponse = {
  proposal: ProposalFullRecord;
  account: ProposalAccountRecord | null;
  documents: ProposalDocumentRecord[];
  loans: ProposalLoanRecord[];
};

export type CreateProposalResponse = ProposalDetailResponse;
