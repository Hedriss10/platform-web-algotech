import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input } from "../../components/ui";
import { createBanker, updateBanker } from "../../service/bankers";
import type { Banker as BankerModel } from "../../types/banker";
import { getApiErrorMessage } from "../../utils/api-error";
import { Toastify } from "../../utils/toastify";

type Mode = "create" | "edit";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Mínimo 3 caracteres.")
    .max(20, "Máximo 20 caracteres."),
});

type FormValues = z.infer<typeof formSchema>;

export type BankerFormModalProps = {
  mode: Mode;
  banker: BankerModel | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function BankerFormModal({
  mode,
  banker,
  onClose,
  onSaved,
}: BankerFormModalProps) {
  const defaultValues: FormValues = useMemo(
    () => ({
      name: mode === "edit" && banker ? banker.name : "",
    }),
    [mode, banker]
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
        await createBanker({ name });
        Toastify("Banco criado com sucesso.", {
          type: "success",
          position: "top-right",
        });
      } else if (banker) {
        await updateBanker(banker.id, { name });
        Toastify("Banco atualizado com sucesso.", {
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
      aria-labelledby="banker-form-title"
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15">
        <h2 id="banker-form-title" className="text-lg font-bold text-slate-900">
          {mode === "create" ? "Novo banco" : "Editar banco"}
        </h2>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={onSubmit}
          noValidate
        >
          <Input
            label="Nome do banco"
            autoComplete="organization"
            maxLength={20}
            error={errors.name?.message}
            {...register("name")}
          />
          <p className="text-xs text-slate-500">
            Entre 3 e 20 caracteres. O nome deve ser único.
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
