import { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiArrowPath, HiCheckCircle, HiPlay, HiXCircle } from "react-icons/hi2";

import { Button, Input, Select } from "../../components/ui";
import {
  getStoredSafraMarginBpoRequest,
  getStoredSafraMarginBpoResponse,
  SAFRA_DEMO_CALCULATION,
  SAFRA_DEMO_CLIENTE,
  SAFRA_DEMO_MARGIN_BPO,
  SAFRA_DEMO_PRAZOS,
  setStoredSafraMarginBpoRequest,
  setStoredSafraMarginBpoResponse,
} from "../../config/safra";
import {
  getStoredSafraVendedorSnapshot,
  patchStoredSafraVendedorSnapshot,
} from "../../config/safra-vendedor";
import {
  getStoredSafraOcupacaoSelection,
  setStoredSafraOcupacaoSelection,
} from "../../config/safra-ocupacao";
import {
  safraConsultarFarolCredito,
  safraConsultarMargemBpo,
  safraListarConvenios,
  safraListarFaixasTabela,
  safraListarOrgaosEmpregadores,
  safraListarRegimesJuridicos,
  safraListarSituacoesEmpregado,
  safraListarTabelasJuros,
  safraObterLinkFormalizacao,
  safraSimularNovo,
} from "../../service/safra";
import type {
  CalculationNewResponse,
  CreditLighthouseItem,
  MargemBpoRequestBody,
  MargemBpoResponse,
  SafraCatalogItem,
  SafraFinancialAgreement,
  SafraInterestTable,
  SafraInterestTableBand,
  SafraSimulacaoItem,
} from "../../types/safra";
import {
  SAFRA_ID_PRODUTO_OPCOES,
  SAFRA_ID_SEXO_OPCOES,
} from "../../types/safra";
import { getApiErrorMessage } from "../../utils/api-error";
import { extrairUrlsFormalizacao } from "../../utils/safra-formalization";
import {
  buildSafraCalculationNewBody,
  toSafraDateOnly,
} from "../../utils/safra-calculation-body";
import {
  filtrarConveniosSafra,
  mesclarConveniosSafra,
} from "../../utils/safra-convenios";
import {
  isMargemBpoResponseEmpty,
  normalizeMargemBpoResponse,
} from "../../utils/safra-margin-response";
import {
  formatFaixaPrazoLabel,
  prazoDaFaixa,
  prazosFromBands,
} from "../../utils/safra-table-bands";
import { Toastify } from "../../utils/toastify";
import SafraPropostaCard, {
  type SafraPropostaPrefill,
} from "./SafraPropostaCard";

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function cpfDigitsToNumber(cpfDigits: string): number {
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

function parseOptionalFloat(value: string): number | undefined {
  const v = value.trim().replace(",", ".");
  if (!v) return undefined;
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
}

function parseOptionalInt(value: string): number | undefined {
  const v = value.trim();
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

function isSafraDemoConvenio(convenioId: number): boolean {
  return convenioId === SAFRA_DEMO_MARGIN_BPO.convenio;
}

function farolAprovado(items: CreditLighthouseItem[]): boolean {
  if (!items.length) return false;
  return items.some(
    (row) =>
      row.decisaoFarol === 1 ||
      (Array.isArray(row.motivos) &&
        row.motivos.some((m) => /APROVADO/i.test(m)))
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

function MargemResumo({ data }: { data: MargemBpoResponse }) {
  const curPt = useMemo(() => new Intl.NumberFormat("pt-BR"), []);
  const fmtNum = (n: number | undefined) =>
    n === undefined ? undefined : curPt.format(n);
  const boolPt = (b: boolean | undefined) =>
    b === undefined ? undefined : b ? "Sim" : "Não";

  return (
    <dl className="mt-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      {margemRow("Nome", data.nome)}
      {margemRow("Margem (R$)", fmtNum(data.margem))}
      {margemRow("Renda (R$)", fmtNum(data.renda))}
      {margemRow("Autorizada", boolPt(data.autorizada))}
      {margemRow("Cargo", data.cargo)}
      {margemRow("Data admissão", data.dataAdmissao)}
      {typeof data.mensagemErro === "string" && data.mensagemErro.trim() ? (
        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {data.mensagemErro}
        </div>
      ) : null}
    </dl>
  );
}

/** Fluxo consignado novo orientado ao vendedor (margem → farol → simulação → proposta → formalização). */
export default function SafraVendedorFluxoPanel() {
  const snap = useMemo(() => getStoredSafraVendedorSnapshot(), []);
  const storedMarginReq = useMemo(() => getStoredSafraMarginBpoRequest(), []);
  const initialConvenio =
    snap?.convenioId ?? storedMarginReq?.convenio ?? 0;
  const initialDemo = isSafraDemoConvenio(initialConvenio);
  const storedMarginRes = useMemo(
    () => normalizeMargemBpoResponse(getStoredSafraMarginBpoResponse()),
    []
  );

  const [convenios, setConvenios] = useState<SafraFinancialAgreement[]>([]);
  const [conveniosBusy, setConveniosBusy] = useState(true);
  const [conveniosErr, setConveniosErr] = useState<string | null>(null);
  const [convenioBusca, setConvenioBusca] = useState("");

  const [convenioId, setConvenioId] = useState(
    snap?.convenioId != null
      ? String(snap.convenioId)
      : storedMarginReq
        ? String(storedMarginReq.convenio)
        : ""
  );
  const [cpfMasked, setCpfMasked] = useState(() => {
    const cpf = snap?.cpf ?? storedMarginReq?.cpf ?? "";
    return cpf ? formatCpfDigits(cpf) : "";
  });
  const [matricula, setMatricula] = useState(
    snap?.matricula ?? storedMarginReq?.matricula ?? ""
  );
  const [idProduto, setIdProduto] = useState(
    snap?.idProduto != null
      ? String(snap.idProduto)
      : storedMarginReq
        ? String(storedMarginReq.idProduto)
        : "1"
  );

  const [marginBusy, setMarginBusy] = useState(false);
  const [marginErr, setMarginErr] = useState<string | null>(null);
  const [marginResult, setMarginResult] = useState<MargemBpoResponse | null>(
    () => (!isMargemBpoResponseEmpty(storedMarginRes) ? storedMarginRes : null)
  );

  const [farolBusy, setFarolBusy] = useState(false);
  const [farolErr, setFarolErr] = useState<string | null>(null);
  const [farolResult, setFarolResult] = useState<CreditLighthouseItem[] | null>(
    null
  );

  const [tabelas, setTabelas] = useState<SafraInterestTable[]>([]);
  const [tabelasBusy, setTabelasBusy] = useState(false);
  const [idTabelaJuros, setIdTabelaJuros] = useState(
    snap?.idTabelaJuros != null ? String(snap.idTabelaJuros) : ""
  );
  const [comSeguro, setComSeguro] = useState(false);
  const [isCotacao, setIsCotacao] = useState(
    initialDemo ? SAFRA_DEMO_CALCULATION.isCotacao : false
  );
  const [valorParcelaSim, setValorParcelaSim] = useState("");
  const [valorPrincipalSim, setValorPrincipalSim] = useState("");
  const [dataAdmissaoSim, setDataAdmissaoSim] = useState(
    SAFRA_DEMO_CLIENTE.dataAdmissao
  );
  const [idUfSim, setIdUfSim] = useState("");
  const [valorRendaSim, setValorRendaSim] = useState("");
  const [valorDescontosSim, setValorDescontosSim] = useState("");
  const [idCorbanSim, setIdCorbanSim] = useState(
    initialDemo ? String(SAFRA_DEMO_CALCULATION.idCorban) : ""
  );
  const [idCorbansubsSim, setIdCorbansubsSim] = useState(
    initialDemo ? String(SAFRA_DEMO_CALCULATION.idCorbansubs) : ""
  );
  const [idComercialSim, setIdComercialSim] = useState(
    initialDemo ? String(SAFRA_DEMO_CALCULATION.idComercial) : ""
  );
  const [idSeguroSim, setIdSeguroSim] = useState(
    initialDemo ? String(SAFRA_DEMO_CALCULATION.idSeguro) : ""
  );
  const [idServico1Sim, setIdServico1Sim] = useState(
    initialDemo ? String(SAFRA_DEMO_CALCULATION.idServicos[0]) : ""
  );
  const [idServico2Sim, setIdServico2Sim] = useState(
    initialDemo ? String(SAFRA_DEMO_CALCULATION.idServicos[1]) : ""
  );
  const [taxaJurosSim, setTaxaJurosSim] = useState("");
  const [tarifaCadastroSim, setTarifaCadastroSim] = useState("");
  const [comissaoSim, setComissaoSim] = useState("");
  const [faixasTabela, setFaixasTabela] = useState<SafraInterestTableBand[]>(
    []
  );
  const [faixasBusy, setFaixasBusy] = useState(false);
  const [prazosSelecionados, setPrazosSelecionados] = useState<Set<number>>(
    () => new Set()
  );
  const [dtNascimento, setDtNascimento] = useState(
    SAFRA_DEMO_CLIENTE.dataNascimento
  );
  const [idSexo, setIdSexo] = useState(String(SAFRA_DEMO_CLIENTE.idSexo));

  const [regimes, setRegimes] = useState<SafraCatalogItem[]>([]);
  const [situacoes, setSituacoes] = useState<SafraCatalogItem[]>([]);
  const [idRegimeJuridico, setIdRegimeJuridico] = useState("");
  const [idSituacaoEmpregado, setIdSituacaoEmpregado] = useState("");
  const [idSituacaoManual, setIdSituacaoManual] = useState("");
  const [catalogBusy, setCatalogBusy] = useState(false);

  const [simBusy, setSimBusy] = useState(false);
  const [simErr, setSimErr] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<CalculationNewResponse | null>(
    null
  );
  const [simSelecionada, setSimSelecionada] =
    useState<SafraSimulacaoItem | null>(
      () => snap?.simulacaoSelecionada ?? null
    );

  const [idProposta, setIdProposta] = useState<number | null>(
    snap?.idProposta ?? null
  );

  const [formBusy, setFormBusy] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [formUrls, setFormUrls] = useState<string[]>([]);
  const [formRaw, setFormRaw] = useState<unknown>(null);

  const convNum = Number.parseInt(convenioId.trim(), 10);
  const convValido = Number.isFinite(convNum) && convNum > 0;
  const cpfDigits = onlyDigits(cpfMasked);
  const cpfValido = cpfDigits.length === 11;

  const conveniosExibidos = useMemo(() => {
    const base = mesclarConveniosSafra(convenios, [
      {
        idConvenio: SAFRA_DEMO_MARGIN_BPO.convenio,
        nome: "Convênio homologação (demo)",
        nomeFantasia: "Demo Safra",
        uf: "—",
        cnpj: 0,
      },
    ]);
    return filtrarConveniosSafra(base, convenioBusca);
  }, [convenios, convenioBusca]);

  const convenioSelecionado = useMemo(
    () => convenios.find((c) => c.idConvenio === convNum) ?? null,
    [convenios, convNum]
  );
  const farolOk = farolResult ? farolAprovado(farolResult) : false;
  const temCriticas = (simResult?.criticas?.length ?? 0) > 0;

  const loadConvenios = useCallback(async () => {
    setConveniosBusy(true);
    setConveniosErr(null);
    try {
      const list = await safraListarConvenios();
      setConvenios(list);
      if (list.length === 0) {
        Toastify(
          "Nenhum convênio na resposta — use o código manual (ex.: 10237).",
          { type: "info", position: "top-right", autoClose: 5000 }
        );
      } else {
        const tem10237 = list.some((c) => c.idConvenio === 10237);
        Toastify(
          `${list.length} convênio(s) carregado(s)${tem10237 ? "" : " — 10237 não está na lista; digite manualmente se necessário"}.`,
          {
            type: tem10237 ? "success" : "info",
            position: "top-right",
            autoClose: tem10237 ? 3000 : 5500,
          }
        );
      }
    } catch (e) {
      setConvenios([]);
      setConveniosErr(
        isAxiosError(e) ? getApiErrorMessage(e) : "Erro ao listar convênios."
      );
    } finally {
      setConveniosBusy(false);
    }
  }, []);

  useEffect(() => {
    void loadConvenios();
  }, [loadConvenios]);

  useEffect(() => {
    if (idSexo === "1") setIdSexo("M");
    else if (idSexo === "2") setIdSexo("F");
  }, [idSexo]);

  const loadTabelas = useCallback(async () => {
    if (!convValido) return;
    setTabelasBusy(true);
    try {
      const list = await safraListarTabelasJuros(convNum);
      setTabelas(list);
      if (list.length === 1) {
        setIdTabelaJuros(String(list[0].id));
      }
    } catch {
      setTabelas([]);
    } finally {
      setTabelasBusy(false);
    }
  }, [convNum, convValido]);

  useEffect(() => {
    if (convValido) void loadTabelas();
  }, [convValido, loadTabelas]);

  const loadFaixasTabela = useCallback(async (tableId: number) => {
    setFaixasBusy(true);
    try {
      const bands = await safraListarFaixasTabela(tableId);
      setFaixasTabela(bands);
      setPrazosSelecionados(new Set(prazosFromBands(bands)));
    } catch {
      setFaixasTabela([]);
      setPrazosSelecionados(new Set());
    } finally {
      setFaixasBusy(false);
    }
  }, []);

  useEffect(() => {
    const tableId = Number.parseInt(idTabelaJuros.trim(), 10);
    if (Number.isFinite(tableId) && tableId > 0) {
      void loadFaixasTabela(tableId);
    } else {
      setFaixasTabela([]);
      setPrazosSelecionados(new Set());
    }
  }, [idTabelaJuros, loadFaixasTabela]);

  const togglePrazo = (prazo: number) => {
    setPrazosSelecionados((prev) => {
      const next = new Set(prev);
      if (next.has(prazo)) next.delete(prazo);
      else next.add(prazo);
      return next;
    });
  };

  const carregarSituacoesPorRegime = useCallback(
    async (regimeId: number, preferSituacaoId?: number) => {
      if (!convValido) return;
      setCatalogBusy(true);
      try {
        const list = await safraListarSituacoesEmpregado(convNum, regimeId);
        setSituacoes(list);
        const sitId =
          preferSituacaoId != null &&
          list.some((s) => s.id === preferSituacaoId)
            ? preferSituacaoId
            : list[0]?.id;
        setIdSituacaoEmpregado(sitId != null ? String(sitId) : "");
      } catch {
        setSituacoes([]);
        setIdSituacaoEmpregado("");
      } finally {
        setCatalogBusy(false);
      }
    },
    [convNum, convValido]
  );

  const loadCatalogosSimulacao = useCallback(async () => {
    if (!convValido) return;
    setCatalogBusy(true);
    const stored = getStoredSafraOcupacaoSelection();
    try {
      const regimesList = await safraListarRegimesJuridicos(convNum);
      setRegimes(regimesList);
      const regimeId =
        stored?.idRegimeJuridico != null &&
        regimesList.some((r) => r.id === stored.idRegimeJuridico)
          ? stored.idRegimeJuridico
          : regimesList[0]?.id;
      if (regimeId != null) {
        setIdRegimeJuridico(String(regimeId));
        await carregarSituacoesPorRegime(regimeId, stored?.idSituacaoEmpregado);
      } else {
        setSituacoes([]);
        setIdSituacaoEmpregado("");
      }
      setStoredSafraOcupacaoSelection({
        convenioId: convNum,
        ...(stored?.idOrgaoEmpregador != null
          ? { idOrgaoEmpregador: stored.idOrgaoEmpregador }
          : {}),
        ...(regimeId != null ? { idRegimeJuridico: regimeId } : {}),
        ...(stored?.idSituacaoEmpregado != null
          ? { idSituacaoEmpregado: stored.idSituacaoEmpregado }
          : {}),
      });
    } catch {
      setRegimes([]);
      setSituacoes([]);
    } finally {
      setCatalogBusy(false);
    }
  }, [convNum, convValido, carregarSituacoesPorRegime]);

  useEffect(() => {
    if (convValido) void loadCatalogosSimulacao();
  }, [convValido, loadCatalogosSimulacao]);

  const carregarCatalogosOcupacao = useCallback(async () => {
    if (!convValido) return;
    try {
      const [orgaos, regimes] = await Promise.all([
        safraListarOrgaosEmpregadores(convNum),
        safraListarRegimesJuridicos(convNum),
      ]);
      const orgaoId = orgaos[0]?.id;
      let situacaoId: number | undefined;
      const regimeId = regimes[0]?.id;
      if (regimeId != null) {
        const situacoes = await safraListarSituacoesEmpregado(
          convNum,
          regimeId
        );
        situacaoId = situacoes[0]?.id;
      }
      setStoredSafraOcupacaoSelection({
        convenioId: convNum,
        ...(orgaoId != null ? { idOrgaoEmpregador: orgaoId } : {}),
        ...(regimeId != null ? { idRegimeJuridico: regimeId } : {}),
        ...(situacaoId != null ? { idSituacaoEmpregado: situacaoId } : {}),
      });
      if (regimeId != null) {
        setIdRegimeJuridico(String(regimeId));
        if (situacaoId != null) setIdSituacaoEmpregado(String(situacaoId));
      }
    } catch {
      /* catálogos opcionais — proposta pode preencher manualmente */
    }
  }, [convNum, convValido]);

  const aplicarDemo = () => {
    setConvenioId(String(SAFRA_DEMO_MARGIN_BPO.convenio));
    setCpfMasked(formatCpfDigits(String(SAFRA_DEMO_MARGIN_BPO.cpf)));
    setIdProduto(String(SAFRA_DEMO_MARGIN_BPO.idProduto));
    setMatricula(SAFRA_DEMO_MARGIN_BPO.matricula);
    setDtNascimento(SAFRA_DEMO_CLIENTE.dataNascimento);
    setIdSexo(SAFRA_DEMO_CLIENTE.idSexo);
    setIdSituacaoEmpregado(String(SAFRA_DEMO_CLIENTE.idSituacaoEmpregado));
    setIdSituacaoManual("");
    Toastify("Dados de demonstração preenchidos.", {
      type: "info",
      position: "top-right",
    });
  };

  const consultarMargem = async () => {
    const prod = Number.parseInt(idProduto.trim(), 10);
    if (!convValido) {
      Toastify("Selecione um convênio.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (!cpfValido) {
      Toastify("CPF deve ter 11 dígitos.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (!matricula.trim()) {
      Toastify("Informe a matrícula.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (
      !Number.isFinite(prod) ||
      !SAFRA_ID_PRODUTO_OPCOES.some((o) => o.value === prod)
    ) {
      Toastify("Selecione o tipo de operação.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }

    const body: MargemBpoRequestBody = {
      convenio: convNum,
      cpf: cpfDigits,
      idProduto: prod,
      matricula: matricula.trim(),
    };

    setMarginBusy(true);
    setMarginErr(null);
    setFarolResult(null);
    setSimResult(null);
    setSimSelecionada(null);
    try {
      const data = await safraConsultarMargemBpo(body);
      setMarginResult(data);
      if (
        data.margem != null &&
        Number.isFinite(data.margem) &&
        !valorParcelaSim.trim()
      ) {
        setValorParcelaSim(String(data.margem));
      }
      if (data.renda != null && Number.isFinite(data.renda)) {
        setValorRendaSim(String(data.renda));
      }
      if (data.dataAdmissao?.trim()) {
        setDataAdmissaoSim(toSafraDateOnly(data.dataAdmissao) ?? data.dataAdmissao);
      }
      if (data.uf?.trim()) {
        setIdUfSim(data.uf.trim().toUpperCase().slice(0, 2));
      }
      setStoredSafraMarginBpoRequest(body);
      setStoredSafraMarginBpoResponse(data);
      patchStoredSafraVendedorSnapshot({
        convenioId: convNum,
        cpf: cpfDigits,
        matricula: matricula.trim(),
        idProduto: prod,
        simulacaoSelecionada: undefined,
        idProposta: undefined,
      });
      setIdProposta(null);
      void carregarCatalogosOcupacao();
      void loadCatalogosSimulacao();
      Toastify("Margem consultada.", {
        type: "success",
        position: "top-right",
      });
    } catch (e) {
      setMarginResult(null);
      setMarginErr(
        isAxiosError(e) ? getApiErrorMessage(e) : "Erro na consulta de margem."
      );
    } finally {
      setMarginBusy(false);
    }
  };

  const consultarFarol = async () => {
    const prod = Number.parseInt(idProduto.trim(), 10);
    if (!convValido || !cpfValido) {
      Toastify("Complete convênio e CPF antes do farol.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (!Number.isFinite(prod) || prod <= 0) {
      Toastify("Tipo de produto inválido.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }

    setFarolBusy(true);
    setFarolErr(null);
    try {
      const data = await safraConsultarFarolCredito({
        idConvenio: convNum,
        idTipoProduto: prod,
        cpf: cpfDigitsToNumber(cpfDigits),
      });
      setFarolResult(data);
      if (farolAprovado(data)) {
        Toastify("Farol aprovado — pode simular.", {
          type: "success",
          position: "top-right",
        });
      } else {
        Toastify("Farol sem aprovação. Revise os motivos antes de continuar.", {
          type: "warning",
          position: "top-right",
          autoClose: 6000,
        });
      }
    } catch (e) {
      setFarolResult(null);
      setFarolErr(
        isAxiosError(e) ? getApiErrorMessage(e) : "Erro no farol de crédito."
      );
    } finally {
      setFarolBusy(false);
    }
  };

  const simular = async () => {
    if (!convValido || !cpfValido) {
      Toastify("Convênio e CPF são obrigatórios.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (!farolResult) {
      Toastify("Execute o farol de crédito antes da simulação.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (!farolOk) {
      Toastify("Farol não aprovado. Simulação bloqueada.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }

    const tabela = Number.parseInt(idTabelaJuros.trim(), 10);
    const situacaoRaw =
      idSituacaoManual.trim() ||
      idSituacaoEmpregado.trim() ||
      (convNum === SAFRA_DEMO_MARGIN_BPO.convenio
        ? String(SAFRA_DEMO_CLIENTE.idSituacaoEmpregado)
        : "");
    const situacao = Number.parseInt(situacaoRaw, 10);
    const sexoStr = idSexo.trim().toUpperCase();
    const nascDate = toSafraDateOnly(dtNascimento);

    if (!nascDate) {
      Toastify("Informe a data de nascimento (formato YYYY-MM-DD).", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (!sexoStr || !SAFRA_ID_SEXO_OPCOES.some((o) => o.value === sexoStr)) {
      Toastify("Selecione o sexo: M (masculino) ou F (feminino).", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (!Number.isFinite(situacao) || situacao <= 0) {
      Toastify(
        "Selecione ou digite a situação do empregado (ex.: 1 para homologação).",
        { type: "warning", position: "top-right" }
      );
      return;
    }
    if (!Number.isFinite(tabela) || tabela <= 0) {
      Toastify("Selecione a tabela de juros antes de simular.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (!matricula.trim()) {
      Toastify("Informe a matrícula no passo 1.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }

    let prazos = [...prazosSelecionados]
      .filter((p) => Number.isFinite(p) && p > 0)
      .sort((a, b) => a - b);
    if (prazos.length === 0) {
      if (convNum === SAFRA_DEMO_MARGIN_BPO.convenio) {
        prazos = [...SAFRA_DEMO_PRAZOS];
      } else {
        Toastify("Marque pelo menos um prazo da tabela de juros.", {
          type: "warning",
          position: "top-right",
        });
        return;
      }
    }

    let valorParcela: number | undefined = parseOptionalFloat(valorParcelaSim);
    if (valorParcela == null) {
      if (
        marginResult?.margem != null &&
        Number.isFinite(marginResult.margem)
      ) {
        valorParcela = marginResult.margem;
      }
    }

    const valorPrincipal = parseOptionalFloat(valorPrincipalSim);
    const valorRenda =
      parseOptionalFloat(valorRendaSim) ??
      (marginResult?.renda != null && Number.isFinite(marginResult.renda)
        ? marginResult.renda
        : undefined);
    const valorDescontos = parseOptionalFloat(valorDescontosSim);
    const idCorban = parseOptionalInt(idCorbanSim);
    const idCorbansubs = parseOptionalInt(idCorbansubsSim);
    const idComercial = parseOptionalInt(idComercialSim);
    const idSeguro = comSeguro ? parseOptionalInt(idSeguroSim) : undefined;
    const idServicos = [
      parseOptionalInt(idServico1Sim),
      parseOptionalInt(idServico2Sim),
    ].filter((id): id is number => id != null && id > 0);
    const taxaJuros = parseOptionalFloat(taxaJurosSim);
    const tarifaCadastro = parseOptionalFloat(tarifaCadastroSim);
    const comissao = parseOptionalFloat(comissaoSim);

    const body = buildSafraCalculationNewBody({
      idConvenio: convNum,
      cpf: cpfDigitsToNumber(cpfDigits),
      matricula: matricula.trim(),
      comSeguro,
      isCotacao,
      idTabelaJuros: tabela,
      dtNascimento: nascDate,
      idSexo: sexoStr,
      idSituacaoEmpregado: situacao,
      prazos,
      ...(valorParcela != null ? { valorParcela } : {}),
      ...(valorPrincipal != null ? { valorPrincipal } : {}),
      ...(valorRenda != null ? { valorRenda } : {}),
      ...(valorDescontos != null ? { valorDescontos } : {}),
      ...(idCorban != null ? { idCorban } : {}),
      ...(idCorbansubs != null ? { idCorbansubs } : {}),
      ...(idComercial != null ? { idComercial } : {}),
      ...(idSeguro != null ? { idSeguro } : {}),
      ...(idServicos.length > 0 ? { idServicos } : {}),
      ...(taxaJuros != null ? { taxaJuros } : {}),
      ...(tarifaCadastro != null ? { tarifaCadastro } : {}),
      ...(comissao != null ? { comissao } : {}),
      dataAdmissao:
        toSafraDateOnly(dataAdmissaoSim) ??
        marginResult?.dataAdmissao ??
        (convNum === SAFRA_DEMO_MARGIN_BPO.convenio
          ? SAFRA_DEMO_CLIENTE.dataAdmissao
          : undefined),
      idUF: idUfSim.trim() || marginResult?.uf,
    });

    setSimBusy(true);
    setSimErr(null);
    setSimSelecionada(null);
    try {
      const data = await safraSimularNovo(body);
      setSimResult(data);
      if (data.criticas.length > 0) {
        Toastify("Simulação com críticas — revise antes da proposta.", {
          type: "warning",
          position: "top-right",
          autoClose: 6000,
        });
      } else if (data.simulacoes.length > 0) {
        const primeira = data.simulacoes[0];
        setSimSelecionada(primeira);
        patchStoredSafraVendedorSnapshot({
          idTabelaJuros:
            Number.isFinite(tabela) && tabela > 0 ? tabela : undefined,
          simulacaoSelecionada: primeira,
        });
        Toastify(`${data.simulacoes.length} opção(ões) de simulação.`, {
          type: "success",
          position: "top-right",
        });
      } else {
        Toastify("Nenhuma simulação retornada.", {
          type: "info",
          position: "top-right",
        });
      }
    } catch (e) {
      setSimResult(null);
      setSimErr(isAxiosError(e) ? getApiErrorMessage(e) : "Erro na simulação.");
    } finally {
      setSimBusy(false);
    }
  };

  const selecionarSimulacao = (item: SafraSimulacaoItem) => {
    setSimSelecionada(item);
    const tabela = Number.parseInt(idTabelaJuros.trim(), 10);
    patchStoredSafraVendedorSnapshot({
      simulacaoSelecionada: item,
      ...(Number.isFinite(tabela) && tabela > 0
        ? { idTabelaJuros: tabela }
        : {}),
    });
  };

  const obterLinkFormalizacao = async () => {
    if (idProposta == null) {
      Toastify("Crie a proposta antes de buscar o link.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    setFormBusy(true);
    setFormErr(null);
    setFormUrls([]);
    setFormRaw(null);
    try {
      const data = await safraObterLinkFormalizacao({
        id_proposta: idProposta,
        ...(convValido ? { id_convenio: convNum } : {}),
      });
      setFormRaw(data);
      const urls = extrairUrlsFormalizacao(data);
      setFormUrls(urls);
      if (urls.length) {
        Toastify("Link de formalização obtido.", {
          type: "success",
          position: "top-right",
        });
      } else {
        Toastify("Resposta recebida — verifique os dados abaixo.", {
          type: "info",
          position: "top-right",
        });
      }
    } catch (e) {
      setFormErr(
        isAxiosError(e)
          ? getApiErrorMessage(e)
          : "Erro ao obter link de formalização."
      );
    } finally {
      setFormBusy(false);
    }
  };

  const propostaPrefill = useMemo((): SafraPropostaPrefill | null => {
    if (!simSelecionada || !convValido) return null;
    const tabela = Number.parseInt(idTabelaJuros.trim(), 10);
    const sexoOpt = SAFRA_ID_SEXO_OPCOES.find((o) => o.value === idSexo.trim());
    const regime = Number.parseInt(idRegimeJuridico.trim(), 10);
    const situacao = Number.parseInt(idSituacaoEmpregado.trim(), 10);
    return {
      idConvenio: convNum,
      ...(Number.isFinite(tabela) && tabela > 0
        ? { idTabelaJuros: tabela }
        : {}),
      valorParcela: simSelecionada.valorParcela,
      prazo: simSelecionada.prazo,
      valorPrincipal: simSelecionada.valorPrincipal,
      taxaJuros: simSelecionada.taxaJuros,
      cpfCliente: cpfDigits,
      nomeCompleto: marginResult?.nome ?? undefined,
      matricula: matricula.trim() || undefined,
      valorRenda: marginResult?.renda ?? undefined,
      dataAdmissao: marginResult?.dataAdmissao ?? undefined,
      dataNascimento: dtNascimento.trim() || undefined,
      sexo: sexoOpt?.value,
      ...(Number.isFinite(regime) && regime > 0
        ? { idRegimeJuridico: regime }
        : {}),
      ...(Number.isFinite(situacao) && situacao > 0
        ? { idSituacaoEmpregado: situacao }
        : {}),
    };
  }, [
    simSelecionada,
    convValido,
    convNum,
    idTabelaJuros,
    cpfDigits,
    marginResult,
    matricula,
    dtNascimento,
    idSexo,
    idRegimeJuridico,
    idSituacaoEmpregado,
  ]);

  const curPt = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    []
  );

  return (
    <div className="mt-8 flex flex-col gap-10">
      {/* Passo 1 — Cliente e margem */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
        <h2 className="text-lg font-semibold text-slate-900">
          1. Cliente e margem
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Selecione o convênio, informe CPF e matrícula e consulte a margem
          disponível. Os dados seguem para farol, simulação e proposta.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={aplicarDemo}>
            Preencher demo (homologação)
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => void loadConvenios()}
            disabled={conveniosBusy}
            className="gap-2"
          >
            <HiArrowPath
              className={`h-4 w-4 ${conveniosBusy ? "animate-spin" : ""}`}
              aria-hidden
            />
            Atualizar convênios
          </Button>
        </div>
        {conveniosErr ? (
          <div
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {conveniosErr}
          </div>
        ) : null}
        <p className="mt-4 text-xs text-slate-500">
          {conveniosBusy
            ? "A carregar convênios…"
            : `${convenios.length} convênio(s) da API · ${conveniosExibidos.length} visível(is) com o filtro atual`}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Buscar convênio"
            value={convenioBusca}
            onChange={(e) => setConvenioBusca(e.target.value)}
            placeholder="Nome, UF ou código (ex.: 10237)"
          />
          <Input
            label="Código do convênio (idConvenio)"
            value={convenioId}
            inputMode="numeric"
            onChange={(e) => setConvenioId(e.target.value.replace(/\D/g, ""))}
            placeholder="ex.: 10237"
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Select
            label={`Lista de convênios${conveniosBusy ? " — a carregar…" : ""}`}
            value={
              conveniosExibidos.some((c) => c.idConvenio === convNum)
                ? convenioId
                : ""
            }
            onChange={(e) => {
              const v = e.target.value;
              if (v) setConvenioId(v);
            }}
          >
            <option value="">
              {conveniosExibidos.length === 0
                ? "Nenhum resultado — digite o código acima"
                : "Selecione na lista…"}
            </option>
            {conveniosExibidos.map((c) => (
              <option key={c.idConvenio} value={String(c.idConvenio)}>
                {c.idConvenio} — {c.nomeFantasia || c.nome} ({c.uf})
              </option>
            ))}
          </Select>
          <Select
            label="Tipo de operação"
            value={idProduto}
            onChange={(e) => setIdProduto(e.target.value)}
          >
            {SAFRA_ID_PRODUTO_OPCOES.map((o) => (
              <option key={o.value} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </Select>
          <Input
            label="CPF do cliente"
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
        {convValido ? (
          <p className="mt-3 text-sm text-slate-700">
            Convênio ativo:{" "}
            <span className="font-mono font-semibold">{convNum}</span>
            {convenioSelecionado
              ? ` — ${convenioSelecionado.nomeFantasia || convenioSelecionado.nome}`
              : " (código manual — não consta na lista carregada)"}
          </p>
        ) : null}
        <div className="mt-4">
          <Button
            type="button"
            variant="primary"
            disabled={marginBusy}
            className="gap-2"
            onClick={() => void consultarMargem()}
          >
            <HiPlay className="h-4 w-4" aria-hidden />
            Consultar margem
          </Button>
        </div>
        {marginErr ? (
          <div
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {marginErr}
          </div>
        ) : null}
        {marginResult ? <MargemResumo data={marginResult} /> : null}
      </section>

      {/* Passo 2 — Farol */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
        <h2 className="text-lg font-semibold text-slate-900">
          2. Farol de crédito
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Análise prévia obrigatória antes da simulação. Usa convênio, CPF e
          tipo de operação do passo 1.
        </p>
        <div className="mt-4">
          <Button
            type="button"
            variant="primary"
            disabled={farolBusy || !convValido || !cpfValido}
            className="gap-2"
            onClick={() => void consultarFarol()}
          >
            <HiPlay className="h-4 w-4" aria-hidden />
            Consultar farol
          </Button>
        </div>
        {farolErr ? (
          <div
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {farolErr}
          </div>
        ) : null}
        {farolResult && farolResult.length > 0 ? (
          <div className="mt-4 space-y-3">
            {farolResult.map((row, i) => {
              const ok =
                row.decisaoFarol === 1 ||
                (Array.isArray(row.motivos) &&
                  row.motivos.some((m) => /APROVADO/i.test(m)));
              return (
                <div
                  key={`${row.cpf}-${i}`}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
                    ok
                      ? "border-emerald-200 bg-emerald-50/80"
                      : "border-red-200 bg-red-50/80"
                  }`}
                >
                  {ok ? (
                    <HiCheckCircle
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                      aria-hidden
                    />
                  ) : (
                    <HiXCircle
                      className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                      aria-hidden
                    />
                  )}
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold text-slate-900">
                      {ok ? "Aprovado" : "Não aprovado"}
                    </p>
                    <p className="mt-1 text-slate-700">
                      Decisão:{" "}
                      <span className="font-mono">{row.decisaoFarol}</span>
                      {Array.isArray(row.motivos) && row.motivos.length > 0
                        ? ` · ${row.motivos.join(" · ")}`
                        : null}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </section>

      {/* Passo 3 — Simulação */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
        <h2 className="text-lg font-semibold text-slate-900">
          3. Simulação (consignado novo)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Escolha a tabela de juros e simule. Para convênios como{" "}
          <span className="font-mono text-xs">10237</span>, data de nascimento,
          sexo e situação do empregado são obrigatórios. O sexo deve ser{" "}
          <span className="font-mono text-xs">M</span> ou{" "}
          <span className="font-mono text-xs">F</span> (não use 1 ou 2).
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Data de nascimento"
            type="date"
            value={dtNascimento}
            onChange={(e) => setDtNascimento(e.target.value)}
          />
          <Select
            label="Sexo (idSexo — M ou F)"
            value={idSexo}
            onChange={(e) => setIdSexo(e.target.value.toUpperCase())}
          >
            <option value="">Selecione…</option>
            {SAFRA_ID_SEXO_OPCOES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.value} — {o.label}
              </option>
            ))}
          </Select>
          <Input
            label="Data admissão (dataAdmissao)"
            type="date"
            value={dataAdmissaoSim}
            onChange={(e) => setDataAdmissaoSim(e.target.value)}
          />
          <Input
            label="UF (idUF)"
            value={idUfSim}
            maxLength={2}
            placeholder="SP"
            onChange={(e) =>
              setIdUfSim(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())
            }
          />
          <Input
            label="Valor renda (valorRenda)"
            value={valorRendaSim}
            inputMode="decimal"
            onChange={(e) => setValorRendaSim(e.target.value)}
            placeholder="Da margem"
          />
          <Input
            label="Valor descontos (valorDescontos)"
            value={valorDescontosSim}
            inputMode="decimal"
            onChange={(e) => setValorDescontosSim(e.target.value)}
          />
          <Select
            label={`Regime jurídico${catalogBusy ? " — a carregar…" : ""}`}
            value={idRegimeJuridico}
            disabled={regimes.length === 0 || catalogBusy}
            onChange={(e) => {
              const v = e.target.value;
              setIdRegimeJuridico(v);
              const rid = Number.parseInt(v, 10);
              if (Number.isFinite(rid) && rid > 0) {
                void carregarSituacoesPorRegime(rid);
              } else {
                setSituacoes([]);
                setIdSituacaoEmpregado("");
              }
            }}
          >
            <option value="">
              {regimes.length === 0
                ? "Carregue o convênio no passo 1"
                : "Selecione…"}
            </option>
            {regimes.map((r) => (
              <option key={r.id} value={String(r.id)}>
                {r.id} — {r.descricao}
              </option>
            ))}
          </Select>
          <Select
            label={`Situação do empregado (idSituacaoEmpregado)${catalogBusy ? " — a carregar…" : ""}`}
            value={idSituacaoEmpregado}
            disabled={situacoes.length === 0 || catalogBusy}
            onChange={(e) => {
              setIdSituacaoEmpregado(e.target.value);
              setIdSituacaoManual("");
              const sit = Number.parseInt(e.target.value, 10);
              const regime = Number.parseInt(idRegimeJuridico.trim(), 10);
              if (Number.isFinite(sit) && sit > 0) {
                setStoredSafraOcupacaoSelection({
                  convenioId: convNum,
                  ...(Number.isFinite(regime) && regime > 0
                    ? { idRegimeJuridico: regime }
                    : {}),
                  idSituacaoEmpregado: sit,
                });
              }
            }}
          >
            <option value="">
              {situacoes.length === 0
                ? "Selecione um regime jurídico"
                : "Selecione…"}
            </option>
            {situacoes.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.id} — {s.descricao}
              </option>
            ))}
          </Select>
          <Input
            label="Ou código situação (manual)"
            value={idSituacaoManual}
            inputMode="numeric"
            placeholder="Se a lista estiver vazia"
            onChange={(e) => {
              setIdSituacaoManual(e.target.value.replace(/\D/g, ""));
              if (e.target.value.trim()) setIdSituacaoEmpregado("");
            }}
          />
          <Select
            label={`Tabela de juros${tabelasBusy ? " — a carregar…" : ""}`}
            value={idTabelaJuros}
            disabled={!convValido || tabelas.length === 0}
            onChange={(e) => setIdTabelaJuros(e.target.value)}
          >
            <option value="">
              {tabelas.length === 0
                ? "Carregue convênio no passo 1"
                : "Selecione…"}
            </option>
            {tabelas.map((t) => (
              <option key={t.id} value={String(t.id)}>
                {t.id} — {t.descricao}
              </option>
            ))}
          </Select>
          <div className="col-span-full">
            <p className="text-sm font-semibold text-slate-800">
              Prazos (prazos)
              {faixasBusy ? " — a carregar faixas…" : ""}
            </p>
            {faixasTabela.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-4">
                {faixasTabela.map((band, index) => {
                  const prazo = prazoDaFaixa(band);
                  if (prazo == null) return null;
                  return (
                    <label
                      key={band.idFaixa ?? `faixa-${index}`}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/40"
                        checked={prazosSelecionados.has(prazo)}
                        onChange={() => togglePrazo(prazo)}
                      />
                      {formatFaixaPrazoLabel(band)}
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="mt-1 text-sm text-slate-500">
                {faixasBusy
                  ? "Carregando faixas da tabela…"
                  : "Selecione a tabela de juros para listar os prazos."}
              </p>
            )}
            {prazosSelecionados.size > 0 ? (
              <p className="mt-2 text-xs text-slate-500">
                Body: prazos = [
                {[...prazosSelecionados].sort((a, b) => a - b).join(", ")}]
              </p>
            ) : null}
          </div>
          <Input
            label="Valor parcela (valorParcela)"
            value={valorParcelaSim}
            inputMode="decimal"
            onChange={(e) => setValorParcelaSim(e.target.value)}
            placeholder="Preenchido pela margem"
          />
          <Input
            label="Valor principal (valorPrincipal)"
            value={valorPrincipalSim}
            inputMode="decimal"
            onChange={(e) => setValorPrincipalSim(e.target.value)}
            placeholder="Opcional"
          />
          <Input
            label="idCorban"
            value={idCorbanSim}
            inputMode="numeric"
            onChange={(e) =>
              setIdCorbanSim(e.target.value.replace(/\D/g, ""))
            }
          />
          <Input
            label="idCorbansubs"
            value={idCorbansubsSim}
            inputMode="numeric"
            onChange={(e) =>
              setIdCorbansubsSim(e.target.value.replace(/\D/g, ""))
            }
          />
          <Input
            label="idComercial"
            value={idComercialSim}
            inputMode="numeric"
            onChange={(e) =>
              setIdComercialSim(e.target.value.replace(/\D/g, ""))
            }
          />
          <Input
            label="idServicos — serviço 1"
            value={idServico1Sim}
            inputMode="numeric"
            onChange={(e) =>
              setIdServico1Sim(e.target.value.replace(/\D/g, ""))
            }
          />
          <Input
            label="idServicos — serviço 2"
            value={idServico2Sim}
            inputMode="numeric"
            onChange={(e) =>
              setIdServico2Sim(e.target.value.replace(/\D/g, ""))
            }
          />
          {comSeguro ? (
            <Input
              label="idSeguro"
              value={idSeguroSim}
              inputMode="numeric"
              onChange={(e) =>
                setIdSeguroSim(e.target.value.replace(/\D/g, ""))
              }
            />
          ) : null}
          <Input
            label="taxaJuros (opcional)"
            value={taxaJurosSim}
            inputMode="decimal"
            onChange={(e) => setTaxaJurosSim(e.target.value)}
          />
          <Input
            label="tarifaCadastro (opcional)"
            value={tarifaCadastroSim}
            inputMode="decimal"
            onChange={(e) => setTarifaCadastroSim(e.target.value)}
          />
          <Input
            label="comissao (opcional)"
            value={comissaoSim}
            inputMode="decimal"
            onChange={(e) => setComissaoSim(e.target.value)}
          />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/40"
            checked={comSeguro}
            onChange={(e) => setComSeguro(e.target.checked)}
          />
          Incluir seguro
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/40"
            checked={isCotacao}
            onChange={(e) => setIsCotacao(e.target.checked)}
          />
          É cotação (isCotacao)
        </label>
        <div className="mt-4">
          <Button
            type="button"
            variant="primary"
            disabled={simBusy || !farolOk}
            className="gap-2"
            onClick={() => void simular()}
          >
            <HiPlay className="h-4 w-4" aria-hidden />
            Simular
          </Button>
          {!farolOk && farolResult ? (
            <p className="mt-2 text-xs text-amber-800">
              Farol sem aprovação — simulação bloqueada.
            </p>
          ) : null}
        </div>
        {simErr ? (
          <div
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {simErr}
          </div>
        ) : null}
        {simResult?.criticas?.length ? (
          <div
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
            role="alert"
          >
            <p className="font-semibold">Críticas</p>
            <p className="mt-1 text-xs text-red-800">
              Se a mensagem citar parâmetros obrigatórios, preencha data de
              nascimento, sexo e situação do empregado acima e simule de novo.
            </p>
            <ul className="mt-2 list-inside list-disc">
              {simResult.criticas.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {simResult?.avisos?.length ? (
          <div
            className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
            role="status"
          >
            <p className="font-semibold">Avisos</p>
            <ul className="mt-1 list-inside list-disc">
              {simResult.avisos.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {simResult && simResult.simulacoes.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200/90">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90">
                  <th className="px-4 py-2.5 font-semibold text-slate-700">
                    Prazo
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-slate-700">
                    Parcela (R$)
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-slate-700">
                    Principal (R$)
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-slate-700">
                    Taxa (%)
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-slate-700" />
                </tr>
              </thead>
              <tbody>
                {simResult.simulacoes.map((row, idx) => {
                  const sel =
                    simSelecionada?.prazo === row.prazo &&
                    simSelecionada?.valorParcela === row.valorParcela;
                  return (
                    <tr
                      key={`${row.prazo}-${row.valorParcela}-${idx}`}
                      className={`border-b border-slate-100 last:border-0 ${
                        sel ? "bg-emerald-50/70" : "hover:bg-emerald-50/30"
                      }`}
                    >
                      <td className="px-4 py-2 font-mono text-xs">
                        {row.prazo} meses
                      </td>
                      <td className="px-4 py-2">
                        {curPt.format(row.valorParcela)}
                      </td>
                      <td className="px-4 py-2">
                        {curPt.format(row.valorPrincipal)}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs">
                        {row.taxaJuros}
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          type="button"
                          variant={sel ? "primary" : "secondary"}
                          className="!min-h-8 text-xs"
                          onClick={() => selecionarSimulacao(row)}
                        >
                          {sel ? "Selecionada" : "Usar esta"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
        {simSelecionada ? (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-950">
            Simulação selecionada: {simSelecionada.prazo} meses · parcela{" "}
            {curPt.format(simSelecionada.valorParcela)} · principal{" "}
            {curPt.format(simSelecionada.valorPrincipal)}
          </p>
        ) : null}
        {temCriticas ? (
          <p className="mt-2 text-xs text-red-700">
            Há críticas na simulação — resolva antes de enviar a proposta.
          </p>
        ) : null}
      </section>

      {/* Passo 4 — Proposta */}
      <SafraPropostaCard
        prefill={propostaPrefill}
        disabled={!simSelecionada || temCriticas}
        disabledHint={
          !simSelecionada
            ? "Selecione uma linha da simulação no passo 3."
            : "Resolva as críticas da simulação antes de enviar."
        }
        onPropostaCriada={(id) => {
          setIdProposta(id);
          patchStoredSafraVendedorSnapshot({ idProposta: id });
        }}
      />

      {/* Passo 5 — Formalização */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
        <h2 className="text-lg font-semibold text-slate-900">
          5. Formalização digital
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Após criar a proposta, obtenha o link para o cliente formalizar o
          contrato.
        </p>
        {idProposta != null ? (
          <p className="mt-3 text-sm text-slate-700">
            Proposta Safra:{" "}
            <span className="font-mono font-semibold">{idProposta}</span>
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Ainda não há proposta criada nesta sessão.
          </p>
        )}
        <div className="mt-4">
          <Button
            type="button"
            variant="primary"
            disabled={formBusy || idProposta == null}
            className="gap-2"
            onClick={() => void obterLinkFormalizacao()}
          >
            <HiPlay className="h-4 w-4" aria-hidden />
            Obter link de formalização
          </Button>
        </div>
        {formErr ? (
          <div
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {formErr}
          </div>
        ) : null}
        {formUrls.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {formUrls.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-emerald-700 underline hover:text-emerald-900"
                >
                  Abrir formalização para o cliente
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        {formRaw && formUrls.length === 0 ? (
          <pre className="mt-4 max-h-48 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800">
            {JSON.stringify(formRaw, null, 2)}
          </pre>
        ) : null}
      </section>
    </div>
  );
}
