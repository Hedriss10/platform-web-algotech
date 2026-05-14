import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input, Select } from "../../components/ui";
import type { Banker } from "../../types/banker";
import type { FinancialAgreement } from "../../types/financial-agreement";
import { DOCUMENT_TYPE_VALUES } from "../../types/proposal";
import type { ProposalMasterFieldsValues } from "./proposal-master-schema";

export const proposalMasterNotesTextareaClass =
  "min-h-[88px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm transition placeholder:text-slate-400 " +
  "hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/15 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70";

function FieldGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/35">
      <h2 className="text-base font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

type Props<T extends ProposalMasterFieldsValues = ProposalMasterFieldsValues> =
  {
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    banks: Banker[];
    agreements: FinancialAgreement[];
    bankId: string;
    loadingBanks: boolean;
    loadingAgreements: boolean;
  };

export default function ProposalMasterFormFields<
  T extends ProposalMasterFieldsValues = ProposalMasterFieldsValues,
>(props: Props<T>) {
  const {
    register,
    errors,
    banks,
    agreements,
    bankId,
    loadingBanks,
    loadingAgreements,
  } = props;

  return (
    <>
      <Section title="Convênio">
        <FieldGrid>
          <Select
            label="Banco"
            disabled={loadingBanks}
            error={errors.bankId?.message as string | undefined}
            {...register("bankId" as never)}
          >
            <option value="">
              {loadingBanks ? "A carregar bancos…" : "Selecionar…"}
            </option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
          <Select
            label="Convênio financeiro"
            disabled={!bankId || loadingAgreements}
            error={errors.financialAgreementsId?.message as string | undefined}
            {...register("financialAgreementsId" as never)}
          >
            <option value="">
              {!bankId
                ? "Primeiro selecione o banco"
                : loadingAgreements
                  ? "A carregar…"
                  : agreements.length === 0
                    ? "Nenhum convênio"
                    : "Selecionar…"}
            </option>
            {agreements.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </FieldGrid>
      </Section>

      <Section title="Identificação e dados pessoais">
        <FieldGrid>
          <Input
            label="Nome"
            autoComplete="name"
            error={errors.name?.message as string | undefined}
            {...register("name" as never)}
          />
          <Input
            label="CPF (número)"
            error={errors.cpf?.message as string | undefined}
            {...register("cpf" as never)}
          />
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Select
              label="Tipo de documento oficial (opcional)"
              error={errors.document?.message as string | undefined}
              {...register("document" as never)}
            >
              <option value="">— omitir —</option>
              {DOCUMENT_TYPE_VALUES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <p className="text-xs text-slate-500">
              tipo de documento oficial. O número do CPF vai no campo «CPF»; o
              número do RG no campo «RG».
            </p>
          </div>
          <Input
            label="RG (número)"
            error={errors.rg_document?.message as string | undefined}
            {...register("rg_document" as never)}
          />
          <Input
            label="Data de nascimento"
            type="date"
            error={errors.birth_date?.message as string | undefined}
            {...register("birth_date" as never)}
          />
          <Select
            label="Género"
            error={errors.gender?.message as string | undefined}
            {...register("gender" as never)}
          >
            <option value="">—</option>
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Feminino</option>
          </Select>
          <Input
            label="E-mail"
            type="email"
            error={errors.email?.message as string | undefined}
            {...register("email" as never)}
          />
          <Input
            label="Data de emissão (documento)"
            type="datetime-local"
            error={errors.issue_date?.message as string | undefined}
            {...register("issue_date" as never)}
          />
          <Input
            label="Local de nascimento"
            error={errors.place_of_birth?.message as string | undefined}
            {...register("place_of_birth" as never)}
          />
          <Input
            label="Cidade de nascimento"
            error={errors.birth_city?.message as string | undefined}
            {...register("birth_city" as never)}
          />
          <Input
            label="Estado de nascimento"
            error={errors.birth_state?.message as string | undefined}
            {...register("birth_state" as never)}
          />
          <Input
            label="Órgão emissor"
            error={errors.issuing_authority?.message as string | undefined}
            {...register("issuing_authority" as never)}
          />
          <Input
            label="Estado do órgão emissor"
            error={errors.issuing_state?.message as string | undefined}
            {...register("issuing_state" as never)}
          />
          <Input
            label="Nome da mãe"
            error={errors.mother_name?.message as string | undefined}
            {...register("mother_name" as never)}
          />
          <Input
            label="Nome do pai"
            error={errors.father_name?.message as string | undefined}
            {...register("father_name" as never)}
          />
        </FieldGrid>
      </Section>

      <Section title="Morada">
        <FieldGrid>
          <Input
            label="Morada"
            className="md:col-span-2"
            error={errors.address?.message as string | undefined}
            {...register("address" as never)}
          />
          <Input
            label="Número"
            error={errors.address_number?.message as string | undefined}
            {...register("address_number" as never)}
          />
          <Input
            label="Complemento"
            error={errors.address_complement?.message as string | undefined}
            {...register("address_complement" as never)}
          />
          <Input
            label="Bairro"
            error={errors.neighborhood?.message as string | undefined}
            {...register("neighborhood" as never)}
          />
          <Input
            label="Cidade"
            error={errors.city?.message as string | undefined}
            {...register("city" as never)}
          />
          <Input
            label="Estado (UF)"
            error={errors.state?.message as string | undefined}
            {...register("state" as never)}
          />
          <Input
            label="CEP"
            error={errors.zip_code?.message as string | undefined}
            {...register("zip_code" as never)}
          />
        </FieldGrid>
      </Section>

      <Section title="Contactos e remunerações">
        <FieldGrid>
          <Input
            label="Telemóvel"
            error={errors.mobile_phone?.message as string | undefined}
            {...register("mobile_phone" as never)}
          />
          <Input
            label="Telefone residencial"
            error={errors.home_phone?.message as string | undefined}
            {...register("home_phone" as never)}
          />
          <Input
            label="Telefone profissional"
            error={errors.work_phone?.message as string | undefined}
            {...register("work_phone" as never)}
          />
          <Input
            label="Salário bruto"
            error={errors.gross_salary?.message as string | undefined}
            {...register("gross_salary" as never)}
          />
          <Input
            label="Salário líquido"
            error={errors.net_salary?.message as string | undefined}
            {...register("net_salary" as never)}
          />
        </FieldGrid>
        <div className="mt-4 flex flex-col gap-1.5 md:col-span-2">
          <label
            htmlFor="proposal-master-notes"
            className="text-sm font-semibold tracking-tight text-slate-800"
          >
            Notas
          </label>
          <textarea
            id="proposal-master-notes"
            rows={4}
            className={proposalMasterNotesTextareaClass}
            aria-invalid={errors.notes ? true : undefined}
            {...register("notes" as never)}
          />
          {errors.notes ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.notes.message as string}
            </p>
          ) : null}
        </div>
      </Section>
    </>
  );
}
