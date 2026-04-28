import { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiArrowPath, HiPlay } from "react-icons/hi2";

import { Button, Input, Select } from "../../components/ui";
import {
  getStoredLastSimRequestMargem,
  getStoredLastSimulacaoMargem,
  setStoredDaycovalLoginUsuario,
  setStoredLastSimRequestMargem,
  setStoredLastSimulacaoMargem,
} from "../../config/daycoval";
import {
  margemIncluirProposta,
  margemIncluirSimulacoes,
  margemListarEmpregadores,
  margemSimularProposta,
  margemStatusPropostaDetalhado,
} from "../../service/daycoval-margem";
import type {
  MargemIncluirSimulacoesBody,
  MargemSimulacaoRequestBody,
} from "../../types/daycoval-margem";
import { getApiErrorMessage } from "../../utils/api-error";
import {
  extrairOfertasSimulacaoParaUI,
  parseListaEmpregadoresDaycoval,
} from "../../utils/daycoval-margem-flow";
import { Toastify } from "../../utils/toastify";
import DaycovalDominiosCard from "./DaycovalDominiosCard";

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function readPrefillFromStoredSimReq(): {
  cpf: string;
  matricula: string;
} {
  const req = getStoredLastSimRequestMargem();
  if (!req || typeof req !== "object") return { cpf: "", matricula: "" };
  const o = req as Record<string, unknown>;
  const cpf = typeof o.Cpf === "string" ? o.Cpf : String(o.Cpf ?? "");
  const matricula =
    typeof o.Matricula === "string" ? o.Matricula : String(o.Matricula ?? "");
  return { cpf, matricula };
}

type CredenciaisCardProps = {
  initialLogin: string;
  onPersisted: () => void;
};

function CredenciaisCard({ initialLogin, onPersisted }: CredenciaisCardProps) {
  const [login, setLogin] = useState(initialLogin);

  useEffect(() => {
    setLogin(initialLogin);
  }, [initialLogin]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        1. Acesso à integração
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Introduza a credencial indicada pela instituição e guarde antes de
        continuar. O valor não é mostrado de novo na página após gravar —
        permanece apenas na sessão atual do browser.
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Input
            label="Identificação institucional"
            value={login}
            autoComplete="off"
            type="password"
            autoCapitalize="off"
            spellCheck={false}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Introdução confidencial"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setStoredDaycovalLoginUsuario(login);
            Toastify("Credencial guardada neste dispositivo (sessão).", {
              type: "success",
              position: "top-right",
            });
            onPersisted();
          }}
          className="shrink-0"
        >
          Guardar
        </Button>
      </div>
    </section>
  );
}

function AuxiliaresCard({ loginUsuario }: { loginUsuario: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<{ cod: number; label: string }[]>([]);

  const load = useCallback(async () => {
    if (!loginUsuario.trim()) {
      setRows([]);
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const data = await margemListarEmpregadores(loginUsuario);
      const list = parseListaEmpregadoresDaycoval(data);
      setRows(list);
      if (list.length === 0) {
        Toastify(
          "Resposta OK, mas a lista não foi mapeada automaticamente ao formato esperado.",
          { type: "info", position: "top-right", autoClose: 4500 }
        );
      }
    } catch (e) {
      setRows([]);
      setErr(
        isAxiosError(e) ? getApiErrorMessage(e) : "Erro ao listar empregadores."
      );
    } finally {
      setBusy(false);
    }
  }, [loginUsuario]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        3. Empregadores disponíveis
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Lista de empregadores para escolha ao associar uma proposta. Use o mesmo
        código interno quando indicado no passo 5.
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
          Atualizar lista
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
          <table className="w-full min-w-[320px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90">
                <th className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">
                  Código
                </th>
                <th className="min-w-[12rem] px-4 py-2.5 font-semibold text-slate-700">
                  Nome
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.cod}
                  className="border-b border-slate-100 last:border-0 hover:bg-blue-50/30"
                >
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-800">
                    {r.cod}
                  </td>
                  <td className="px-4 py-2 text-slate-700">{r.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !busy && !err ? (
        <p className="mt-4 text-sm text-slate-500">
          Configure e guarde a credencial no passo 1 para carregar a lista.
        </p>
      ) : null}
    </section>
  );
}

function SimulacaoCard({ loginUsuario }: { loginUsuario: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [cpf, setCpf] = useState("");
  const [matricula, setMatricula] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [codEmpExt, setCodEmpExt] = useState("");
  const [codOrgaoExt, setCodOrgaoExt] = useState("");
  const [vlrParcela, setVlrParcela] = useState("");
  const [qtdParcela, setQtdParcela] = useState("12");
  const [tipoOperacao, setTipoOperacao] = useState("1");
  const [codConvenio, setCodConvenio] = useState("");

  const payloadPreview = useMemo((): MargemSimulacaoRequestBody | null => {
    const d = dataNasc.trim();
    const cpfOk = onlyDigits(cpf);
    if (!d || cpfOk.length < 11) return null;
    const q = Number.parseInt(qtdParcela, 10);
    if (!Number.isFinite(q) || q <= 0) return null;
    const vpRaw = vlrParcela.trim().replace(",", ".");
    const vp = vpRaw ? Number.parseFloat(vpRaw) : undefined;
    return {
      Cpf: cpfOk,
      Matricula: matricula.trim(),
      DataNascimento: new Date(`${d}T12:00:00`).toISOString(),
      Financiamento: {
        TipoOperacao: tipoOperacao.trim() || "1",
        QtdParcela: q,
        ...(codConvenio.trim() ? { CodConvenio: codConvenio.trim() } : {}),
        ...(vp !== undefined && Number.isFinite(vp) ? { VlrParcela: vp } : {}),
      },
      Origem: {
        CodEmpregadorExterno: codEmpExt.trim(),
        CodOrgaoExterno: codOrgaoExt.trim(),
      },
    };
  }, [
    codConvenio,
    codEmpExt,
    codOrgaoExt,
    cpf,
    dataNasc,
    matricula,
    qtdParcela,
    tipoOperacao,
    vlrParcela,
  ]);

  const run = useCallback(async () => {
    if (!loginUsuario.trim()) {
      Toastify("Guarde primeiro a credencial no passo 1.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    if (!payloadPreview) {
      Toastify(
        "Preencha CPF (11 dígitos), data de nascimento e parcelas com valores válidos.",
        { type: "warning", position: "top-right" }
      );
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const data = await margemSimularProposta(loginUsuario, payloadPreview);
      setStoredLastSimRequestMargem(payloadPreview);
      setStoredLastSimulacaoMargem(data);
      Toastify("Simulação concluída. Pode prosseguir para a inclusão.", {
        type: "success",
        position: "top-right",
      });
    } catch (e) {
      setErr(isAxiosError(e) ? getApiErrorMessage(e) : "Erro na simulação.");
    } finally {
      setBusy(false);
    }
  }, [loginUsuario, payloadPreview]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        4. Simular margem
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Informe os dados do cliente e da operação segundo o processo definido
        pela instituição.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input
          label="CPF"
          value={cpf}
          inputMode="numeric"
          maxLength={14}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="000.000.000-00"
        />
        <Input
          label="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
        />
        <Input
          label="Data de nascimento"
          type="date"
          value={dataNasc}
          onChange={(e) => setDataNasc(e.target.value)}
        />
        <Input
          label="CodEmpregadorExterno"
          value={codEmpExt}
          onChange={(e) => setCodEmpExt(e.target.value)}
        />
        <Input
          label="CodOrgaoExterno"
          value={codOrgaoExt}
          onChange={(e) => setCodOrgaoExt(e.target.value)}
        />
        <Input
          label="Valor da parcela (opcional)"
          value={vlrParcela}
          inputMode="decimal"
          onChange={(e) => setVlrParcela(e.target.value)}
          placeholder="ex: 150,50"
        />
        <Input
          label="Quantidade de parcelas"
          value={qtdParcela}
          inputMode="numeric"
          onChange={(e) => setQtdParcela(e.target.value)}
        />
        <Input
          label="TipoOperacao"
          value={tipoOperacao}
          onChange={(e) => setTipoOperacao(e.target.value)}
        />
        <Input
          label="CodConvenio (opcional)"
          value={codConvenio}
          onChange={(e) => setCodConvenio(e.target.value)}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="primary"
          onClick={() => void run()}
          disabled={busy}
          className="gap-2"
        >
          <HiPlay className="h-4 w-4" aria-hidden />
          Simular
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
    </section>
  );
}

function IncluirSimulacoesCard({ loginUsuario }: { loginUsuario: string }) {
  const [simRes, setSimRes] = useState<unknown | null>(() =>
    getStoredLastSimulacaoMargem()
  );
  const [cpf, setCpf] = useState(() => readPrefillFromStoredSimReq().cpf);
  const [matricula, setMatricula] = useState(
    () => readPrefillFromStoredSimReq().matricula
  );
  const [vlrRenda, setVlrRenda] = useState("");
  const [codEmpSel, setCodEmpSel] = useState("");
  const [codDadosBeneficio, setCodDadosBeneficio] = useState("0");
  const [listaEmp, setListaEmp] = useState<{ cod: number; label: string }[]>(
    []
  );
  const [empBusy, setEmpBusy] = useState(false);
  const [selOfertaIdx, setSelOfertaIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const ofertas = useMemo(
    () => extrairOfertasSimulacaoParaUI(simRes),
    [simRes]
  );

  const atualizarDaSimulacao = useCallback(() => {
    setSimRes(getStoredLastSimulacaoMargem());
    const p = readPrefillFromStoredSimReq();
    setCpf(p.cpf);
    setMatricula(p.matricula);
    setSelOfertaIdx(0);
  }, []);

  const loadEmp = useCallback(async () => {
    if (!loginUsuario.trim()) return;
    setEmpBusy(true);
    try {
      const data = await margemListarEmpregadores(loginUsuario);
      setListaEmp(parseListaEmpregadoresDaycoval(data));
    } catch {
      setListaEmp([]);
    } finally {
      setEmpBusy(false);
    }
  }, [loginUsuario]);

  useEffect(() => {
    void loadEmp();
  }, [loadEmp]);

  useEffect(() => {
    setSelOfertaIdx(0);
  }, [simRes]);

  const run = async () => {
    if (!loginUsuario.trim()) {
      Toastify("Guarde primeiro a credencial no passo 1.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    const codEmp = Number.parseInt(codEmpSel, 10);
    if (!Number.isFinite(codEmp) || codEmp <= 0) {
      Toastify("Selecione o empregador (código interno).", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    const vlrRnRaw = vlrRenda.trim().replace(",", ".");
    const vlrRn = Number.parseFloat(vlrRnRaw);
    if (!Number.isFinite(vlrRn) || vlrRn <= 0) {
      Toastify("Informe o valor líquido da renda maior que zero.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    const codBen = Number.parseInt(codDadosBeneficio, 10);
    const ofertaLinha = ofertas[selOfertaIdx]?.oferta;
    if (!ofertaLinha || Object.keys(ofertaLinha).length === 0) {
      Toastify(
        "Nenhuma linha de oferta identificável. Execute primeiro a simulação (passo 4) e atualize dados.",
        {
          type: "warning",
          position: "top-right",
          autoClose: 6000,
        }
      );
      return;
    }
    const cpfOk = onlyDigits(cpf);
    if (cpfOk.length !== 11) {
      Toastify("CPF com 11 dígitos.", {
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

    const body = [
      {
        CodEmpregador: codEmp,
        CodDadosBeneficio: Number.isFinite(codBen) ? codBen : 0,
        Matricula: matricula.trim(),
        Cpf: cpfOk,
        VlrRendaLiquida: vlrRn,
        PropostaConsignadoOferta: [ofertaLinha],
      },
    ] as MargemIncluirSimulacoesBody;

    setBusy(true);
    setErr(null);
    try {
      await margemIncluirSimulacoes(loginUsuario, body);
      Toastify("Inclusão de simulações enviada.", {
        type: "success",
        position: "top-right",
      });
    } catch (e) {
      setErr(
        isAxiosError(e) ? getApiErrorMessage(e) : "Erro ao incluir simulações."
      );
    } finally {
      setBusy(false);
    }
  };

  const temSimGuardada =
    simRes !== undefined && simRes !== null && simRes !== "";

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        5. Incluir simulações
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Montagem com base na última simulação (passo 4) e no empregador
        selecionado.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <Button
          type="button"
          variant="secondary"
          onClick={atualizarDaSimulacao}
          className="gap-2"
        >
          <HiArrowPath className="h-4 w-4 shrink-0" aria-hidden />
          Atualizar dados do passo 4
        </Button>
        <span className="text-xs text-slate-500">
          {temSimGuardada
            ? "Última simulação encontrada nesta sessão."
            : "Ainda não há simulação armazenada — rode o passo 4 primeiro."}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Select
          label={`Empregador (CodEmpregador)${empBusy ? " — a carregar…" : ""}`}
          value={codEmpSel}
          disabled={listaEmp.length === 0}
          onChange={(e) => setCodEmpSel(e.target.value)}
        >
          <option value="">Selecione…</option>
          {listaEmp.map((e) => (
            <option key={e.cod} value={String(e.cod)}>
              {e.label}
            </option>
          ))}
        </Select>
        <Input
          label="Código dados benefício"
          inputMode="numeric"
          value={codDadosBeneficio}
          onChange={(e) => setCodDadosBeneficio(e.target.value)}
          placeholder="0 se não aplicável"
        />
        <Input
          label="CPF"
          value={cpf}
          inputMode="numeric"
          maxLength={14}
          onChange={(e) => setCpf(e.target.value)}
        />
        <Input
          label="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
        />
        <Input
          label="Valor renda líquida (R$)"
          inputMode="decimal"
          value={vlrRenda}
          onChange={(e) => setVlrRenda(e.target.value)}
          placeholder="ex.: 3500"
        />
        <div className="sm:col-span-2">
          <Select
            label="Linha da oferta (da simulação)"
            value={ofertas.length > 0 ? String(selOfertaIdx) : ""}
            disabled={ofertas.length === 0}
            onChange={(e) => {
              const v = e.target.value;
              setSelOfertaIdx(v === "" ? 0 : Number.parseInt(v, 10));
            }}
          >
            {ofertas.length === 0 ? (
              <option value="">Nenhuma oferta encontrada na resposta</option>
            ) : (
              ofertas.map((o) => (
                <option key={o.idx} value={String(o.idx)}>
                  {o.label}
                </option>
              ))
            )}
          </Select>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          onClick={() => void run()}
          disabled={busy}
        >
          Enviar inclusão de simulações
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
    </section>
  );
}

function IncluirPropostaCard({ loginUsuario }: { loginUsuario: string }) {
  const [cod, setCod] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    if (!loginUsuario.trim()) {
      Toastify("Guarde primeiro a credencial no passo 1.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    const n = Number.parseInt(cod, 10);
    if (!Number.isFinite(n) || n <= 0) {
      Toastify("CodProposta inválido.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await margemIncluirProposta(loginUsuario, {
        CodProposta: n,
      });
      Toastify("Proposta incluída na esteira.", {
        type: "success",
        position: "top-right",
      });
    } catch (e) {
      setErr(
        isAxiosError(e) ? getApiErrorMessage(e) : "Erro ao incluir proposta."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        6. Incluir proposta
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Informe o código da proposta devolvido nos passos anteriores.
      </p>
      <div className="mt-4 max-w-sm">
        <Input
          label="CodProposta"
          value={cod}
          inputMode="numeric"
          onChange={(e) => setCod(e.target.value)}
        />
      </div>
      <Button
        type="button"
        variant="primary"
        className="mt-4"
        onClick={() => void run()}
        disabled={busy}
      >
        Incluir proposta
      </Button>
      {err ? (
        <div
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {err}
        </div>
      ) : null}
    </section>
  );
}

function StatusCard({ loginUsuario }: { loginUsuario: string }) {
  const [cod, setCod] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    if (!loginUsuario.trim()) {
      Toastify("Guarde primeiro a credencial no passo 1.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    const c = cod.trim();
    if (!c) {
      Toastify("Informe o código da proposta.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await margemStatusPropostaDetalhado(loginUsuario, c);
      Toastify("Consulta de estado concluída.", {
        type: "success",
        position: "top-right",
      });
    } catch (e) {
      setErr(
        isAxiosError(e) ? getApiErrorMessage(e) : "Erro ao consultar status."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        7. Status da proposta
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Consulte o estado atual da proposta com o mesmo código utilizado antes.
      </p>
      <div className="mt-4 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Input
            label="Código da proposta"
            value={cod}
            onChange={(e) => setCod(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => void run()}
          disabled={busy}
        >
          Consultar
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
    </section>
  );
}

type MargemFluxoPanelProps = {
  loginUsuario: string;
  onSavedLogin: () => void;
};

export default function MargemFluxoPanel({
  loginUsuario,
  onSavedLogin,
}: MargemFluxoPanelProps) {
  const daycovalProxyReady = import.meta.env.VITE_DAYCOVAL_PROXY_READY === "1";
  const showMissingProxyHint = import.meta.env.DEV && !daycovalProxyReady;

  return (
    <div className="mt-8 flex flex-col gap-10">
      {showMissingProxyHint ? (
        <div
          className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900"
          role="status"
        >
          <strong className="font-semibold">
            Integração em modo desenvolvimento
          </strong>
          : o canal seguro esperado pela instituição pode não estar ativo neste
          ambiente. Se as operações falharem, confirme a configuração com a
          equipa de suporte interna.
        </div>
      ) : null}

      <CredenciaisCard initialLogin={loginUsuario} onPersisted={onSavedLogin} />

      <DaycovalDominiosCard loginUsuario={loginUsuario} />

      <AuxiliaresCard loginUsuario={loginUsuario} />

      <SimulacaoCard loginUsuario={loginUsuario} />

      <div className="grid gap-10 lg:grid-cols-2">
        <IncluirSimulacoesCard loginUsuario={loginUsuario} />
        <IncluirPropostaCard loginUsuario={loginUsuario} />
      </div>

      <StatusCard loginUsuario={loginUsuario} />
    </div>
  );
}
