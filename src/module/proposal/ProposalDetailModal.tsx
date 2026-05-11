import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/ui";
import { fetchProposalById } from "../../service/proposals";
import type { ProposalDetailResponse } from "../../types/proposal";
import { getApiErrorMessage } from "../../utils/api-error";
import { formatDateTime } from "../../utils/format";

export type ProposalDetailModalProps = {
  proposalId: string;
  onClose: () => void;
};

function Dt({ term, value }: { term: string; value?: string | number | null }) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {term}
      </dt>
      <dd className="mt-1 break-words text-slate-800">{value}</dd>
    </div>
  );
}

export default function ProposalDetailModal({
  proposalId,
  onClose,
}: ProposalDetailModalProps) {
  const [detail, setDetail] = useState<ProposalDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProposalById(proposalId);
      setDetail(data);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) {
        setError("Proposta não encontrada ou já removida.");
      } else {
        setError(getApiErrorMessage(err));
      }
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [proposalId]);

  useEffect(() => {
    void load();
  }, [load]);

  const proposal = detail?.proposal;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-detail-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <h2
            id="proposal-detail-title"
            className="text-lg font-bold text-slate-900"
          >
            Detalhe da proposta
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
          ) : proposal ? (
            <div className="mt-6 space-y-8 text-sm">
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Proposta (mestre)
                </h3>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Dt term="Nome" value={proposal.name} />
                  <Dt term="CPF" value={proposal.cpf} />
                  <Dt term="Tipo documento oficial" value={proposal.document} />
                  <Dt term="RG (nº)" value={proposal.rg_document} />
                  <Dt term="E-mail" value={proposal.email ?? undefined} />
                  <Dt term="Gênero" value={proposal.gender ?? undefined} />
                  <Dt
                    term="Convênio (ID)"
                    value={proposal.financial_agreements_id}
                  />
                  <Dt
                    term="Atualizado em"
                    value={formatDateTime(proposal.updated_at)}
                  />
                  <Dt
                    term="Criado em"
                    value={formatDateTime(proposal.created_at)}
                  />
                  <Dt term="Morada" value={proposal.address ?? undefined} />
                  <Dt term="Cidade" value={proposal.city ?? undefined} />
                  <Dt term="Estado (UF)" value={proposal.state ?? undefined} />
                  <Dt term="CEP" value={proposal.zip_code ?? undefined} />
                  <Dt
                    term="Telemóvel"
                    value={proposal.mobile_phone ?? undefined}
                  />
                  <Dt term="Notas" value={proposal.notes ?? undefined} />
                  <Dt term="ID (proposta)" value={proposal.id} />
                </dl>
                <p className="break-all font-mono text-[11px] text-slate-500">
                  Criado por: {proposal.created_by}
                </p>
              </section>

              {detail!.account ? (
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Conta bancária
                  </h3>
                  <pre className="max-h-40 overflow-auto rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                    {JSON.stringify(detail.account, null, 2)}
                  </pre>
                </section>
              ) : null}

              {detail!.documents.length > 0 ? (
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Documentos anexos
                  </h3>
                  <ul className="space-y-2">
                    {detail!.documents.map((d) => (
                      <li
                        key={d.id}
                        className="break-all rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 font-mono text-xs text-blue-700"
                      >
                        {d.document_path.startsWith("http") ? (
                          <a
                            href={d.document_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:no-underline"
                          >
                            {d.document_path}
                          </a>
                        ) : (
                          d.document_path
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {detail!.loans.length > 0 ? (
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Empréstimos
                  </h3>
                  <ul className="space-y-3">
                    {detail!.loans.map((loan) => (
                      <li
                        key={loan.id}
                        className="rounded-xl border border-slate-100 bg-slate-50/80"
                      >
                        <pre className="max-h-48 overflow-auto p-3 text-xs leading-relaxed text-slate-700">
                          {JSON.stringify(loan, null, 2)}
                        </pre>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/90 px-6 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
