import type { ProposalFullRecord } from "../../types/proposal";
import { isOfficialDocumentType } from "../../types/proposal";
import type { BuildProposalMasterFormInput } from "./build-create-proposal-payload";

function isoToDateInput(raw: string | null | undefined): string {
  if (raw == null || raw === "") return "";
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(String(raw).trim());
  return m?.[1] ?? "";
}

function isoToDatetimeLocalInput(raw: string | null | undefined): string {
  if (raw == null || raw === "") return "";
  const d = new Date(String(raw));
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function numToStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return "";
}

function strOrEmpty(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function documentEnumOrEmpty(v: unknown): string {
  const s = strOrEmpty(v).trim();
  if (!s) return "";
  return isOfficialDocumentType(s) ? s : "";
}

export function proposalRecordToMasterFormValues(
  p: ProposalFullRecord
): BuildProposalMasterFormInput {
  return {
    name: strOrEmpty(p.name),
    financialAgreementsId: strOrEmpty(p.financial_agreements_id),
    cpf: strOrEmpty(p.cpf),
    document: documentEnumOrEmpty(p.document),
    birth_date: isoToDateInput(p.birth_date as string),
    gender: strOrEmpty(p.gender),
    email: strOrEmpty(p.email),
    place_of_birth: strOrEmpty(p.place_of_birth),
    birth_city: strOrEmpty(p.birth_city),
    birth_state: strOrEmpty(p.birth_state),
    rg_document: strOrEmpty(p.rg_document),
    issuing_authority: strOrEmpty(p.issuing_authority),
    issuing_state: strOrEmpty(p.issuing_state),
    mother_name: strOrEmpty(p.mother_name),
    father_name: strOrEmpty(p.father_name),
    neighborhood: strOrEmpty(p.neighborhood),
    address: strOrEmpty(p.address),
    address_number: strOrEmpty(p.address_number),
    address_complement: strOrEmpty(p.address_complement),
    city: strOrEmpty(p.city),
    state: strOrEmpty(p.state),
    zip_code: strOrEmpty(p.zip_code),
    gross_salary: numToStr(p.gross_salary),
    net_salary: numToStr(p.net_salary),
    mobile_phone: strOrEmpty(p.mobile_phone),
    home_phone: strOrEmpty(p.home_phone),
    work_phone: strOrEmpty(p.work_phone),
    notes: strOrEmpty(p.notes),
    issue_date: isoToDatetimeLocalInput(p.issue_date as string),
  };
}
