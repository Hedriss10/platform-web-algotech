import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input } from "../../components/ui";
import {
  createLoanOperation,
  updateLoanOperation,
} from "../../service/loan-operations";
import type { LoanOperation as LoanOperationModel } from "../../types/loan-operation";
import { getApiErrorMessage } from "../../utils/api-error";
import { Toastify } from "../../utils/toastify";

type Mode = "create" | "edit";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Mínimo 3 caracteres.")
    .max(120, "Máximo 120 caracteres."),
});

type FormValues = z.infer<typeof formSchema>;

export type LoanOperationFormModalProps = {
  mode: Mode;
  loanOperation: LoanOperationModel | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function LoanOperationFormModal({
  mode,
  loanOperation,
  onClose,
  onSaved,
}: LoanOperationFormModalProps) {
  const defaultValues: FormValues = useMemo(
    () => ({
      name: mode === "edit" && loanOperation ? loanOperation.name : "",
    }),
    [mode, loanOperation]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const name = values.name.trim();
    try {
      if (mode === "create") {
        await createLoanOperation({ name });
        Toastify("Operação financeira criada com sucesso.", {
          type: "success",
          position: "top-right",
        });
      } else if (loanOperation) {
        await updateLoanOperation(loanOperation.id, { name });
        Toastify("Operação financeira atualizada com sucesso.", {
          type: "success",
          position: "top-right",
        });
      }
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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loan-operation-form-title"
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15">
        <h2
          id="loan-operation-form-title"
          className="text-lg font-bold text-slate-900"
        >
          {mode === "create"
            ? "Nova operação financeira"
            : "Editar operação financeira"}
        </h2>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={onSubmit}
          noValidate
        >
          <Input
            label="Nome da operação"
            autoComplete="off"
            maxLength={120}
            error={errors.name?.message}
            {...register("name")}
          />
          <p className="text-xs text-slate-500">
            Entre 3 e 120 caracteres. Espaços nas extremidades serão removidos
            pelo servidor.
          </p>

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {mode === "create" ? "Criar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
