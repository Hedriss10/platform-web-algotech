import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  HiArrowPath,
  HiDocumentText,
  HiEye,
  HiPencilSquare,
  HiPlus,
  HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { Button, ConfirmDeleteModal } from "../../components/ui";
import { deleteProposal, fetchProposals } from "../../service/proposals";
import type { ProposalListRecord } from "../../types/proposal";
import { getApiErrorMessage } from "../../utils/api-error";
import { formatDateTime } from "../../utils/format";
import { Toastify } from "../../utils/toastify";
import ProposalDetailModal from "./ProposalDetailModal";
import ProposalEditModal from "./ProposalEditModal";

export default function Proposals() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ProposalListRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProposalListRecord | null>(
    null
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchProposals();
      setItems(list);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(getApiErrorMessage(err));
      } else {
        setError("Erro desconhecido ao carregar.");
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openDetail = (id: string) => {
    setDetailId(id);
  };

  const openEdit = (row: ProposalListRecord) => {
    setEditId(row.id);
  };

  const runDelete = async () => {
    if (!deleteTarget) return;
    const row = deleteTarget;
    try {
      await deleteProposal(row.id);
      Toastify("Proposta removida.", {
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
    <div className="px-6 py-10 text-slate-900 sm:px-10">
      <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
            <HiDocumentText className="h-7 w-7" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Propostas
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Listagem mestre, detalhe completo e edição apenas do registo
              principal da proposta (conta, documentos e empréstimos só na
              criação ou noutras rotas).
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="primary"
            className="gap-2"
            onClick={() => navigate("/proposals/new")}
          >
            <HiPlus className="h-4 w-4" aria-hidden />
            Nova proposta
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
            A carregar propostas…
          </p>
        ) : items.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-slate-500">
              Nenhuma proposta na listagem.
            </p>
            <Button
              type="button"
              variant="primary"
              className="mt-4 gap-2"
              onClick={() => navigate("/proposals/new")}
            >
              <HiPlus className="h-4 w-4" aria-hidden />
              Criar proposta
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90">
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                    Nome
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                    CPF
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
                {items.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40"
                  >
                    <td className="max-w-[200px] truncate px-4 py-3 font-medium text-slate-900">
                      {row.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {row.cpf}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatDateTime(row.updated_at)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="inline-flex justify-end gap-1">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-600 transition hover:bg-blue-100 hover:text-blue-700"
                          title="Ver detalhe"
                          onClick={() => openDetail(row.id)}
                        >
                          <HiEye className="h-5 w-5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-600 transition hover:bg-blue-100 hover:text-blue-700"
                          title="Editar mestre"
                          onClick={() => openEdit(row)}
                        >
                          <HiPencilSquare className="h-5 w-5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                          title="Remover"
                          onClick={() => setDeleteTarget(row)}
                        >
                          <HiTrash className="h-5 w-5" aria-hidden />
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

      {detailId ? (
        <ProposalDetailModal
          proposalId={detailId}
          onClose={() => setDetailId(null)}
        />
      ) : null}

      {editId ? (
        <ProposalEditModal
          proposalId={editId}
          onClose={() => setEditId(null)}
          onSaved={() => void load()}
        />
      ) : null}

      <ConfirmDeleteModal
        open={deleteTarget !== null}
        title="Remover proposta?"
        description={
          <>
            Remover <b>{deleteTarget?.name ?? ""}</b>? A API marca a proposta
            como eliminada (soft-delete).
          </>
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={runDelete}
      />
    </div>
  );
}
