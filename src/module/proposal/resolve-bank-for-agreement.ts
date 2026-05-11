import { fetchBankers } from "../../service/bankers";
import { fetchFinancialAgreementsByBankId } from "../../service/financial-agreements";
import type { FinancialAgreement } from "../../types/financial-agreement";

export async function resolveBankIdForAgreement(
  agreementId: string
): Promise<string> {
  if (!agreementId) return "";
  const banks = await fetchBankers();
  for (const b of banks) {
    const agr = await fetchFinancialAgreementsByBankId(b.id);
    if (agr.some((a: FinancialAgreement) => a.id === agreementId)) {
      return b.id;
    }
  }
  return "";
}
