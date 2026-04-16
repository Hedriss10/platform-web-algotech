import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import {
    HiArrowPath,
    HiPencilSquare,
    HiPlus,
    HiTrash,
    HiUserGroup,
} from "react-icons/hi2";
import { Button } from "../../components/ui";
import { deleteEmployee, fetchEmployees } from "../../service/employees";
import type { Employee as EmployeeModel } from "../../types/employee";
import { getApiErrorMessage } from "../../utils/api-error";
import { formatDateTime, formatDocumentBr } from "../../utils/format";
import { Toastify } from "../../utils/toastify";
import EmployeeFormModal from "./EmployeeFormModal";

export default function Employee() {
    const [employees, setEmployees] = useState<EmployeeModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [editing, setEditing] = useState<EmployeeModel | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await fetchEmployees();
            setEmployees(list);
        } catch (err) {
            if (isAxiosError(err)) {
                const status = err.response?.status;
                if (status === 401 || status === 403) {
                    setError("Sem permissão para listar funcionários.");
                } else {
                    setError(getApiErrorMessage(err));
                }
            } else {
                setError("Erro desconhecido ao carregar.");
            }
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const openCreate = () => {
        setModalMode("create");
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (row: EmployeeModel) => {
        setModalMode("edit");
        setEditing(row);
        setModalOpen(true);
    };

    const handleDelete = async (row: EmployeeModel) => {
        const ok = globalThis.confirm(
            `Remover ${row.first_name} ${row.last_name} da lista? Esta ação não pode ser desfeita.`
        );
        if (!ok) return;
        try {
            await deleteEmployee(row.id);
            Toastify("Funcionário removido.", {
                type: "success",
                position: "top-right",
            });
            void load();
        } catch (err) {
            Toastify(getApiErrorMessage(err), {
                type: "error",
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    return (
        <div className="px-6 py-10 text-slate-900 sm:px-10">
            <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                        <HiUserGroup className="h-7 w-7" aria-hidden />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Funcionários
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">
                            Listagem e gestão de funcionários.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={openCreate}
                        className="gap-2"
                    >
                        <HiPlus className="h-4 w-4" aria-hidden />
                        Novo
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void load()}
                        disabled={loading}
                        className="gap-2"
                    >
                        <HiArrowPath
                            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                            aria-hidden
                        />
                        Atualizar
                    </Button>
                </div>
            </header>

            {error ? (
                <div
                    className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                    role="alert"
                >
                    {error}
                </div>
            ) : null}

            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
                {loading ? (
                    <p className="px-6 py-10 text-center text-sm text-slate-500">
                        A carregar funcionários…
                    </p>
                ) : employees.length === 0 ? (
                    <p className="px-6 py-10 text-center text-sm text-slate-500">
                        Nenhum funcionário encontrado.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/90">
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                                        Nome
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                                        Documento
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                                        E-mail
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                                        Função
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                                        Criado em
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                                        Atualizado em
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-700">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40"
                                    >
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            {row.first_name} {row.last_name}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-700">
                                            {formatDocumentBr(row.document)}
                                        </td>
                                        <td className="max-w-[200px] truncate px-4 py-3 text-slate-700">
                                            {row.email}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                                                {row.role}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                                            {formatDateTime(row.created_at)}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                                            {formatDateTime(row.updated_at)}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <div className="inline-flex gap-1">
                                                <button
                                                    type="button"
                                                    className="rounded-lg p-2 text-slate-600 transition hover:bg-blue-100 hover:text-blue-700"
                                                    title="Editar"
                                                    onClick={() => openEdit(row)}
                                                >
                                                    <HiPencilSquare className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="rounded-lg p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                                                    title="Remover"
                                                    onClick={() => void handleDelete(row)}
                                                >
                                                    <HiTrash className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {modalOpen ? (
                <EmployeeFormModal
                    mode={modalMode}
                    employee={editing}
                    onClose={() => setModalOpen(false)}
                    onSaved={() => void load()}
                />
            ) : null}
        </div>
    );
}
