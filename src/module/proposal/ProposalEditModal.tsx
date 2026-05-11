import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui";
import { fetchBankers } from "../../service/bankers";
import { fetchFinancialAgreementsByBankId } from "../../service/financial-agreements";
import { fetchProposalById, updateProposal } from "../../service/proposals";
import type { Banker } from "../../types/banker";
import type { FinancialAgreement } from "../../types/financial-agreement";
import { getApiErrorMessage } from "../../utils/api-error";
import { Toastify } from "../../utils/toastify";
import { buildProposalUpdatePayload } from "./build-create-proposal-payload";
import ProposalMasterFormFields from "./ProposalMasterFormFields";
import { proposalRecordToMasterFormValues } from "./proposal-form-from-api";
import type { ProposalMasterFieldsValues } from "./proposal-master-schema";
import { proposalMasterFieldsSchema } from "./proposal-master-schema";
import { resolveBankIdForAgreement } from "./resolve-bank-for-agreement";

type EditValues = ProposalMasterFieldsValues;

const defaultMaster: EditValues = {
  bankId: "",
  financialAgreementsId: "",
  name: "",
  cpf: "",
  document: "",
  birth_date: "",
  gender: "",
  email: "",
  place_of_birth: "",
  birth_city: "",
  birth_state: "",
  rg_document: "",
  issuing_authority: "",
  issuing_state: "",
  mother_name: "",
  father_name: "",
  neighborhood: "",
  address: "",
  address_number: "",
  address_complement: "",
  city: "",
  state: "",
  zip_code: "",
  gross_salary: "",
  net_salary: "",
  mobile_phone: "",
  home_phone: "",
  work_phone: "",
  notes: "",
  issue_date: "",
};

export type ProposalEditModalProps = {
  proposalId: string;
  onClose: () => void;
  onSaved: () => void;
};

export default function ProposalEditModal({
  proposalId,
  onClose,
  onSaved,
}: ProposalEditModalProps) {
  const [banks, setBanks] = useState<Banker[]>([]);
  const [agreements, setAgreements] = useState<FinancialAgreement[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [banksError, setBanksError] = useState<string | null>(null);
  const [loadingAgreements, setLoadingAgreements] = useState(false);
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null);
  const [loadingProposal, setLoadingProposal] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditValues>({
    resolver: zodResolver(proposalMasterFieldsSchema),
    defaultValues: defaultMaster,
  });

  const bankId = watch("bankId");
  const priorBankRef = useRef("");

  const loadBanks = useCallback(async () => {
    setLoadingBanks(true);
    setBanksError(null);
    try {
      setBanks(await fetchBankers());
    } catch (err) {
      setBanksError(getApiErrorMessage(err));
      setBanks([]);
    } finally {
      setLoadingBanks(false);
    }
  }, []);

  useEffect(() => {
    void loadBanks();
  }, [loadBanks]);

  useEffect(() => {
    if (!bankId) {
      setAgreements([]);
      setValue("financialAgreementsId", "");
      priorBankRef.current = "";
      return;
    }

    const prevBank = priorBankRef.current;
    if (prevBank !== "" && prevBank !== bankId) {
      setValue("financialAgreementsId", "");
    }
    priorBankRef.current = bankId;

    let cancelled = false;
    setLoadingAgreements(true);

    void (async () => {
      try {
        const list = await fetchFinancialAgreementsByBankId(bankId);
        if (!cancelled) setAgreements(list);
      } catch {
        if (!cancelled) setAgreements([]);
      } finally {
        if (!cancelled) setLoadingAgreements(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bankId, setValue]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoadingProposal(true);
      setInitialLoadError(null);
      priorBankRef.current = "";
      try {
        const det = await fetchProposalById(proposalId);
        if (cancelled) return;

        const master = proposalRecordToMasterFormValues(det.proposal);
        const resolvedBank = await resolveBankIdForAgreement(
          master.financialAgreementsId
        );

        if (cancelled) return;

        reset({
          ...master,
          bankId: resolvedBank || "",
        });
      } catch (err) {
        if (!cancelled) {
          setInitialLoadError(getApiErrorMessage(err));
          reset(defaultMaster);
        }
      } finally {
        if (!cancelled) setLoadingProposal(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [proposalId, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { bankId: _b, ...rest } = values;
      void _b;
      await updateProposal(proposalId, buildProposalUpdatePayload(rest));
      Toastify("Proposta atualizada.", {
        type: "success",
        position: "top-right",
      });
      onSaved();
      onClose();
    } catch (err) {
      Toastify(getApiErrorMessage(err), {
        type: "error",
        position: "top-right",
        autoClose: 5000,
      });
    }
  });

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 py-8 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-edit-title"
    >
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15">
        <h2
          id="proposal-edit-title"
          className="text-lg font-bold text-slate-900"
        >
          Editar proposta (mestre)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          O PATCH atualiza apenas a entidade principal. Conta, documentos e
          empréstimos mantêm-se; alterações a esses dados exigiriam outras
          rotas.
        </p>

        {banksError ? (
          <div
            className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
            role="status"
          >
            Convênios: {banksError}{" "}
            <button
              type="button"
              className="font-medium underline"
              onClick={() => void loadBanks()}
            >
              Tentar novamente
            </button>
          </div>
        ) : null}

        {initialLoadError ? (
          <p
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {initialLoadError}
          </p>
        ) : null}

        {loadingProposal ? (
          <p className="mt-6 text-sm text-slate-500">A carregar proposta…</p>
        ) : initialLoadError ? null : (
          <form
            className="mt-6 flex max-h-[min(70vh,calc(100vh-12rem))] flex-col gap-6 overflow-y-auto pr-1"
            onSubmit={onSubmit}
            noValidate
          >
            <ProposalMasterFormFields<EditValues>
              register={register}
              errors={errors}
              banks={banks}
              agreements={agreements}
              bankId={bankId}
              loadingBanks={loadingBanks}
              loadingAgreements={loadingAgreements}
            />

            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Guardar
              </Button>
            </div>
          </form>
        )}

        {initialLoadError ? (
          <div className="mt-6 flex justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Fechar
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
