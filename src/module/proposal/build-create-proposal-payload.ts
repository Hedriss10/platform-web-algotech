import {
  type AccountUpsertBody,
  type CreateProposalPayload,
  type LoanStatusValue,
  type LoanUpsertBody,
  type ProposalGender,
  type ProposalUpdatePayload,
  type ProposalUpsertBody,
  isOfficialDocumentType,
} from "../../types/proposal";

export type ProposalFormAccountShape = {
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

export type ProposalFormLoanRow = {
  server_password?: string;
  registration_number?: string;
  dispatch_date?: string;
  available_margin?: string;
  status?: string;
  term_start?: string;
  term_end?: string;
  operation_amount?: string;
  finance_table_id?: string;
  financial_agreement_id?: string;
  loan_operation_id?: string;
};

export function emptyLoanRow(): ProposalFormLoanRow {
  return {
    server_password: "",
    registration_number: "",
    dispatch_date: "",
    available_margin: "",
    status: "",
    term_start: "",
    term_end: "",
    operation_amount: "",
    finance_table_id: "",
    financial_agreement_id: "",
    loan_operation_id: "",
  };
}

function pickStr(v: string | undefined): string | undefined {
  const t = v?.trim();
  return t ? t : undefined;
}

function toIso(v: string | undefined): string | undefined {
  if (!v?.trim()) return undefined;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

/** Valor de `<input type="date">` (YYYY-MM-DD), sem hora — para Pydantic `date`. */
function toDateOnlyString(v: string | undefined): string | undefined {
  const t = v?.trim();
  if (!t || !/^\d{4}-\d{2}-\d{2}$/.test(t)) return undefined;
  const [y, m, d] = t.split("-").map(Number);
  const check = new Date(y, m - 1, d);
  if (
    check.getFullYear() !== y ||
    check.getMonth() !== m - 1 ||
    check.getDate() !== d
  ) {
    return undefined;
  }
  return t;
}

function pickInt(v: string | undefined): number | undefined {
  if (v == null || v.trim() === "") return undefined;
  const n = parseInt(v.trim(), 10);
  return Number.isFinite(n) ? n : undefined;
}

function pickFloat(v: string | undefined): number | undefined {
  if (v == null || v.trim() === "") return undefined;
  const n = Number(v.replace(",", ".").trim());
  return Number.isFinite(n) ? n : undefined;
}

function isAccountEmpty(a: ProposalFormAccountShape): boolean {
  for (const v of Object.values(a)) {
    if (pickStr(typeof v === "string" ? v : undefined)) {
      return false;
    }
  }
  return true;
}

function buildAccount(a: ProposalFormAccountShape): AccountUpsertBody | null {
  if (isAccountEmpty(a)) return null;
  const body: AccountUpsertBody = {};
  const m: [keyof AccountUpsertBody, string | undefined][] = [
    ["bank_agency", pickStr(a.bank_agency)],
    ["pix_key", pickStr(a.pix_key)],
    ["account_number", pickStr(a.account_number)],
    ["agency_digit", pickStr(a.agency_digit)],
    ["agency_operation", pickStr(a.agency_operation)],
    ["agency_operation_digit", pickStr(a.agency_operation_digit)],
    ["account_type", pickStr(a.account_type)],
    ["payment_type", pickStr(a.payment_type)],
  ];
  for (const [k, v] of m) {
    if (v !== undefined) body[k] = v;
  }
  const bankId = pickStr(a.bank_id);
  if (bankId) body.bank_id = bankId;
  return Object.keys(body).length ? body : null;
}

function buildLoanRow(row: ProposalFormLoanRow): LoanUpsertBody | null {
  const o: LoanUpsertBody = {};
  const sp = pickStr(row.server_password);
  if (sp) o.server_password = sp;
  const rn = pickStr(row.registration_number);
  if (rn) o.registration_number = rn;
  const dd = toIso(row.dispatch_date);
  if (dd) o.dispatch_date = dd;
  const am = pickFloat(row.available_margin);
  if (am !== undefined) o.available_margin = am;
  const st = pickStr(row.status);
  if (st) o.status = st as LoanStatusValue;
  const ts = pickInt(row.term_start);
  if (ts !== undefined) o.term_start = ts;
  const te = pickInt(row.term_end);
  if (te !== undefined) o.term_end = te;
  const oa = pickFloat(row.operation_amount);
  if (oa !== undefined) o.operation_amount = oa;
  const ft = pickInt(row.finance_table_id);
  if (ft !== undefined) o.finance_table_id = ft;
  const fa = pickStr(row.financial_agreement_id);
  if (fa) o.financial_agreement_id = fa;
  const lo = pickInt(row.loan_operation_id);
  if (lo !== undefined) o.loan_operation_id = lo;
  return Object.keys(o).length ? o : null;
}

export type BuildProposalMasterFormInput = {
  name: string;
  financialAgreementsId: string;
  cpf: string;
  document?: string;
  birth_date?: string;
  gender?: string;
  email?: string;
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
  gross_salary?: string;
  net_salary?: string;
  mobile_phone?: string;
  home_phone?: string;
  work_phone?: string;
  notes?: string;
  issue_date?: string;
};

export type BuildProposalFormInput = BuildProposalMasterFormInput & {
  account: ProposalFormAccountShape;
  loans: ProposalFormLoanRow[];
};

export function buildProposalUpsertBody(
  values: BuildProposalMasterFormInput
): ProposalUpsertBody {
  const proposal: ProposalUpsertBody = {
    name: values.name.trim(),
    financial_agreements_id: values.financialAgreementsId,
    cpf: values.cpf.trim(),
  };

  const docType = pickStr(values.document);
  if (docType && isOfficialDocumentType(docType)) {
    proposal.document = docType;
  }

  const bd = toDateOnlyString(values.birth_date);
  if (bd) proposal.birth_date = bd;

  const g = pickStr(values.gender);
  if (g === "MALE" || g === "FEMALE") proposal.gender = g as ProposalGender;

  const em = pickStr(values.email);
  if (em) proposal.email = em;

  const pb = pickStr(values.place_of_birth);
  if (pb) proposal.place_of_birth = pb;
  const bc = pickStr(values.birth_city);
  if (bc) proposal.birth_city = bc;
  const bs = pickStr(values.birth_state);
  if (bs) proposal.birth_state = bs;
  const rg = pickStr(values.rg_document);
  if (rg) proposal.rg_document = rg;
  const ia = pickStr(values.issuing_authority);
  if (ia) proposal.issuing_authority = ia;
  const isu = pickStr(values.issuing_state);
  if (isu) proposal.issuing_state = isu;
  const mn = pickStr(values.mother_name);
  if (mn) proposal.mother_name = mn;
  const fn = pickStr(values.father_name);
  if (fn) proposal.father_name = fn;
  const nb = pickStr(values.neighborhood);
  if (nb) proposal.neighborhood = nb;
  const ad = pickStr(values.address);
  if (ad) proposal.address = ad;
  const an = pickStr(values.address_number);
  if (an) proposal.address_number = an;
  const ac = pickStr(values.address_complement);
  if (ac) proposal.address_complement = ac;
  const city = pickStr(values.city);
  if (city) proposal.city = city;
  const st = pickStr(values.state);
  if (st) proposal.state = st;
  const zc = pickStr(values.zip_code);
  if (zc) proposal.zip_code = zc;

  const gs = pickFloat(values.gross_salary);
  if (gs !== undefined) proposal.gross_salary = gs;
  const ns = pickFloat(values.net_salary);
  if (ns !== undefined) proposal.net_salary = ns;

  const mp = pickStr(values.mobile_phone);
  if (mp) proposal.mobile_phone = mp;
  const hp = pickStr(values.home_phone);
  if (hp) proposal.home_phone = hp;
  const wp = pickStr(values.work_phone);
  if (wp) proposal.work_phone = wp;
  const notes = pickStr(values.notes);
  if (notes) proposal.notes = notes;

  const idt = toIso(values.issue_date);
  if (idt) proposal.issue_date = idt;

  return proposal;
}

export function buildProposalUpdatePayload(
  values: BuildProposalMasterFormInput
): ProposalUpdatePayload {
  return buildProposalUpsertBody(values);
}

export function buildCreateProposalPayload(
  values: BuildProposalFormInput,
  documentPaths: { document_path: string }[]
): CreateProposalPayload {
  const proposal = buildProposalUpsertBody(values);

  const acc = buildAccount(values.account);
  const loansBuilt = values.loans
    .map(buildLoanRow)
    .filter((x): x is LoanUpsertBody => x !== null);

  const out: CreateProposalPayload = {
    proposal,
    ...(acc ? { account: acc } : {}),
    ...(documentPaths.length ? { documents: documentPaths } : {}),
    ...(loansBuilt.length ? { loans: loansBuilt } : {}),
  };

  return out;
}
