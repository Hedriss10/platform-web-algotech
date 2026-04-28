import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/ui";
import { fetchBankerById } from "../../service/bankers";
import type { Banker } from "../../types/banker";
import { getApiErrorMessage } from "../../utils/api-error";
import { formatDateTime } from "../../utils/format";
import BankerAgreementsPanel from "./BankerAgreementsPanel";

export type BankerDetailModalProps = {
  bankerId: string;
  onClose: () => void;
  onRequestEdit: (row: Banker) => void;
};

export default function BankerDetailModal({
  bankerId,
  onClose,
  onRequestEdit,
}: BankerDetailModalProps) {
  const [banker, setBanker] = useState<Banker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBankerById(bankerId);
      setBanker(data);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) {
        setError("Registo já não está disponível.");
      } else {
        setError(getApiErrorMessage(err));
      }
      setBanker(null);
    } finally {
      setLoading(false);
    }
  }, [bankerId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="banker-detail-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <h2
            id="banker-detail-title"
            className="text-lg font-bold text-slate-900"
          >
            Detalhe do banco
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
          ) : banker ? (
            <>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Nome
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900">
                    {banker.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Criado em
                  </dt>
                  <dd className="mt-1 text-slate-700">
                    {formatDateTime(banker.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    ID
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs text-slate-600">
                    {banker.id}
                  </dd>
                </div>
              </dl>
              <BankerAgreementsPanel bankId={banker.id} />
            </>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/90 px-6 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Fechar
          </Button>
          {banker && !error ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onRequestEdit(banker);
                onClose();
              }}
            >
              Editar banco
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
