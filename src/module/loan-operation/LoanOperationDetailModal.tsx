import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/ui";
import { fetchLoanOperationById } from "../../service/loan-operations";
import type { LoanOperation } from "../../types/loan-operation";
import { getApiErrorMessage } from "../../utils/api-error";
import { formatDateTime } from "../../utils/format";

export type LoanOperationDetailModalProps = {
  loanOperationId: string;
  onClose: () => void;
  onRequestEdit: (row: LoanOperation) => void;
};

export default function LoanOperationDetailModal({
  loanOperationId,
  onClose,
  onRequestEdit,
}: LoanOperationDetailModalProps) {
  const [loanOperation, setLoanOperation] = useState<LoanOperation | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLoanOperationById(loanOperationId);
      setLoanOperation(data);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) {
        setError("Registo já não está disponível.");
      } else {
        setError(getApiErrorMessage(err));
      }
      setLoanOperation(null);
    } finally {
      setLoading(false);
    }
  }, [loanOperationId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loan-operation-detail-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <h2
            id="loan-operation-detail-title"
            className="text-lg font-bold text-slate-900"
          >
            Detalhe da operação financeira
          </h2>

          {loading ? (
            <p className="mt-6 text-sm text-slate-500">A carregar…</p>
          ) : error ? (
            <p
              className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {error}
            </p>
          ) : loanOperation ? (
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Nome
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {loanOperation.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Criado em
                </dt>
                <dd className="mt-1 text-slate-700">
                  {formatDateTime(loanOperation.created_at)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Atualizado em
                </dt>
                <dd className="mt-1 text-slate-700">
                  {formatDateTime(loanOperation.updated_at)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Criado por (ID)
                </dt>
                <dd className="mt-1 break-all font-mono text-xs text-slate-600">
                  {loanOperation.created_by}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  ID
                </dt>
                <dd className="mt-1 break-all font-mono text-xs text-slate-600">
                  {loanOperation.id}
                </dd>
              </div>
            </dl>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/90 px-6 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Fechar
          </Button>
          {loanOperation && !error ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onRequestEdit(loanOperation);
                onClose();
              }}
            >
              Editar operação
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
