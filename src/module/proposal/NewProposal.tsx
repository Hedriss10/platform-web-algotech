import { zodResolver } from "@hookform/resolvers/zod";
import type { ChangeEventHandler, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { HiArrowLeft, HiPlus, HiTrash } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button, Input, Select } from "../../components/ui";
import { fetchBankers } from "../../service/bankers";
import { fetchFinancialAgreementsByBankId } from "../../service/financial-agreements";
import {
  createProposal,
  uploadProposalDocuments,
} from "../../service/proposals";
import type { Banker } from "../../types/banker";
import type { FinancialAgreement } from "../../types/financial-agreement";
import { LOAN_STATUS_VALUES } from "../../types/proposal";
import { getApiErrorMessage } from "../../utils/api-error";
import { Toastify } from "../../utils/toastify";
import {
  buildCreateProposalPayload,
  emptyLoanRow,
  type ProposalFormAccountShape,
} from "./build-create-proposal-payload";
import ProposalMasterFormFields from "./ProposalMasterFormFields";
import { proposalMasterFieldsSchema } from "./proposal-master-schema";

const loanRowSchema = z.object({
  server_password: z.string().optional(),
  registration_number: z.string().optional(),
  dispatch_date: z.string().optional(),
  available_margin: z.string().optional(),
  status: z.string().optional(),
  term_start: z.string().optional(),
  term_end: z.string().optional(),
  operation_amount: z.string().optional(),
  finance_table_id: z.string().optional(),
  financial_agreement_id: z.string().optional(),
  loan_operation_id: z.string().optional(),
});

const accountSchema = z.object({
  bank_agency: z.string().optional(),
  pix_key: z.string().optional(),
  account_number: z.string().optional(),
  agency_digit: z.string().optional(),
  agency_operation: z.string().optional(),
  agency_operation_digit: z.string().optional(),
  account_type: z.string().optional(),
  payment_type: z.string().optional(),
  bank_id: z.string().optional(),
});

const formSchema = proposalMasterFieldsSchema.extend({
  account: accountSchema,
  loans: z.array(loanRowSchema),
});

type FormValues = z.infer<typeof formSchema>;

function emptyAccount(): ProposalFormAccountShape {
  return {
    bank_agency: "",
    pix_key: "",
    account_number: "",
    agency_digit: "",
    agency_operation: "",
    agency_operation_digit: "",
    account_type: "",
    payment_type: "",
    bank_id: "",
  };
}

function FieldGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-base font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function NewProposal() {
  const navigate = useNavigate();
  const [banks, setBanks] = useState<Banker[]>([]);
  const [agreements, setAgreements] = useState<FinancialAgreement[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [banksError, setBanksError] = useState<string | null>(null);
  const [loadingAgreements, setLoadingAgreements] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      account: emptyAccount(),
      loans: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "loans",
  });

  const bankId = watch("bankId");

  const loadBanks = useCallback(async () => {
    setLoadingBanks(true);
    setBanksError(null);
    try {
      const list = await fetchBankers();
      setBanks(list);
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
      return;
    }

    let cancelled = false;
    setLoadingAgreements(true);
    setValue("financialAgreementsId", "");

    void (async () => {
      try {
        const list = await fetchFinancialAgreementsByBankId(bankId);
        if (!cancelled) setAgreements(list);
      } catch (err) {
        if (!cancelled) {
          Toastify(getApiErrorMessage(err), {
            type: "error",
            position: "top-right",
            autoClose: 5000,
          });
          setAgreements([]);
        }
      } finally {
        if (!cancelled) setLoadingAgreements(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bankId, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      let documentPaths: { document_path: string }[] = [];
      if (files.length > 0) {
        const uploaded = await uploadProposalDocuments(files);
        documentPaths = uploaded.map((item) => ({
          document_path: item.url || item.key,
        }));
      }

      const { bankId: _proposalBank, ...rest } = values;
      void _proposalBank;
      const payload = buildCreateProposalPayload(rest, documentPaths);
      await createProposal(payload);

      Toastify("Proposta criada com sucesso.", {
        type: "success",
        position: "top-right",
      });
      navigate("/proposals");
    } catch (err) {
      Toastify(getApiErrorMessage(err), {
        type: "error",
        position: "top-right",
        autoClose: 5000,
      });
    }
  });

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFiles(Array.from(event.target.files ?? []));
  };

  return (
    <div className="px-6 py-10 text-slate-900 sm:px-10">
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link
            to="/proposals"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-800"
          >
            <HiArrowLeft className="h-4 w-4" aria-hidden />
            Voltar às propostas
          </Link>
          <div className="hidden h-6 w-px bg-slate-200 sm:block" aria-hidden />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Nova proposta
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Preencha todos os campos necessários. Campos vazios não são
              enviados.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto flex max-w-5xl flex-col gap-8"
      >
        {banksError ? (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {banksError}{" "}
            <button
              type="button"
              className="font-medium underline hover:no-underline"
              onClick={() => void loadBanks()}
            >
              Tentar novamente
            </button>
          </div>
        ) : null}

        <ProposalMasterFormFields<FormValues>
          register={register}
          errors={errors}
          banks={banks}
          agreements={agreements}
          bankId={bankId}
          loadingBanks={loadingBanks}
          loadingAgreements={loadingAgreements}
        />

        <Section title="Conta bancária (opcional)">
          <FieldGrid>
            <Select
              label="Banco da conta"
              disabled={loadingBanks}
              error={errors.account?.bank_id?.message}
              {...register("account.bank_id")}
            >
              <option value="">—</option>
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
            <Input
              label="Tipo de conta"
              error={errors.account?.account_type?.message}
              {...register("account.account_type")}
            />
            <Input
              label="Tipo de pagamento"
              error={errors.account?.payment_type?.message}
              {...register("account.payment_type")}
            />
            <Input
              label="Agência"
              error={errors.account?.bank_agency?.message}
              {...register("account.bank_agency")}
            />
            <Input
              label="Dígito da agência"
              error={errors.account?.agency_digit?.message}
              {...register("account.agency_digit")}
            />
            <Input
              label="Operação da agência"
              error={errors.account?.agency_operation?.message}
              {...register("account.agency_operation")}
            />
            <Input
              label="Dígito da operação"
              error={errors.account?.agency_operation_digit?.message}
              {...register("account.agency_operation_digit")}
            />
            <Input
              label="Número da conta"
              error={errors.account?.account_number?.message}
              {...register("account.account_number")}
            />
            <Input
              label="Chave PIX"
              error={errors.account?.pix_key?.message}
              {...register("account.pix_key")}
            />
          </FieldGrid>
        </Section>

        <Section title="Documentos anexos (opcional)">
          <Input
            label="Ficheiros"
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            multiple
            onChange={handleFileChange}
          />
          <p className="mt-2 text-xs text-slate-500">
            JPEG, PNG, WebP ou PDF. Vários ficheiros admitidos.
            {files.length > 0 ? (
              <span className="mt-1 block font-medium text-slate-700">
                {files.length} ficheiro(s) selecionado(s).
              </span>
            ) : null}
          </p>
        </Section>

        <Section title="Empréstimos (opcional)">
          <div className="mt-4 flex flex-col gap-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-800">
                    Empréstimo {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    className="!min-h-9 gap-1 text-red-700 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <HiTrash className="h-4 w-4" aria-hidden />
                    Remover
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Input
                    label="Senha de servidor"
                    {...register(`loans.${index}.server_password` as const)}
                  />
                  <Input
                    label="Matrícula"
                    {...register(`loans.${index}.registration_number` as const)}
                  />
                  <Input
                    label="Data de expediente"
                    type="datetime-local"
                    {...register(`loans.${index}.dispatch_date` as const)}
                  />
                  <Input
                    label="Margem disponível"
                    {...register(`loans.${index}.available_margin` as const)}
                  />
                  <Select
                    label="Estado"
                    {...register(`loans.${index}.status` as const)}
                  >
                    <option value="">—</option>
                    {LOAN_STATUS_VALUES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                  <Input
                    label="Prazo início"
                    {...register(`loans.${index}.term_start` as const)}
                  />
                  <Input
                    label="Prazo fim"
                    {...register(`loans.${index}.term_end` as const)}
                  />
                  <Input
                    label="Valor da operação"
                    {...register(`loans.${index}.operation_amount` as const)}
                  />
                  <Input
                    label="ID tabela de financiamento"
                    {...register(`loans.${index}.finance_table_id` as const)}
                  />
                  <Input
                    label="ID convênio financeiro (empréstimo)"
                    {...register(
                      `loans.${index}.financial_agreement_id` as const
                    )}
                  />
                  <Input
                    label="ID operação financeira"
                    {...register(`loans.${index}.loan_operation_id` as const)}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              className="w-fit gap-2"
              onClick={() => append(emptyLoanRow())}
            >
              <HiPlus className="h-4 w-4" aria-hidden />
              Adicionar empréstimo
            </Button>
          </div>
        </Section>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200/80 pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/proposals")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Criar proposta
          </Button>
        </div>
      </form>
    </div>
  );
}
