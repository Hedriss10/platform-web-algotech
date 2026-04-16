import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Select } from "../../components/ui";
import { createEmployee, updateEmployee } from "../../service/employees";
import {
  EMPLOYEE_ROLE_OPTIONS,
  type Employee as EmployeeModel,
} from "../../types/employee";
import { getApiErrorMessage } from "../../utils/api-error";
import { Toastify } from "../../utils/toastify";

type Mode = "create" | "edit";

export type EmployeeFormModalProps = {
  mode: Mode;
  employee: EmployeeModel | null;
  onClose: () => void;
  onSaved: () => void;
};

type FormValues = {
  first_name: string;
  last_name: string;
  document: string;
  email: string;
  password: string;
  role: (typeof EMPLOYEE_ROLE_OPTIONS)[number];
};

function buildSchema(mode: Mode) {
  return z
    .object({
      first_name: z.string().min(1, "Obrigatório"),
      last_name: z.string().min(1, "Obrigatório"),
      document: z.string().min(1, "Obrigatório"),
      email: z.string().email("E-mail inválido"),
      role: z.enum(EMPLOYEE_ROLE_OPTIONS),
      password: z.string(),
    })
    .superRefine((data, ctx) => {
      if (mode === "create") {
        if (!data.password || data.password.length < 6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["password"],
            message: "Palavra-passe com mínimo 6 caracteres.",
          });
        }
      } else if (
        data.password &&
        data.password.length > 0 &&
        data.password.length < 6
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Mínimo 6 caracteres ou deixa em branco.",
        });
      }
    });
}

export default function EmployeeFormModal({
  mode,
  employee,
  onClose,
  onSaved,
}: EmployeeFormModalProps) {
  const schema = useMemo(() => buildSchema(mode), [mode]);

  const defaultValues: FormValues = useMemo(() => {
    if (mode === "edit" && employee) {
      return {
        first_name: employee.first_name,
        last_name: employee.last_name,
        document: employee.document,
        email: employee.email,
        password: "",
        role: (EMPLOYEE_ROLE_OPTIONS as readonly string[]).includes(
          employee.role
        )
          ? (employee.role as FormValues["role"])
          : "EMPLOYEE",
      };
    }
    return {
      first_name: "",
      last_name: "",
      document: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
    };
  }, [mode, employee]);

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
        await createEmployee({
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          document: values.document.replace(/\D/g, ""),
          email: values.email.trim(),
          password: values.password,
          role: values.role,
        });
        Toastify("Funcionário criado com sucesso.", {
          type: "success",
          position: "top-right",
        });
      } else if (employee) {
        await updateEmployee(employee.id, {
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          document: values.document.replace(/\D/g, ""),
          email: values.email.trim(),
          role: values.role,
          ...(values.password.trim() ? { password: values.password } : {}),
        });
        Toastify("Funcionário atualizado com sucesso.", {
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
      aria-labelledby="employee-form-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15">
        <h2
          id="employee-form-title"
          className="text-lg font-bold text-slate-900"
        >
          {mode === "create" ? "Novo funcionário" : "Editar funcionário"}
        </h2>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={onSubmit}
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nome"
              autoComplete="given-name"
              error={errors.first_name?.message}
              {...register("first_name")}
            />
            <Input
              label="Sobrenome"
              autoComplete="family-name"
              error={errors.last_name?.message}
              {...register("last_name")}
            />
          </div>
          <Input
            label="Documento (CPF ou nº)"
            inputMode="numeric"
            error={errors.document?.message}
            {...register("document")}
          />
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label={
              mode === "create"
                ? "Palavra-passe"
                : "Nova palavra-passe (opcional)"
            }
            type="password"
            autoComplete={mode === "create" ? "new-password" : "new-password"}
            error={errors.password?.message}
            {...register("password")}
          />
          <Select
            label="Função"
            error={errors.role?.message}
            {...register("role")}
          >
            {EMPLOYEE_ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>

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
