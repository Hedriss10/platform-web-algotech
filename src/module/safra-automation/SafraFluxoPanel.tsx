import { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiArrowPath, HiChevronLeft, HiChevronRight, HiPlay } from "react-icons/hi2";

import { Button, Input } from "../../components/ui";
import {
    getStoredSafraMarginBpoRequest,
    getStoredSafraMarginBpoResponse,
    SAFRA_DEMO_MARGIN_BPO,
    setStoredSafraMarginBpoRequest,
    setStoredSafraMarginBpoResponse,
} from "../../config/safra";
import { safraConsultarMargemBpo, safraListarBancos } from "../../service/safra";
import type {
    MargemBpoRequestBody,
    MargemBpoResponse,
    SafraBank,
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
            setErr(isAxiosError(e) ? getApiErrorMessage(e) : "Erro ao listar bancos.");
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
                1. Bancos (Safra)
            </h2>
            <p className="mt-1 text-sm text-slate-600">
                Lista devolvida pelo Hub a partir da API correspondente.
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
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
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
        const cpfNum = Number.parseInt(cpfDigits, 10);

        if (!Number.isFinite(conv) || conv <= 0) {
            Toastify("Informe um convênio válido.", {
                type: "warning",
                position: "top-right",
            });
            return;
        }
        if (cpfDigits.length !== 11 || !Number.isFinite(cpfNum)) {
            Toastify("CPF deve ter 11 dígitos.", {
                type: "warning",
                position: "top-right",
            });
            return;
        }
        if (!Number.isFinite(prod) || prod <= 0) {
            Toastify("Informe um idProduto válido.", {
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
            cpf: cpfNum,
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
                isAxiosError(e)
                    ? getApiErrorMessage(e)
                    : "Erro na consulta de margem BPO."
            );
        } finally {
            setBusy(false);
        }
    }, [convenio, cpfMasked, idProduto, matricula]);

    return (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
            <h2 className="text-lg font-semibold text-slate-900">
                2. Consulta de margem (BPO)
            </h2>
            <p className="mt-1 text-sm text-slate-600">
                Preencher os campos abaixo para consultar a margem BPO.
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
                <Input
                    label="idProduto"
                    value={idProduto}
                    inputMode="numeric"
                    onChange={(e) => setIdProduto(e.target.value)}
                    placeholder="ex.: 1"
                />
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

/** Painel principal do fluxo Safra (proxy Hub `/api/v2/safra`). */
export default function SafraFluxoPanel() {
    return (
        <div className="mt-8 flex flex-col gap-10">
            <BancosSafraCard />
            <MargemBpoCard />
        </div>
    );
}
