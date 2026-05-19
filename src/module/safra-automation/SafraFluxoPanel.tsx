import { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HiArrowPath,
  HiChevronLeft,
  HiChevronRight,
  HiPlay,
} from "react-icons/hi2";

import { Button, Input, Select } from "../../components/ui";
import {
  getStoredSafraMarginBpoRequest,
  getStoredSafraMarginBpoResponse,
  SAFRA_DEMO_MARGIN_BPO,
  setStoredSafraMarginBpoRequest,
  setStoredSafraMarginBpoResponse,
} from "../../config/safra";
import {
  safraConsultarFarolCredito,
  safraConsultarMargemBpo,
  safraListarBancos,
  safraListarConvenios,
  safraListarOrgaosEmpregadores,
  safraListarRegimesJuridicos,
  safraListarSituacoesEmpregado,
  safraListarTabelasJuros,
} from "../../service/safra";
import { setStoredSafraOcupacaoSelection } from "../../config/safra-ocupacao";
import SafraPropostaCard from "./SafraPropostaCard";
import {
  SAFRA_ID_PRODUTO_OPCOES,
  type CreditLighthouseItem,
  type CreditLighthouseRequestBody,
  type MargemBpoRequestBody,
  type MargemBpoResponse,
  type SafraBank,
  type SafraCatalogItem,
  type SafraFinancialAgreement,
  type SafraInterestTable,
} from "../../types/safra";
import { getApiErrorMessage } from "../../utils/api-error";
import {
  isMargemBpoResponseEmpty,
  normalizeMargemBpoResponse,
} from "../../utils/safra-margin-response";
import { Toastify } from "../../utils/toastify";

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Converte CPF em inteiro de 11 dígitos para o Farol de crédito. */
function cpfDigitsToFarolNumber(cpfDigits: string): number {
  const d = onlyDigits(cpfDigits).padStart(11, "0").slice(-11);
  return Number.parseInt(d, 10);
}

function formatCpfDigits(digits: string): string {
  const d = onlyDigits(digits).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) {
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  }
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

const BANKS_PAGE_SIZE = 10;

function BancosSafraCard() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<SafraBank[]>([]);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setBusy(true);
    setErr(null);
    try {
      const list = await safraListarBancos();
      setRows(Array.isArray(list) ? list : []);
      setPage(1);
    } catch (e) {
      setRows([]);
      setErr(
        isAxiosError(e) ? getApiErrorMessage(e) : "Erro ao listar bancos."
      );
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / BANKS_PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * BANKS_PAGE_SIZE;
  const pageRows = rows.slice(start, start + BANKS_PAGE_SIZE);
  const rangeLabel = `A mostrar ${start + 1}–${Math.min(start + BANKS_PAGE_SIZE, total)} de ${total}`;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        1 — Bancos parceiros
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Instituições disponíveis nesta integração.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => void load()}
          disabled={busy}
          className="gap-2"
        >
          <HiArrowPath
            className={`h-4 w-4 ${busy ? "animate-spin" : ""}`}
            aria-hidden
          />
          Atualizar
        </Button>
      </div>
      {err ? (
        <div
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {err}
        </div>
      ) : null}
      {rows.length > 0 ? (
        <>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200/90">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90">
                  <th className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">
                    Código
                  </th>
                  <th className="min-w-[12rem] px-4 py-2.5 font-semibold text-slate-700">
                    Nome
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">
                    CNPJ
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">
                    ISPB
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => (
                  <tr
                    key={`${r.codigoBanco}-${r.ispb}`}
                    className="border-b border-slate-100 last:border-0 hover:bg-emerald-50/30"
                  >
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-800">
                      {r.codigoBanco}
                    </td>
                    <td className="px-4 py-2 text-slate-700">{r.nomeBanco}</td>
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-700">
                      {r.cnpj}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-700">
                      {r.ispb}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
            aria-label="Paginação da lista de bancos"
          >
            <span>{rangeLabel}</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={busy || currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="gap-1.5"
              >
                <HiChevronLeft className="h-4 w-4" aria-hidden />
                Anterior
              </Button>
              <span className="tabular-nums text-slate-700">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                type="button"
                variant="secondary"
                disabled={busy || currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="gap-1.5"
              >
                Seguinte
                <HiChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        </>
      ) : !busy && !err ? (
        <p className="mt-4 text-sm text-slate-500">
          Nenhum banco na lista ou ainda a carregar…
        </p>
      ) : null}
    </section>
  );
}

function margemRow(label: string, value: string | undefined | null) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-slate-100 py-2 last:border-0 sm:grid-cols-[minmax(10rem,36%)_1fr] sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="text-sm text-slate-900">{value}</dd>
    </div>
  );
}

function MargemBpoResultado({ data }: { data: MargemBpoResponse }) {
  const curPt = useMemo(() => new Intl.NumberFormat("pt-BR"), []);

  const fmtNum = (n: number | undefined) =>
    n === undefined ? undefined : curPt.format(n);

  const boolPt = (b: boolean | undefined) =>
    b === undefined ? undefined : b ? "Sim" : "Não";

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <h3 className="text-sm font-semibold text-slate-800">
        Resultado da consulta
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        A margem pode aparecer{" "}
        <strong className="font-medium text-slate-600">negativa</strong> quando
        não houver valor disponível. Alguns dados podem ficar em branco se o
        banco não os enviar.
      </p>
      <dl className="mt-3">
        {margemRow("CPF", data.cpf)}
        {margemRow("Nome", data.nome)}
        {margemRow("Margem (R$)", fmtNum(data.margem))}
        {margemRow("Renda (R$)", fmtNum(data.renda))}
        {margemRow("Autorizada", boolPt(data.autorizada))}
        {margemRow("Lotação", data.lotacao)}
        {margemRow("Secretaria", data.secretaria)}
        {margemRow("Tipo servidor", data.tipoServidor)}
        {margemRow("Cargo", data.cargo)}
        {margemRow("Regime jurídico", data.regimeJuridico)}
        {margemRow("Data admissão", data.dataAdmissao)}
        {margemRow("UF", data.uf)}
        {margemRow("Data/hora consulta", data.dataHoraConsulta)}
      </dl>
      {typeof data.mensagemErro === "string" && data.mensagemErro.trim() ? (
        <div
          className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
          role="status"
        >
          <span className="font-medium">Mensagem: </span>
          {data.mensagemErro}
        </div>
      ) : null}
    </div>
  );
}

function MargemBpoCard() {
  const storedReq = useMemo(() => getStoredSafraMarginBpoRequest(), []);
  const storedResNormalized = useMemo(
    () => normalizeMargemBpoResponse(getStoredSafraMarginBpoResponse()),
    []
  );

  const [convenio, setConvenio] = useState(
    storedReq ? String(storedReq.convenio) : ""
  );
  const [cpfMasked, setCpfMasked] = useState(() =>
    storedReq ? formatCpfDigits(String(storedReq.cpf)) : ""
  );
  const [idProduto, setIdProduto] = useState(
    storedReq ? String(storedReq.idProduto) : ""
  );
  const [matricula, setMatricula] = useState(storedReq?.matricula ?? "");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [resultado, setResultado] = useState<MargemBpoResponse | null>(() =>
    !isMargemBpoResponseEmpty(storedResNormalized) ? storedResNormalized : null
  );

  const aplicarDemo = () => {
    setConvenio(String(SAFRA_DEMO_MARGIN_BPO.convenio));
    setCpfMasked(formatCpfDigits(String(SAFRA_DEMO_MARGIN_BPO.cpf)));
    setIdProduto(String(SAFRA_DEMO_MARGIN_BPO.idProduto));
    setMatricula(SAFRA_DEMO_MARGIN_BPO.matricula);
    Toastify("Valores de demonstração preenchidos.", {
      type: "info",
      position: "top-right",
    });
  };

  const run = useCallback(async () => {
    const conv = Number.parseInt(convenio.trim(), 10);
    const prod = Number.parseInt(idProduto.trim(), 10);
    const cpfDigits = onlyDigits(cpfMasked);

    if (!Number.isFinite(conv) || conv <= 0) {
      Toastify("Informe um convênio válido.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (cpfDigits.length !== 11) {
      Toastify(
        "O CPF deve ter 11 dígitos. Use zeros à esquerda se necessário.",
        {
          type: "warning",
          position: "top-right",
        }
      );
      return;
    }
    if (
      !Number.isFinite(prod) ||
      !SAFRA_ID_PRODUTO_OPCOES.some((o) => o.value === prod)
    ) {
      Toastify("Selecione um tipo de operação válido na lista.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    const mat = matricula.trim();
    if (!mat) {
      Toastify("Informe a matrícula.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }

    const body: MargemBpoRequestBody = {
      convenio: conv,
      cpf: cpfDigits,
      idProduto: prod,
      matricula: mat,
    };

    setBusy(true);
    setErr(null);
    try {
      const data = await safraConsultarMargemBpo(body);
      setResultado(data);
      setStoredSafraMarginBpoRequest(body);
      setStoredSafraMarginBpoResponse(data);
      Toastify("Consulta de margem concluída.", {
        type: "success",
        position: "top-right",
      });
    } catch (e) {
      setResultado(null);
      setErr(
        isAxiosError(e) ? getApiErrorMessage(e) : "Erro na consulta de margem."
      );
    } finally {
      setBusy(false);
    }
  }, [convenio, cpfMasked, idProduto, matricula]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        2 — Consulta de margem
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Informe o CPF completo (com zeros à esquerda, se aplicável) e escolha o
        tipo de operação: novo, refinanciamento, retenção ou portabilidade.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={aplicarDemo}>
          Preencher demo (homologação)
        </Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input
          label="Convênio"
          value={convenio}
          inputMode="numeric"
          onChange={(e) => setConvenio(e.target.value)}
          placeholder="ex.: 10237"
        />
        <Select
          label="Tipo de operação"
          value={idProduto}
          onChange={(e) => setIdProduto(e.target.value)}
        >
          <option value="">Selecione…</option>
          {SAFRA_ID_PRODUTO_OPCOES.map((o) => (
            <option key={o.value} value={String(o.value)}>
              {o.value} — {o.label}
            </option>
          ))}
        </Select>
        <Input
          label="CPF"
          value={cpfMasked}
          inputMode="numeric"
          maxLength={14}
          onChange={(e) => setCpfMasked(formatCpfDigits(e.target.value))}
          placeholder="000.000.000-00"
        />
        <Input
          label="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          placeholder="Matrícula do servidor"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          onClick={() => void run()}
          disabled={busy}
          className="gap-2"
        >
          <HiPlay className="h-4 w-4" aria-hidden />
          Consultar margem
        </Button>
      </div>
      {err ? (
        <div
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {err}
        </div>
      ) : null}
      {resultado ? <MargemBpoResultado data={resultado} /> : null}
    </section>
  );
}

function ConveniosSafraCard() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<SafraFinancialAgreement[]>([]);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setBusy(true);
    setErr(null);
    try {
      const list = await safraListarConvenios();
      setRows(list);
      setPage(1);
    } catch (e) {
      setRows([]);
      setErr(
        isAxiosError(e) ? getApiErrorMessage(e) : "Erro ao listar convênios."
      );
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / BANKS_PAGE_SIZE));
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * BANKS_PAGE_SIZE;
  const pageRows = rows.slice(start, start + BANKS_PAGE_SIZE);
  const rangeLabel = `A mostrar ${start + 1}–${Math.min(start + BANKS_PAGE_SIZE, total)} de ${total}`;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">3 — Convênios</h2>
      <p className="mt-1 text-sm text-slate-600">
        Órgãos e convênios disponíveis. O código listado serve para a consulta
        de margem e para as tabelas de juros abaixo.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => void load()}
          disabled={busy}
          className="gap-2"
        >
          <HiArrowPath
            className={`h-4 w-4 ${busy ? "animate-spin" : ""}`}
            aria-hidden
          />
          Atualizar
        </Button>
      </div>
      {err ? (
        <div
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {err}
        </div>
      ) : null}
      {rows.length > 0 ? (
        <>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200/90">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90">
                  <th className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">
                    Código
                  </th>
                  <th className="min-w-[10rem] px-4 py-2.5 font-semibold text-slate-700">
                    Nome
                  </th>
                  <th className="min-w-[8rem] px-4 py-2.5 font-semibold text-slate-700">
                    Fantasia
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">
                    UF
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">
                    CNPJ
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => (
                  <tr
                    key={r.idConvenio}
                    className="border-b border-slate-100 last:border-0 hover:bg-emerald-50/30"
                  >
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-800">
                      {r.idConvenio}
                    </td>
                    <td className="px-4 py-2 text-slate-700">{r.nome}</td>
                    <td className="px-4 py-2 text-slate-600">
                      {r.nomeFantasia}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                      {r.uf}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-700">
                      {r.cnpj}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
            aria-label="Paginação dos convênios"
          >
            <span>{rangeLabel}</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={busy || currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="gap-1.5"
              >
                <HiChevronLeft className="h-4 w-4" aria-hidden />
                Anterior
              </Button>
              <span className="tabular-nums text-slate-700">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                type="button"
                variant="secondary"
                disabled={busy || currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="gap-1.5"
              >
                Seguinte
                <HiChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        </>
      ) : !busy && !err ? (
        <p className="mt-4 text-sm text-slate-500">
          Nenhum convênio na lista ou ainda a carregar…
        </p>
      ) : null}
    </section>
  );
}

function TabelasJurosCard() {
  const [convenioId, setConvenioId] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<SafraInterestTable[]>([]);

  const load = useCallback(async () => {
    const id = Number.parseInt(convenioId.trim(), 10);
    if (!Number.isFinite(id) || id <= 0) {
      Toastify("Informe um id de convênio inteiro válido.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const list = await safraListarTabelasJuros(id);
      setRows(list);
      Toastify(
        list.length
          ? `${list.length} tabela(s) encontrada(s).`
          : "Nenhuma tabela para este convênio.",
        { type: list.length ? "success" : "info", position: "top-right" }
      );
    } catch (e) {
      setRows([]);
      setErr(
        isAxiosError(e)
          ? getApiErrorMessage(e)
          : "Erro ao carregar tabelas de juros."
      );
    } finally {
      setBusy(false);
    }
  }, [convenioId]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        4 — Tabelas de juros
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Indique o código do convênio (use o valor da coluna Código na lista de
        convênios).
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="min-w-[12rem] flex-1">
          <Input
            label="Código do convênio"
            value={convenioId}
            inputMode="numeric"
            onChange={(e) => setConvenioId(e.target.value)}
            placeholder="ex.: 10324"
          />
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={() => void load()}
          disabled={busy}
          className="gap-2"
        >
          <HiPlay className="h-4 w-4" aria-hidden />
          Carregar tabelas
        </Button>
      </div>
      {err ? (
        <div
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {err}
        </div>
      ) : null}
      {rows.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200/90">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90">
                <th className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">
                  Código
                </th>
                <th className="min-w-[12rem] px-4 py-2.5 font-semibold text-slate-700">
                  Descrição
                </th>
                <th className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">
                  Início vigência
                </th>
                <th className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">
                  Fim vigência
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-emerald-50/30"
                >
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-xs">
                    {r.id}
                  </td>
                  <td className="px-4 py-2 text-slate-700">{r.descricao}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-xs text-slate-600">
                    {r.dtInicioVigencia}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-xs text-slate-600">
                    {r.dtFimVigencia}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !busy && !err ? (
        <p className="mt-4 text-sm text-slate-500">
          Nenhuma tabela carregada — informe o convênio e carregue.
        </p>
      ) : null}
    </section>
  );
}

function FarolCreditoCard() {
  const [idConvenio, setIdConvenio] = useState("");
  const [idTipoProduto, setIdTipoProduto] = useState("");
  const [cpfMasked, setCpfMasked] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [resultado, setResultado] = useState<CreditLighthouseItem[] | null>(
    null
  );

  const run = useCallback(async () => {
    const conv = Number.parseInt(idConvenio.trim(), 10);
    const tipo = Number.parseInt(idTipoProduto.trim(), 10);
    const cpfDigits = onlyDigits(cpfMasked);

    if (!Number.isFinite(conv) || conv <= 0) {
      Toastify("Informe um código de convênio válido.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (!Number.isFinite(tipo) || tipo <= 0) {
      Toastify("Informe um tipo de produto válido.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (cpfDigits.length !== 11) {
      Toastify("O CPF deve ter 11 dígitos (incluindo zeros à esquerda).", {
        type: "warning",
        position: "top-right",
      });
      return;
    }

    const body: CreditLighthouseRequestBody = {
      idConvenio: conv,
      idTipoProduto: tipo,
      cpf: cpfDigitsToFarolNumber(cpfDigits),
    };

    setBusy(true);
    setErr(null);
    try {
      const data = await safraConsultarFarolCredito(body);
      setResultado(data);
      Toastify("Farol de crédito consultado.", {
        type: "success",
        position: "top-right",
      });
    } catch (e) {
      setResultado(null);
      setErr(
        isAxiosError(e)
          ? getApiErrorMessage(e)
          : "Erro na consulta ao Farol de crédito."
      );
    } finally {
      setBusy(false);
    }
  }, [idConvenio, idTipoProduto, cpfMasked]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        5 — Farol de crédito
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Consulta à análise prévia de crédito. Use o mesmo código de convênio das
        secções anteriores e o tipo de produto acordado com o banco.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Input
          label="Código do convênio"
          value={idConvenio}
          inputMode="numeric"
          onChange={(e) => setIdConvenio(e.target.value)}
          placeholder="ex.: 10237"
        />
        <Input
          label="Tipo de produto"
          value={idTipoProduto}
          inputMode="numeric"
          onChange={(e) => setIdTipoProduto(e.target.value)}
          placeholder="Conforme contrato com o banco"
        />
        <Input
          label="CPF"
          value={cpfMasked}
          inputMode="numeric"
          maxLength={14}
          onChange={(e) => setCpfMasked(formatCpfDigits(e.target.value))}
          placeholder="000.000.000-00"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          onClick={() => void run()}
          disabled={busy}
          className="gap-2"
        >
          <HiPlay className="h-4 w-4" aria-hidden />
          Consultar Farol
        </Button>
      </div>
      {err ? (
        <div
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {err}
        </div>
      ) : null}
      {resultado && resultado.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200/90">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90">
                <th className="px-4 py-2.5 font-semibold text-slate-700">
                  Decisão
                </th>
                <th className="px-4 py-2.5 font-semibold text-slate-700">
                  CPF
                </th>
                <th className="px-4 py-2.5 font-semibold text-slate-700">
                  Tipo de produto
                </th>
                <th className="min-w-[12rem] px-4 py-2.5 font-semibold text-slate-700">
                  Motivos
                </th>
                <th className="px-4 py-2.5 font-semibold text-slate-700">
                  Indicador
                </th>
              </tr>
            </thead>
            <tbody>
              {resultado.map((row, i) => (
                <tr
                  key={`${row.cpf}-${row.decisaoFarol}-${i}`}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-xs">
                    {row.decisaoFarol}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-xs">
                    {row.cpf}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                    {row.idTipoProduto === null ? "—" : row.idTipoProduto}
                  </td>
                  <td className="px-4 py-2 text-slate-700">
                    {Array.isArray(row.motivos) ? row.motivos.join(" · ") : "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                    {row.timeOut}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

function CatalogoSafraTable({
  rows,
  selectedId,
  onSelect,
  emptyLabel,
}: {
  rows: SafraCatalogItem[];
  selectedId: number | null;
  onSelect?: (id: number) => void;
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return <p className="mt-3 text-sm text-slate-500">{emptyLabel}</p>;
  }
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200/90">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/90">
            <th className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">
              Código
            </th>
            <th className="min-w-[12rem] px-4 py-2.5 font-semibold text-slate-700">
              Descrição
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const selected = selectedId === r.id;
            return (
              <tr
                key={r.id}
                className={`border-b border-slate-100 last:border-0 ${
                  onSelect
                    ? "cursor-pointer hover:bg-emerald-50/40"
                    : "hover:bg-emerald-50/30"
                } ${selected ? "bg-emerald-50/70" : ""}`}
                onClick={onSelect ? () => onSelect(r.id) : undefined}
                onKeyDown={
                  onSelect
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelect(r.id);
                        }
                      }
                    : undefined
                }
                tabIndex={onSelect ? 0 : undefined}
                role={onSelect ? "button" : undefined}
                aria-pressed={onSelect ? selected : undefined}
              >
                <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-800">
                  {r.id}
                </td>
                <td className="px-4 py-2 text-slate-700">{r.descricao}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CatalogosOcupacaoSafraCard() {
  const [convenioId, setConvenioId] = useState("");
  const [busyOrgaos, setBusyOrgaos] = useState(false);
  const [busyRegimes, setBusyRegimes] = useState(false);
  const [busySituacoes, setBusySituacoes] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [orgaos, setOrgaos] = useState<SafraCatalogItem[]>([]);
  const [orgaoSelecionado, setOrgaoSelecionado] = useState<number | null>(null);
  const [regimes, setRegimes] = useState<SafraCatalogItem[]>([]);
  const [regimeSelecionado, setRegimeSelecionado] = useState<number | null>(
    null
  );
  const [situacoes, setSituacoes] = useState<SafraCatalogItem[]>([]);
  const [situacaoSelecionada, setSituacaoSelecionada] = useState<number | null>(
    null
  );

  const parseConvenio = (): number | null => {
    const id = Number.parseInt(convenioId.trim(), 10);
    if (!Number.isFinite(id) || id <= 0) return null;
    return id;
  };

  useEffect(() => {
    const conv = Number.parseInt(convenioId.trim(), 10);
    setStoredSafraOcupacaoSelection({
      ...(Number.isFinite(conv) && conv > 0 ? { convenioId: conv } : {}),
      ...(orgaoSelecionado != null
        ? { idOrgaoEmpregador: orgaoSelecionado }
        : {}),
      ...(regimeSelecionado != null
        ? { idRegimeJuridico: regimeSelecionado }
        : {}),
      ...(situacaoSelecionada != null
        ? { idSituacaoEmpregado: situacaoSelecionada }
        : {}),
    });
  }, [convenioId, orgaoSelecionado, regimeSelecionado, situacaoSelecionada]);

  const carregarOrgaosERegimes = useCallback(async () => {
    const conv = parseConvenio();
    if (conv === null) {
      Toastify("Informe um código de convênio válido (idConvenio).", {
        type: "warning",
        position: "top-right",
      });
      return;
    }

    setErr(null);
    setOrgaoSelecionado(null);
    setRegimeSelecionado(null);
    setSituacaoSelecionada(null);
    setSituacoes([]);
    setBusyOrgaos(true);
    setBusyRegimes(true);

    const [orgaosRes, regimesRes] = await Promise.allSettled([
      safraListarOrgaosEmpregadores(conv),
      safraListarRegimesJuridicos(conv),
    ]);

    if (orgaosRes.status === "fulfilled") {
      setOrgaos(orgaosRes.value);
    } else {
      setOrgaos([]);
    }
    if (regimesRes.status === "fulfilled") {
      setRegimes(regimesRes.value);
    } else {
      setRegimes([]);
    }

    const falhas: string[] = [];
    if (orgaosRes.status === "rejected") {
      falhas.push(
        isAxiosError(orgaosRes.reason)
          ? getApiErrorMessage(orgaosRes.reason)
          : "Erro ao listar órgãos empregadores."
      );
    }
    if (regimesRes.status === "rejected") {
      falhas.push(
        isAxiosError(regimesRes.reason)
          ? getApiErrorMessage(regimesRes.reason)
          : "Erro ao listar regimes jurídicos."
      );
    }
    if (falhas.length === 2) {
      setErr(falhas.join(" · "));
    } else if (falhas.length === 1) {
      setErr(falhas[0]);
      Toastify("Um dos catálogos não pôde ser carregado.", {
        type: "warning",
        position: "top-right",
      });
    } else {
      Toastify("Catálogos carregados.", {
        type: "success",
        position: "top-right",
      });
    }

    setBusyOrgaos(false);
    setBusyRegimes(false);
  }, [convenioId]);

  const carregarSituacoes = useCallback(
    async (legalRegimeId: number) => {
      const conv = parseConvenio();
      if (conv === null) return;

      setRegimeSelecionado(legalRegimeId);
      setSituacaoSelecionada(null);
      setBusySituacoes(true);
      setErr(null);
      try {
        const list = await safraListarSituacoesEmpregado(conv, legalRegimeId);
        setSituacoes(list);
        if (!list.length) {
          Toastify("Nenhuma situação para este regime.", {
            type: "info",
            position: "top-right",
          });
        }
      } catch (e) {
        setSituacoes([]);
        setErr(
          isAxiosError(e)
            ? getApiErrorMessage(e)
            : "Erro ao listar situações do empregado."
        );
      } finally {
        setBusySituacoes(false);
      }
    },
    [convenioId]
  );

  const busyCatalogos = busyOrgaos || busyRegimes;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        7 — Catálogos de ocupação (proposta)
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Órgãos empregadores, regimes jurídicos e situações do empregado por
        convênio. Use o mesmo código da lista de convênios (
        <span className="font-mono text-xs">idConvenio</span>). Depois de
        escolher um regime na tabela, carregamos as situações correspondentes.
        Os códigos selecionados servem para{" "}
        <span className="font-mono text-xs">dadosOcupacao</span> no envio de
        proposta Safra.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="min-w-[12rem] flex-1">
          <Input
            label="Código do convênio"
            value={convenioId}
            inputMode="numeric"
            onChange={(e) => setConvenioId(e.target.value)}
            placeholder="ex.: 10324"
          />
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={() => void carregarOrgaosERegimes()}
          disabled={busyCatalogos}
          className="gap-2"
        >
          <HiPlay className="h-4 w-4" aria-hidden />
          Carregar órgãos e regimes
        </Button>
      </div>
      {err ? (
        <div
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {err}
        </div>
      ) : null}

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-800">
          Órgãos empregadores
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Campo na proposta:{" "}
          <span className="font-mono">dadosOcupacao.idOrgaoEmpregador</span>
        </p>
        {busyOrgaos ? (
          <p className="mt-3 text-sm text-slate-500">A carregar…</p>
        ) : (
          <CatalogoSafraTable
            rows={orgaos}
            selectedId={orgaoSelecionado}
            onSelect={setOrgaoSelecionado}
            emptyLabel="Nenhum órgão — carregue pelo convênio acima."
          />
        )}
        {orgaoSelecionado != null ? (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-950">
            Órgão selecionado:{" "}
            <span className="font-mono font-medium">{orgaoSelecionado}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-800">
          Regimes jurídicos
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Selecione uma linha para carregar situações. Campo na proposta:{" "}
          <span className="font-mono">dadosOcupacao.idRegimeJuridico</span>
        </p>
        {busyRegimes ? (
          <p className="mt-3 text-sm text-slate-500">A carregar…</p>
        ) : (
          <CatalogoSafraTable
            rows={regimes}
            selectedId={regimeSelecionado}
            onSelect={(id) => void carregarSituacoes(id)}
            emptyLabel="Nenhum regime — carregue pelo convênio acima."
          />
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-800">
          Situações do empregado
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Campo na proposta:{" "}
          <span className="font-mono">dadosOcupacao.idSituacaoEmpregado</span>
          {regimeSelecionado != null ? (
            <>
              {" "}
              · regime selecionado:{" "}
              <span className="font-mono">{regimeSelecionado}</span>
            </>
          ) : null}
        </p>
        {busySituacoes ? (
          <p className="mt-3 text-sm text-slate-500">A carregar situações…</p>
        ) : (
          <CatalogoSafraTable
            rows={situacoes}
            selectedId={situacaoSelecionada}
            onSelect={setSituacaoSelecionada}
            emptyLabel={
              regimeSelecionado == null
                ? "Selecione um regime jurídico na tabela acima."
                : "Nenhuma situação para este regime."
            }
          />
        )}
        {situacaoSelecionada != null ? (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-950">
            Situação selecionada:{" "}
            <span className="font-mono font-medium">{situacaoSelecionada}</span>
          </p>
        ) : null}
      </div>
    </section>
  );
}

/** Painel principal dos fluxos da integração Safra. */
export default function SafraFluxoPanel() {
  return (
    <div className="mt-8 flex flex-col gap-10">
      <BancosSafraCard />
      <MargemBpoCard />
      <ConveniosSafraCard />
      <TabelasJurosCard />
      <FarolCreditoCard />
      <CatalogosOcupacaoSafraCard />
      <SafraPropostaCard />
    </div>
  );
}
