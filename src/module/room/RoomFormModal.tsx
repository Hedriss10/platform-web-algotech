import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input } from "../../components/ui";
import { createRoom, updateRoom } from "../../service/rooms";
import type { Room as RoomModel } from "../../types/room";
import { getApiErrorMessage } from "../../utils/api-error";
import { Toastify } from "../../utils/toastify";

type Mode = "create" | "edit";

const schema = z.object({
  name: z
    .string()
    .transform((s) => s.trim())
    .pipe(
      z
        .string()
        .min(1, "Obrigatório")
        .max(30, "Máximo 30 caracteres.")
    ),
});

type FormValues = z.input<typeof schema>;

export type RoomFormModalProps = {
  mode: Mode;
  room: RoomModel | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function RoomFormModal({
  mode,
  room,
  onClose,
  onSaved,
}: RoomFormModalProps) {
  const defaultValues: FormValues = useMemo(
    () => ({
      name: mode === "edit" && room ? room.name : "",
    }),
    [mode, room]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (mode === "create") {
        await createRoom({ name: values.name });
        Toastify("Sala criada com sucesso.", {
          type: "success",
          position: "top-right",
        });
      } else if (room) {
        await updateRoom(room.id, { name: values.name });
        Toastify("Sala atualizada com sucesso.", {
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
      aria-labelledby="room-form-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15">
        <h2 id="room-form-title" className="text-lg font-bold text-slate-900">
          {mode === "create" ? "Nova sala" : "Editar sala"}
        </h2>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={onSubmit}
          noValidate
        >
          <Input
            label="Nome"
            maxLength={30}
            autoComplete="off"
            error={errors.name?.message}
            {...register("name")}
          />
          <p className="text-xs text-slate-500">
            Entre 1 e 30 caracteres. O nome deve ser único entre salas ativas.
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
