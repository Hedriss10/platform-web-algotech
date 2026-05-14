import { isAxiosError } from "axios";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  HiArrowDownTray,
  HiArrowPath,
  HiArrowUpTray,
  HiPlay,
  HiTrash,
  HiXMark,
} from "react-icons/hi2";

import { Button } from "../../components/ui";
import {
  getStoredSafraBatchModalSnapshot,
  setStoredSafraBatchModalSnapshot,
} from "../../config/safra-batch-modal";
import {
  safraBatchExportDownload,
  safraBatchJobStatus,
  safraBatchSearchDelete,
  safraBatchSearchJobIds,
  safraBatchUploadCsv,
} from "../../service/safra";
import type {
  SafraBatchJobStatus,
  SafraBatchUploadAccepted,
} from "../../types/safra";
import { getApiErrorMessage } from "../../utils/api-error";
import { Toastify } from "../../utils/toastify";

/** Quantidade de envios por página no histórico (lista pode crescer muito). */
const HISTORICO_POR_PAGINA = 10;

/** Estados devolvidos pelo servidor — texto legível para quem usa o ecrã. */
function estadoParaUtilizador(status: string): string {
  const map: Record<string, string> = {
    queued: "Na fila",
    processing: "A processar",
    completed: "Concluído",
    failed: "Concluído com erros",
  };
  return map[status] ?? status;
}

export type SafraBatchModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function SafraBatchModal({
  open,
  onClose,
}: SafraBatchModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [polling, setPolling] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  const [accepted, setAccepted] = useState<SafraBatchUploadAccepted | null>(
    () => {
      const s = getStoredSafraBatchModalSnapshot();
      return s?.accepted ?? null;
    }
  );
  const [jobStatus, setJobStatus] = useState<SafraBatchJobStatus | null>(() => {
    const s = getStoredSafraBatchModalSnapshot();
    return s?.jobStatus ?? null;
  });

  const [jobIds, setJobIds] = useState<string[]>([]);
  const [jobIdsBusy, setJobIdsBusy] = useState(false);
  const [jobIdsErr, setJobIdsErr] = useState<string | null>(null);

  const [exportBusyId, setExportBusyId] = useState<string | null>(null);
  const [deleteBusyId, setDeleteBusyId] = useState<string | null>(null);
  const [historicoPagina, setHistoricoPagina] = useState(1);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current !== null) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setPolling(false);
  }, []);

  const loadJobIds = useCallback(async () => {
    setJobIdsBusy(true);
    setJobIdsErr(null);
    try {
      const ids = await safraBatchSearchJobIds();
      setJobIds(ids);
    } catch (e) {
      setJobIds([]);
      setJobIdsErr(
        isAxiosError(e)
          ? getApiErrorMessage(e)
          : "Erro ao carregar a lista de processamentos."
      );
    } finally {
      setJobIdsBusy(false);
    }
  }, []);

  const fetchStatus = useCallback(
    async (jobId: string, opts?: { silent?: boolean }) => {
      try {
        const s = await safraBatchJobStatus(jobId);
        setJobStatus(s);
        if (s.status === "completed" || s.status === "failed") {
          stopPolling();
          void loadJobIds();
          if (!opts?.silent) {
            Toastify(
              s.status === "completed"
                ? "Tratamento da lista concluído. Já pode descarregar os resultados."
                : "O tratamento da lista terminou com erros. Veja o ficheiro ao descarregar.",
              {
                type: s.status === "completed" ? "success" : "warning",
                position: "top-right",
                autoClose: 5500,
              }
            );
          }
        }
      } catch (e) {
        stopPolling();
        setUploadErr(
          isAxiosError(e)
            ? getApiErrorMessage(e)
            : "Não foi possível ver o estado do processamento."
        );
      }
    },
    [loadJobIds, stopPolling]
  );

  const startPolling = useCallback(
    (jobId: string) => {
      stopPolling();
      setPolling(true);
      void fetchStatus(jobId);
      pollIntervalRef.current = setInterval(
        () => void fetchStatus(jobId),
        3000
      );
    },
    [fetchStatus, stopPolling]
  );

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    setStoredSafraBatchModalSnapshot(accepted, jobStatus);
  }, [accepted, jobStatus]);

  useEffect(() => {
    if (!open) {
      stopPolling();
      setCsvFile(null);
      setUploadErr(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    void loadJobIds();
    const snap = getStoredSafraBatchModalSnapshot();
    const jobId = snap?.jobStatus?.job_id ?? snap?.accepted?.job_id;
    const st = snap?.jobStatus?.status ?? snap?.accepted?.status ?? "";
    if (jobId && st !== "completed" && st !== "failed") {
      startPolling(jobId);
    }
  }, [open, loadJobIds, stopPolling, startPolling]);

  useEffect(() => {
    if (!open) return;
    setHistoricoPagina(1);
  }, [open]);

  useEffect(() => {
    const totalPaginas = Math.max(
      1,
      Math.ceil(jobIds.length / HISTORICO_POR_PAGINA)
    );
    setHistoricoPagina((p) => Math.min(p, totalPaginas));
  }, [jobIds.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setCsvFile(f ?? null);
    setUploadErr(null);
  };

  const upload = async () => {
    if (!csvFile) {
      Toastify("Escolha primeiro um ficheiro na lista.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    setUploadBusy(true);
    setUploadErr(null);
    stopPolling();
    try {
      const data = await safraBatchUploadCsv(csvFile);
      setAccepted(data);
      setJobStatus({
        job_id: data.job_id,
        status: data.status,
        total_rows: data.total_rows,
        processed_rows: 0,
        failed_rows: 0,
        detail: null,
      });
      startPolling(data.job_id);
      Toastify(
        `Lista recebida (${data.total_rows} linhas). Estamos a atualizar o progresso…`,
        {
          type: "success",
          position: "top-right",
        }
      );
    } catch (e) {
      setUploadErr(
        isAxiosError(e)
          ? getApiErrorMessage(e)
          : "Não foi possível enviar o ficheiro."
      );
    } finally {
      setUploadBusy(false);
    }
  };

  const exportJob = async (jobId: string) => {
    setExportBusyId(jobId);
    try {
      await safraBatchExportDownload(jobId);
      Toastify("Ficheiro guardado no seu computador.", {
        type: "success",
        position: "top-right",
      });
    } catch (e) {
      Toastify(
        e instanceof Error
          ? e.message
          : "Não foi possível descarregar o ficheiro.",
        {
          type: "error",
          position: "top-right",
        }
      );
    } finally {
      setExportBusyId(null);
    }
  };

  const deleteLot = async (jobId: string) => {
    const ok = window.confirm(
      "Apagar permanentemente os resultados guardados deste envio? Deixa de conseguir descarregar este ficheiro a partir da lista. Esta ação não pode ser desfeita."
    );
    if (!ok) return;

    setDeleteBusyId(jobId);
    try {
      await safraBatchSearchDelete(jobId);
      const atual =
        jobStatus?.job_id ?? accepted?.job_id ?? null;
      if (atual === jobId) {
        stopPolling();
        setAccepted(null);
        setJobStatus(null);
      }
      await loadJobIds();
      Toastify("Resultados deste envio foram removidos.", {
        type: "success",
        position: "top-right",
      });
    } catch (e) {
      const msg =
        isAxiosError(e) && e.response?.status === 404
          ? "Não havia dados guardados para este envio (talvez já removidos)."
          : isAxiosError(e)
            ? getApiErrorMessage(e)
            : "Não foi possível apagar os resultados.";
      Toastify(msg, {
        type: "error",
        position: "top-right",
      });
      await loadJobIds();
    } finally {
      setDeleteBusyId(null);
    }
  };

  if (!open) return null;

  const activeJobId = jobStatus?.job_id ?? accepted?.job_id ?? null;

  const historicoTotal = jobIds.length;
  const historicoTotalPaginas = Math.max(
    1,
    Math.ceil(historicoTotal / HISTORICO_POR_PAGINA)
  );
  const historicoInicio = (historicoPagina - 1) * HISTORICO_POR_PAGINA;
  const historicoSlice = jobIds.slice(
    historicoInicio,
    historicoInicio + HISTORICO_POR_PAGINA
  );
  const historicoMostrarDe = historicoTotal === 0 ? 0 : historicoInicio + 1;
  const historicoMostrarAte = Math.min(
    historicoInicio + HISTORICO_POR_PAGINA,
    historicoTotal
  );

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safra-batch-modal-title"
      onClick={() => onClose()}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2
              id="safra-batch-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              Consultas em lista
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Envie uma folha com várias linhas; o sistema trata uma a uma. Se
              fechar esta janela, o resumo do{" "}
              <strong className="font-medium text-slate-700">
                último envio
              </strong>{" "}
              continua disponível quando voltar a abrir.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <section className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Novo envio</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Utilize um ficheiro do tipo CSV (por exemplo &quot;Guardar
              como&quot; no Excel usando o modo .csv). Na primeira linha deve
              constar convênio, CPF, matrícula e tipo de produto — valores{" "}
              <span className="whitespace-nowrap">1, 2, 5 ou 7</span>. Pode
              incluir colunas opcionais de telefone (
              <span className="font-mono text-[11px]">phone_one</span> …{" "}
              <span className="font-mono text-[11px]">phone_five</span>
              ). No Excel em português as colunas costumam estar separadas por
              ponto e vírgula; também pode usar vírgula.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={onFileChange}
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadBusy}
                className="gap-2"
              >
                <HiArrowUpTray className="h-4 w-4" aria-hidden />
                Escolher ficheiro
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => void upload()}
                disabled={uploadBusy || !csvFile}
                className="gap-2"
              >
                <HiPlay className="h-4 w-4" aria-hidden />
                Iniciar processamento
              </Button>
              <span className="text-sm text-slate-600">
                {csvFile ? (
                  <span className="font-medium text-slate-800">
                    {csvFile.name}
                  </span>
                ) : (
                  "Nenhum ficheiro."
                )}
                {polling ? (
                  <span className="ml-2 inline-flex items-center gap-1 text-emerald-700">
                    <HiArrowPath className="h-4 w-4 animate-spin" aria-hidden />
                    A atualizar progresso…
                  </span>
                ) : null}
              </span>
            </div>
            {uploadErr ? (
              <div
                className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 whitespace-pre-wrap"
                role="alert"
              >
                {uploadErr}
              </div>
            ) : null}
            {accepted || jobStatus ? (
              <dl className="mt-4 grid gap-2 rounded-lg border border-white bg-white/90 p-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-slate-500">Referência</dt>
                  <dd className="font-mono text-[11px] break-all text-slate-900">
                    {jobStatus?.job_id ?? accepted?.job_id ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Situação</dt>
                  <dd className="font-medium text-slate-900">
                    {jobStatus?.status || accepted?.status
                      ? estadoParaUtilizador(
                          jobStatus?.status ?? accepted?.status ?? ""
                        )
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Progresso</dt>
                  <dd className="text-slate-900">
                    {jobStatus
                      ? `${jobStatus.total_rows} linhas no total · ${jobStatus.processed_rows} já tratadas · ${jobStatus.failed_rows} com problema`
                      : `${accepted?.total_rows ?? "—"} linhas na lista`}
                  </dd>
                </div>
                <div className="flex items-end">
                  {activeJobId ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="gap-2"
                      disabled={exportBusyId === activeJobId || uploadBusy}
                      onClick={() => void exportJob(activeJobId)}
                    >
                      <HiArrowDownTray
                        className="h-4 w-4 shrink-0"
                        aria-hidden
                      />
                      Descarregar resultados
                    </Button>
                  ) : null}
                </div>
              </dl>
            ) : null}
            {jobStatus?.detail ? (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                <span className="font-medium">Nota: </span>
                {jobStatus.detail}
              </p>
            ) : null}
          </section>

          <section className="mt-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-800">
                Histórico com ficheiro para descarregar
              </h3>
              <Button
                type="button"
                variant="secondary"
                className="gap-2 !min-h-9 text-xs"
                disabled={jobIdsBusy}
                onClick={() => void loadJobIds()}
              >
                <HiArrowPath
                  className={`h-3.5 w-3.5 ${jobIdsBusy ? "animate-spin" : ""}`}
                  aria-hidden
                />
                Atualizar
              </Button>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-slate-500">
              Lista dos envios que já têm resultado guardado.{" "}
              <strong className="font-medium text-slate-600">Descarregar</strong>{" "}
              guarda a folha no computador (abre bem no Excel).{" "}
              <strong className="font-medium text-slate-600">Apagar</strong> remove
              para sempre os dados desse envio no servidor.
            </p>
            {jobIdsErr ? (
              <div
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                role="alert"
              >
                {jobIdsErr}
              </div>
            ) : jobIds.length === 0 && !jobIdsBusy ? (
              <p className="text-sm text-slate-500">
                Ainda não há envios com resultado para mostrar.
              </p>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white">
                {jobIdsBusy && historicoTotal === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-slate-500">
                    A carregar histórico…
                  </p>
                ) : (
                  <ul
                    className="space-y-2 p-2"
                    aria-label="Lista paginada do histórico"
                  >
                    {historicoSlice.map((id) => (
                      <li
                        key={id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2"
                      >
                      <span className="font-mono text-[11px] text-slate-800 break-all">
                        {id}
                      </span>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="gap-1.5 !min-h-9 text-xs"
                          disabled={
                            exportBusyId === id ||
                            deleteBusyId === id ||
                            jobIdsBusy
                          }
                          onClick={() => void exportJob(id)}
                        >
                          <HiArrowDownTray
                            className="h-3.5 w-3.5"
                            aria-hidden
                          />
                          Descarregar
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          className="gap-1.5 !min-h-9 border-red-200 text-xs text-red-800 hover:border-red-300 hover:bg-red-50"
                          disabled={
                            exportBusyId === id ||
                            deleteBusyId === id ||
                            jobIdsBusy
                          }
                          onClick={() => void deleteLot(id)}
                          aria-label="Apagar resultados guardados deste envio"
                        >
                          <HiTrash className="h-3.5 w-3.5" aria-hidden />
                          Apagar
                        </Button>
                      </div>
                      </li>
                    ))}
                  </ul>
                )}
                {historicoTotalPaginas > 1 ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-2 py-2 sm:px-3">
                    <p className="text-xs text-slate-500">
                      {historicoTotal === 0
                        ? "—"
                        : `Mostrando ${historicoMostrarDe}–${historicoMostrarAte} de ${historicoTotal}`}
                      <span className="sr-only">
                        {`. Página ${historicoPagina} de ${historicoTotalPaginas}.`}
                      </span>
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="!min-h-8 px-2.5 text-xs"
                        disabled={historicoPagina <= 1 || jobIdsBusy}
                        onClick={() =>
                          setHistoricoPagina((p) => Math.max(1, p - 1))
                        }
                      >
                        Anterior
                      </Button>
                      <span
                        className="tabular-nums text-xs text-slate-600"
                        aria-hidden
                      >
                        {historicoPagina} / {historicoTotalPaginas}
                      </span>
                      <Button
                        type="button"
                        variant="secondary"
                        className="!min-h-8 px-2.5 text-xs"
                        disabled={
                          historicoPagina >= historicoTotalPaginas || jobIdsBusy
                        }
                        onClick={() =>
                          setHistoricoPagina((p) =>
                            Math.min(historicoTotalPaginas, p + 1)
                          )
                        }
                      >
                        Seguinte
                      </Button>
                    </div>
                  </div>
                ) : historicoTotal > 0 ? (
                  <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">
                    Total: {historicoTotal}{" "}
                    {historicoTotal === 1 ? "envio" : "envios"}
                  </p>
                ) : null}
              </div>
            )}
          </section>
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 py-3">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
