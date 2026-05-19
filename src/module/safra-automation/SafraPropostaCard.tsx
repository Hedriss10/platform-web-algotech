import { isAxiosError } from "axios";
import { useCallback, useMemo, useState } from "react";
import { HiPlay } from "react-icons/hi2";

import { Button, Input } from "../../components/ui";
import { getStoredSafraOcupacaoSelection } from "../../config/safra-ocupacao";
import { safraCriarProposta } from "../../service/safra";
import type {
  SafraProposalRequestBody,
  SafraProposalResponse,
} from "../../types/safra";
import { getApiErrorMessage } from "../../utils/api-error";
import { Toastify } from "../../utils/toastify";

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function parseIntField(value: string): number | null {
  const t = value.trim();
  if (!t) return null;
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) ? n : null;
}

function parseFloatField(value: string): number | null {
  const t = value.trim().replace(",", ".");
  if (!t) return null;
  const n = Number.parseFloat(t);
  return Number.isFinite(n) ? n : null;
}

function cpfDigitsToNumber(cpfDigits: string): number | null {
  const d = onlyDigits(cpfDigits).padStart(11, "0").slice(-11);
  if (d.length !== 11) return null;
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

function toIsoDatetime(value: string): string {
  const t = value.trim();
  if (!t) return "";
  if (/Z$|[+-]\d{2}:\d{2}$/.test(t)) return t;
  const d = new Date(t);
  if (!Number.isNaN(d.getTime())) return d.toISOString();
  return t.includes("T") ? `${t}:00Z` : t;
}

function stripEmptyObject<T extends Record<string, unknown>>(
  obj: T
): T | Record<string, never> {
  const entries = Object.entries(obj).filter(([, v]) => {
    if (v === null || v === undefined) return false;
    if (typeof v === "string" && v.trim() === "") return false;
    return true;
  });
  if (!entries.length) return {};
  return Object.fromEntries(entries) as T;
}

function PropostaResultado({ data }: { data: SafraProposalResponse }) {
  if (data.erro?.descricao || data.erro?.codigo != null) {
    return (
      <div
        className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        role="status"
      >
        <p className="font-semibold">Resposta com aviso da Safra</p>
        {data.erro.codigo != null ? (
          <p className="mt-1">
            Código: <span className="font-mono">{data.erro.codigo}</span>
          </p>
        ) : null}
        {data.erro.descricao ? (
          <p className="mt-1">{data.erro.descricao}</p>
        ) : null}
        {data.idProposta != null ? (
          <p className="mt-2 text-slate-700">
            ID proposta:{" "}
            <span className="font-mono font-medium">{data.idProposta}</span>
          </p>
        ) : null}
      </div>
    );
  }
  return (
    <div
      className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-950"
      role="status"
    >
      <p className="font-semibold">Proposta criada com sucesso</p>
      <p className="mt-1">
        ID na Safra:{" "}
        <span className="font-mono font-medium">{data.idProposta ?? "—"}</span>
      </p>
    </div>
  );
}

const checkboxClass =
  "h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/40";

/** Secção 8 — envio de proposta à Safra (`POST /proposal`). */
export default function SafraPropostaCard() {
  const ocupacaoStored = useMemo(() => getStoredSafraOcupacaoSelection(), []);

  const [submeter, setSubmeter] = useState(false);
  const [isCotacao, setIsCotacao] = useState(false);
  const [comSeguro, setComSeguro] = useState(false);
  const [aumentoMargem, setAumentoMargem] = useState(false);

  const [idConvenio, setIdConvenio] = useState(
    ocupacaoStored?.convenioId != null ? String(ocupacaoStored.convenioId) : ""
  );
  const [idTabelaJuros, setIdTabelaJuros] = useState("");
  const [valorParcela, setValorParcela] = useState("");
  const [prazo, setPrazo] = useState("");
  const [valorPrincipal, setValorPrincipal] = useState("");
  const [cpfAgente, setCpfAgente] = useState("");
  const [dataPrimeiroVencimento, setDataPrimeiroVencimento] = useState("");
  const [taxaJuros, setTaxaJuros] = useState("");

  const [cpfCliente, setCpfCliente] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [emailPessoal, setEmailPessoal] = useState("");

  const [idOrgaoEmpregador, setIdOrgaoEmpregador] = useState(
    ocupacaoStored?.idOrgaoEmpregador != null
      ? String(ocupacaoStored.idOrgaoEmpregador)
      : ""
  );
  const [idRegimeJuridico, setIdRegimeJuridico] = useState(
    ocupacaoStored?.idRegimeJuridico != null
      ? String(ocupacaoStored.idRegimeJuridico)
      : ""
  );
  const [idSituacaoEmpregado, setIdSituacaoEmpregado] = useState(
    ocupacaoStored?.idSituacaoEmpregado != null
      ? String(ocupacaoStored.idSituacaoEmpregado)
      : ""
  );
  const [matricula, setMatricula] = useState("");
  const [valorRenda, setValorRenda] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");

  const [tipoConta, setTipoConta] = useState("Corrente");
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");

  const [bancoAverbacao, setBancoAverbacao] = useState("");
  const [agenciaAverbacao, setAgenciaAverbacao] = useState("");
  const [contaAverbacao, setContaAverbacao] = useState("");

  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");

  const [ddd, setDdd] = useState("");
  const [telefone, setTelefone] = useState("");
  const [emailContato, setEmailContato] = useState("");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [resultado, setResultado] = useState<SafraProposalResponse | null>(
    null
  );

  const importarCatalogos = () => {
    const sel = getStoredSafraOcupacaoSelection();
    if (!sel) {
      Toastify(
        "Nenhuma seleção na secção 7. Carregue os catálogos e escolha órgão, regime e situação.",
        { type: "info", position: "top-right" }
      );
      return;
    }
    if (sel.convenioId != null) setIdConvenio(String(sel.convenioId));
    if (sel.idOrgaoEmpregador != null) {
      setIdOrgaoEmpregador(String(sel.idOrgaoEmpregador));
    }
    if (sel.idRegimeJuridico != null) {
      setIdRegimeJuridico(String(sel.idRegimeJuridico));
    }
    if (sel.idSituacaoEmpregado != null) {
      setIdSituacaoEmpregado(String(sel.idSituacaoEmpregado));
    }
    Toastify("Dados de ocupação importados da secção 7.", {
      type: "success",
      position: "top-right",
    });
  };

  const buildBody = useCallback((): SafraProposalRequestBody | null => {
    const conv = parseIntField(idConvenio);
    const tabela = parseIntField(idTabelaJuros);
    const parcela = parseFloatField(valorParcela);
    const prazoN = parseIntField(prazo);
    const principal = parseFloatField(valorPrincipal);
    const agente = cpfDigitsToNumber(cpfAgente);
    const venc = toIsoDatetime(dataPrimeiroVencimento);

    if (conv === null || conv <= 0) {
      Toastify("Informe o código do convênio (idConvenio).", {
        type: "warning",
        position: "top-right",
      });
      return null;
    }
    if (tabela === null || tabela <= 0) {
      Toastify("Informe o id da tabela de juros.", {
        type: "warning",
        position: "top-right",
      });
      return null;
    }
    if (parcela === null || parcela <= 0) {
      Toastify("Informe o valor da parcela.", {
        type: "warning",
        position: "top-right",
      });
      return null;
    }
    if (prazoN === null || prazoN <= 0) {
      Toastify("Informe o prazo.", {
        type: "warning",
        position: "top-right",
      });
      return null;
    }
    if (principal === null || principal <= 0) {
      Toastify("Informe o valor principal.", {
        type: "warning",
        position: "top-right",
      });
      return null;
    }
    if (agente === null) {
      Toastify("CPF do agente certificado deve ter 11 dígitos.", {
        type: "warning",
        position: "top-right",
      });
      return null;
    }
    if (!venc) {
      Toastify("Informe a data do primeiro vencimento.", {
        type: "warning",
        position: "top-right",
      });
      return null;
    }

    const tipo = tipoConta.trim();
    if (!tipo) {
      Toastify("Tipo de conta bancária é obrigatório.", {
        type: "warning",
        position: "top-right",
      });
      return null;
    }

    const cepDigits = onlyDigits(cep);
    if (cepDigits.length !== 8) {
      Toastify("CEP deve ter 8 dígitos.", {
        type: "warning",
        position: "top-right",
      });
      return null;
    }
    const ufSigla = uf.trim().toUpperCase().slice(0, 2);
    if (ufSigla.length !== 2) {
      Toastify("UF deve ter 2 letras.", {
        type: "warning",
        position: "top-right",
      });
      return null;
    }
    if (!logradouro.trim() || !numero.trim() || !cidade.trim()) {
      Toastify("Preencha logradouro, número e cidade.", {
        type: "warning",
        position: "top-right",
      });
      return null;
    }

    const contatos: SafraProposalRequestBody["contatos"] = [];
    const dddN = parseIntField(ddd);
    const tel = telefone.trim();
    const em = emailContato.trim();
    if (dddN != null || tel || em) {
      contatos.push({
        ddd: dddN,
        telefone: tel || null,
        email: em || null,
      });
    }

    const cpfPessoal = cpfDigitsToNumber(cpfCliente);
    const dadosPessoais = stripEmptyObject({
      cpf: cpfPessoal,
      nomeCompleto: nomeCompleto.trim() || null,
      nomeMae: nomeMae.trim() || null,
      dataNascimento: dataNascimento.trim() || null,
      sexo: sexo.trim() || null,
      email: emailPessoal.trim() || null,
    });

    const dadosOcupacao = stripEmptyObject({
      idOrgaoEmpregador: parseIntField(idOrgaoEmpregador),
      idRegimeJuridico: parseIntField(idRegimeJuridico),
      idSituacaoEmpregado: parseIntField(idSituacaoEmpregado),
      matricula: matricula.trim() || null,
      valorRenda: parseFloatField(valorRenda),
      dataAdmissao: dataAdmissao.trim() || null,
    });

    const dadosBancariosAverbacao = stripEmptyObject({
      bancoAverbacao: parseIntField(bancoAverbacao),
      agenciaAverbacao: parseIntField(agenciaAverbacao),
      contaAverbacao: contaAverbacao.trim() || null,
    });

    const taxa = parseFloatField(taxaJuros);

    return {
      contatos,
      dadosBancarios: {
        tipoConta: tipo,
        agencia: parseIntField(agencia),
        banco: parseIntField(banco),
        conta: conta.trim() || null,
      },
      dadosOcupacao,
      dadosPessoais,
      dadosProposta: {
        idConvenio: conv,
        idTabelaJuros: tabela,
        isCotacao,
        valorParcela: parcela,
        prazo: prazoN,
        valorPrincipal: principal,
        cpfAgenteCertificado: agente,
        dataPrimeiroVencimento: venc,
        ...(taxa != null ? { taxaJuros: taxa } : {}),
        comSeguro,
        aumentoMargem,
      },
      endereco: {
        logradouro: logradouro.trim(),
        numero: numero.trim(),
        cep: cepDigits,
        cidade: cidade.trim(),
        uf: ufSigla,
        bairro: bairro.trim() || null,
        complemento: complemento.trim() || null,
      },
      submeter,
      dadosBancariosAverbacao,
    };
  }, [
    idConvenio,
    idTabelaJuros,
    valorParcela,
    prazo,
    valorPrincipal,
    cpfAgente,
    dataPrimeiroVencimento,
    taxaJuros,
    tipoConta,
    banco,
    agencia,
    conta,
    cpfCliente,
    nomeCompleto,
    nomeMae,
    dataNascimento,
    sexo,
    emailPessoal,
    idOrgaoEmpregador,
    idRegimeJuridico,
    idSituacaoEmpregado,
    matricula,
    valorRenda,
    dataAdmissao,
    bancoAverbacao,
    agenciaAverbacao,
    contaAverbacao,
    logradouro,
    numero,
    cep,
    cidade,
    uf,
    bairro,
    complemento,
    ddd,
    telefone,
    emailContato,
    submeter,
    isCotacao,
    comSeguro,
    aumentoMargem,
  ]);

  const enviar = async () => {
    const body = buildBody();
    if (!body) return;

    setBusy(true);
    setErr(null);
    setResultado(null);
    try {
      const data = await safraCriarProposta(body);
      setResultado(data);
      if (data.erro?.descricao) {
        Toastify("Proposta processada com aviso da Safra.", {
          type: "warning",
          position: "top-right",
        });
      } else {
        Toastify("Proposta enviada com sucesso.", {
          type: "success",
          position: "top-right",
        });
      }
    } catch (e) {
      setErr(
        isAxiosError(e)
          ? getApiErrorMessage(e)
          : "Erro ao criar a proposta na Safra."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <h2 className="text-lg font-semibold text-slate-900">
        8 — Criar proposta
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Envia uma nova proposta à Safra. Campos obrigatórios: dados da proposta,
        conta bancária (tipo de conta), endereço e indicador de submissão. Pode
        importar órgão, regime e situação da secção 7.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={importarCatalogos}>
          Importar ocupação (secção 7)
        </Button>
      </div>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-slate-800">
          Dados da proposta
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Convênio (idConvenio)"
            value={idConvenio}
            inputMode="numeric"
            onChange={(e) => setIdConvenio(e.target.value)}
          />
          <Input
            label="Tabela de juros (id)"
            value={idTabelaJuros}
            inputMode="numeric"
            onChange={(e) => setIdTabelaJuros(e.target.value)}
          />
          <Input
            label="Valor parcela (R$)"
            value={valorParcela}
            inputMode="decimal"
            onChange={(e) => setValorParcela(e.target.value)}
          />
          <Input
            label="Prazo (meses)"
            value={prazo}
            inputMode="numeric"
            onChange={(e) => setPrazo(e.target.value)}
          />
          <Input
            label="Valor principal (R$)"
            value={valorPrincipal}
            inputMode="decimal"
            onChange={(e) => setValorPrincipal(e.target.value)}
          />
          <Input
            label="CPF agente certificado"
            value={cpfAgente}
            inputMode="numeric"
            maxLength={14}
            onChange={(e) => setCpfAgente(formatCpfDigits(e.target.value))}
          />
          <Input
            label="1.º vencimento"
            type="datetime-local"
            value={dataPrimeiroVencimento}
            onChange={(e) => setDataPrimeiroVencimento(e.target.value)}
          />
          <Input
            label="Taxa de juros (opcional)"
            value={taxaJuros}
            inputMode="decimal"
            onChange={(e) => setTaxaJuros(e.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={isCotacao}
              onChange={(e) => setIsCotacao(e.target.checked)}
            />
            É cotação
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={comSeguro}
              onChange={(e) => setComSeguro(e.target.checked)}
            />
            Com seguro
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={aumentoMargem}
              onChange={(e) => setAumentoMargem(e.target.checked)}
            />
            Aumento de margem
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={submeter}
              onChange={(e) => setSubmeter(e.target.checked)}
            />
            Submeter à Safra
          </label>
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-slate-800">
          Dados pessoais (opcional)
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="CPF cliente"
            value={cpfCliente}
            maxLength={14}
            inputMode="numeric"
            onChange={(e) => setCpfCliente(formatCpfDigits(e.target.value))}
          />
          <Input
            label="Nome completo"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
          />
          <Input
            label="Nome da mãe"
            value={nomeMae}
            onChange={(e) => setNomeMae(e.target.value)}
          />
          <Input
            label="Data nascimento"
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
          />
          <Input
            label="Sexo"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
          />
          <Input
            label="E-mail"
            type="email"
            value={emailPessoal}
            onChange={(e) => setEmailPessoal(e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-slate-800">
          Ocupação (opcional)
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Órgão empregador (id)"
            value={idOrgaoEmpregador}
            inputMode="numeric"
            onChange={(e) => setIdOrgaoEmpregador(e.target.value)}
          />
          <Input
            label="Regime jurídico (id)"
            value={idRegimeJuridico}
            inputMode="numeric"
            onChange={(e) => setIdRegimeJuridico(e.target.value)}
          />
          <Input
            label="Situação empregado (id)"
            value={idSituacaoEmpregado}
            inputMode="numeric"
            onChange={(e) => setIdSituacaoEmpregado(e.target.value)}
          />
          <Input
            label="Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />
          <Input
            label="Valor renda"
            value={valorRenda}
            inputMode="decimal"
            onChange={(e) => setValorRenda(e.target.value)}
          />
          <Input
            label="Data admissão"
            type="date"
            value={dataAdmissao}
            onChange={(e) => setDataAdmissao(e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-slate-800">
          Dados bancários
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Tipo de conta"
            value={tipoConta}
            onChange={(e) => setTipoConta(e.target.value)}
            placeholder="Corrente"
          />
          <Input
            label="Banco (código)"
            value={banco}
            inputMode="numeric"
            onChange={(e) => setBanco(e.target.value)}
          />
          <Input
            label="Agência"
            value={agencia}
            inputMode="numeric"
            onChange={(e) => setAgencia(e.target.value)}
          />
          <Input
            label="Conta"
            value={conta}
            onChange={(e) => setConta(e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-slate-800">
          Averbação (opcional)
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input
            label="Banco averbação"
            value={bancoAverbacao}
            inputMode="numeric"
            onChange={(e) => setBancoAverbacao(e.target.value)}
          />
          <Input
            label="Agência averbação"
            value={agenciaAverbacao}
            inputMode="numeric"
            onChange={(e) => setAgenciaAverbacao(e.target.value)}
          />
          <Input
            label="Conta averbação"
            value={contaAverbacao}
            onChange={(e) => setContaAverbacao(e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-slate-800">
          Endereço
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Logradouro"
            value={logradouro}
            onChange={(e) => setLogradouro(e.target.value)}
          />
          <Input
            label="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <Input
            label="CEP"
            value={cep}
            inputMode="numeric"
            maxLength={9}
            onChange={(e) => setCep(e.target.value)}
          />
          <Input
            label="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
          <Input
            label="UF"
            value={uf}
            maxLength={2}
            onChange={(e) => setUf(e.target.value.toUpperCase())}
          />
          <Input
            label="Bairro (opcional)"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
          <Input
            label="Complemento (opcional)"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-slate-800">
          Contato (opcional)
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input
            label="DDD"
            value={ddd}
            inputMode="numeric"
            maxLength={2}
            onChange={(e) => setDdd(e.target.value)}
          />
          <Input
            label="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <Input
            label="E-mail"
            type="email"
            value={emailContato}
            onChange={(e) => setEmailContato(e.target.value)}
          />
        </div>
      </fieldset>

      <div className="mt-8 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          disabled={busy}
          className="gap-2"
          onClick={() => void enviar()}
        >
          <HiPlay className="h-4 w-4" aria-hidden />
          Enviar proposta
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
      {resultado ? <PropostaResultado data={resultado} /> : null}
    </section>
  );
}
