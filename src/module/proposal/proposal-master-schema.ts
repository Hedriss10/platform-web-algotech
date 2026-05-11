import { z } from "zod";
import { DOCUMENT_TYPE_VALUES } from "../../types/proposal";

export const proposalMasterFieldsSchema = z.object({
  bankId: z.string().min(1, "Selecione o banco."),
  financialAgreementsId: z.string().min(1, "Selecione o convênio."),
  name: z.string().trim().min(1, "Indique o nome."),
  cpf: z.string().trim().min(11, "Mínimo 11 caracteres.").max(20, "Máximo 20."),
  document: z
    .string()
    .refine(
      (v) => !v || (DOCUMENT_TYPE_VALUES as readonly string[]).includes(v),
      { message: "Tipo de documento oficial inválido." }
    ),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  email: z
    .string()
    .trim()
    .max(120)
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "E-mail inválido.",
    }),
  place_of_birth: z.string().optional(),
  birth_city: z.string().optional(),
  birth_state: z.string().optional(),
  rg_document: z.string().optional(),
  issuing_authority: z.string().optional(),
  issuing_state: z.string().optional(),
  mother_name: z.string().optional(),
  father_name: z.string().optional(),
  neighborhood: z.string().optional(),
  address: z.string().optional(),
  address_number: z.string().optional(),
  address_complement: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  gross_salary: z.string().optional(),
  net_salary: z.string().optional(),
  mobile_phone: z.string().optional(),
  home_phone: z.string().optional(),
  work_phone: z.string().optional(),
  notes: z.string().optional(),
  issue_date: z.string().optional(),
});

export type ProposalMasterFieldsValues = z.infer<
  typeof proposalMasterFieldsSchema
>;
