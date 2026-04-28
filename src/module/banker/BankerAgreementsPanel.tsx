import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  HiArrowPath,
  HiPencilSquare,
  HiPlus,
  HiTrash,
  HiXMark,
} from "react-icons/hi2";
import { Button, ConfirmDeleteModal, Input } from "../../components/ui";
import {
  createFinancialAgreement,
  deleteFinancialAgreement,
  fetchFinancialAgreementsByBankId,
  updateFinancialAgreement,
} from "../../service/financial-agreements";
import type { FinancialAgreement } from "../../types/financial-agreement";
import { getApiErrorMessage } from "../../utils/api-error";
import { formatDateTime } from "../../utils/format";
import { Toastify } from "../../utils/toastify";

export type BankerAgreementsPanelProps = {
  bankId: string;
};

const NAME_MAX = 30;

export default function BankerAgreementsPanel({
  bankId,
}: BankerAgreementsPanelProps) {
  const [agreements, setAgreements] = useState<FinancialAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FinancialAgreement | null>(
    null
  );

  const load = useCallback(async () => {
    setLoading(true);
    setListError(null);
    try {
      const list = await fetchFinancialAgreementsByBankId(bankId);
      setAgreements(list);
    } catch (err) {
      setListError(getApiErrorMessage(err));
      setAgreements([]);
    } finally {
      setLoading(false);
    }
  }, [bankId]);

  useEffect(() => {
    void load();
  }, [load]);

  const startEdit = (row: FinancialAgreement) => {
    setEditingId(row.id);
    setEditName(row.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const submitEdit = async () => {
    if (!editingId) return;
    const name = editName.trim();
    if (!name) {
      Toastify("Indique o nome do convênio.", {
        type: "error",
        position: "top-right",
      });
      return;
    }
    if (name.length > NAME_MAX) {
      Toastify(`O nome tem no máximo ${NAME_MAX} caracteres.`, {
        type: "error",
        position: "top-right",
      });
      return;
    }
    setSavingEdit(true);
    try {
      await updateFinancialAgreement(editingId, { name });
      Toastify("Convênio atualizado.", {
        type: "success",
        position: "top-right",
      });
      cancelEdit();
      void load();
    } catch (err) {
      Toastify(getApiErrorMessage(err), {
        type: "error",
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const submitCreate = async () => {
    const name = newName.trim();
    if (!name) {
      Toastify("Indique o nome do convênio.", {
        type: "error",
        position: "top-right",
      });
      return;
    }
    if (name.length > NAME_MAX) {
      Toastify(`O nome tem no máximo ${NAME_MAX} caracteres.`, {
        type: "error",
        position: "top-right",
      });
      return;
    }
    setCreating(true);
    try {
      await createFinancialAgreement({ name, bank_id: bankId });
      Toastify("Convênio criado.", {
        type: "success",
        position: "top-right",
      });
      setNewName("");
      setShowCreate(false);
      void load();
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        Toastify(
          "Sessão inválida ou expirada. Inicie sessão para criar convênios.",
          {
            type: "error",
            position: "top-right",
            autoClose: 6000,
          }
        );
      } else {
        Toastify(getApiErrorMessage(err), {
          type: "error",
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setCreating(false);
    }
  };

  const runDeleteAgreement = async () => {
    if (!deleteTarget) return;
    const row = deleteTarget;
    try {
      await deleteFinancialAgreement(row.id);
      Toastify("Convênio removido.", {
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
      throw err;
    }
  };

  return (
    <>
      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Convênios financeiros
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              className="gap-1.5 text-sm"
              onClick={() => void load()}
              disabled={loading}
            >
              <HiArrowPath
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                aria-hidden
              />
              Atualizar lista
            </Button>
            <Button
              type="button"
              variant="primary"
              className="gap-1.5 text-sm"
              onClick={() => {
                setShowCreate((v) => {
                  const next = !v;
                  if (!next) setNewName("");
                  return next;
                });
              }}
            >
              {showCreate ? (
                <>
                  <HiXMark className="h-4 w-4" aria-hidden />
                  Cancelar
                </>
              ) : (
                <>
                  <HiPlus className="h-4 w-4" aria-hidden />
                  Novo convênio
                </>
              )}
            </Button>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Criar convênio requer utilizador autenticado com sessão activa
          (token). Nome até {NAME_MAX} caracteres.
        </p>

        {showCreate ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <Input
              label="Nome do convênio"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={NAME_MAX}
              placeholder="Ex.: Acordo Loja Central"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreate(false);
                  setNewName("");
                }}
                disabled={creating}
              >
                Fechar
              </Button>
              <Button
                type="button"
                variant="primary"
                loading={creating}
                onClick={() => void submitCreate()}
              >
                Criar
              </Button>
            </div>
          </div>
        ) : null}

        {listError ? (
          <p
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {listError}
          </p>
        ) : null}

        {loading && !listError ? (
          <p className="mt-4 text-sm text-slate-500">A carregar convênios…</p>
        ) : null}

        {!loading && !listError && agreements.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Nenhum convênio para este banco.
          </p>
        ) : null}

        {!loading && agreements.length > 0 ? (
          <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="sticky top-0 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
                  <th className="px-3 py-2 font-semibold text-slate-700">
                    Nome
                  </th>
                  <th className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">
                    Criado em
                  </th>
                  <th className="w-px px-2 py-2 text-right font-semibold text-slate-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {agreements.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/30"
                  >
                    <td className="px-3 py-2 align-middle">
                      {editingId === row.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          maxLength={NAME_MAX}
                          className="w-full min-w-[8rem] rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          aria-label="Nome do convênio"
                        />
                      ) : (
                        <span className="font-medium text-slate-900">
                          {row.name}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 align-middle text-slate-600">
                      {formatDateTime(row.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 align-middle text-right">
                      {editingId === row.id ? (
                        <div className="inline-flex gap-1">
                          <Button
                            type="button"
                            variant="secondary"
                            className="px-2 py-1 text-xs"
                            onClick={cancelEdit}
                            disabled={savingEdit}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="button"
                            variant="primary"
                            className="px-2 py-1 text-xs"
                            loading={savingEdit}
                            onClick={() => void submitEdit()}
                          >
                            Guardar
                          </Button>
                        </div>
                      ) : (
                        <div className="inline-flex justify-end gap-0.5">
                          <button
                            type="button"
                            className="rounded-lg p-1.5 text-slate-600 transition hover:bg-blue-100 hover:text-blue-700"
                            title="Editar nome"
                            onClick={() => startEdit(row)}
                          >
                            <HiPencilSquare className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg p-1.5 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                            title="Remover"
                            onClick={() => setDeleteTarget(row)}
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <ConfirmDeleteModal
        open={deleteTarget !== null}
        title="Remover convênio?"
        description={
          <>
            Remover o convênio <b>{deleteTarget?.name ?? ""}</b>? Esta ação não
            pode ser desfeita.
          </>
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={runDeleteAgreement}
      />
    </>
  );
}
