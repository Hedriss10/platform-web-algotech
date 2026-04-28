import { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import { HiArrowPath, HiChevronDown, HiRectangleStack } from "react-icons/hi2";

import { Button } from "../../components/ui";
import {
  DOMINIOS_MARGENS,
  daycovalDominioGet,
  type DominiosSlug,
} from "../../service/daycoval-dominios";
import { getApiErrorMessage } from "../../utils/api-error";
import { Toastify } from "../../utils/toastify";

/** Se a API devolver lista de objetos homogéneos, mostra tabela; caso contrário mensagem neutra. */
function DominioResultado({ data }: { data: unknown }) {
  if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    if (first && typeof first === "object" && !Array.isArray(first)) {
      const keys = Object.keys(first as object);
      if (keys.length === 0) {
        return (
          <p className="text-sm text-slate-500">Lista vazia ou sem colunas.</p>
        );
      }
      return (
        <div className="max-h-60 overflow-auto rounded-xl border border-slate-200/90">
          <table className="w-full min-w-[280px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/95">
                {keys.map((k) => (
                  <th
                    key={k}
                    className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700"
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, ri) => {
                if (!row || typeof row !== "object") return null;
                const o = row as Record<string, unknown>;
                return (
                  <tr
                    key={ri}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40"
                  >
                    {keys.map((k) => (
                      <td
                        key={k}
                        className="max-w-[12rem] truncate px-3 py-1.5 text-slate-800"
                        title={String(o[k] ?? "")}
                      >
                        {formatCelula(o[k])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }

  return (
    <p className="text-sm text-slate-600">
      Este resultado não pode ser mostrado em tabela automática.
    </p>
  );
}

function formatCelula(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

type DominioBlockState = {
  data: unknown | null;
  loading: boolean;
  error: string | null;
  open: boolean;
};

const initialBlocks = (): Record<DominiosSlug, DominioBlockState> => {
  const acc = {} as Record<DominiosSlug, DominioBlockState>;
  for (const d of DOMINIOS_MARGENS) {
    acc[d.slug] = {
      data: null,
      loading: false,
      error: null,
      open: false,
    };
  }
  return acc;
};

type Props = {
  loginUsuario: string;
};

export default function DaycovalDominiosCard({ loginUsuario }: Props) {
  const [blocks, setBlocks] =
    useState<Record<DominiosSlug, DominioBlockState>>(initialBlocks);
  const [bulkBusy, setBulkBusy] = useState(false);

  const loadOne = useCallback(
    async (slug: DominiosSlug) => {
      if (!loginUsuario.trim()) {
        Toastify("Guarde primeiro a credencial no passo 1.", {
          type: "warning",
          position: "top-right",
        });
        return;
      }
      setBlocks((b) => ({
        ...b,
        [slug]: { ...b[slug], loading: true, error: null },
      }));
      try {
        const data = await daycovalDominioGet(loginUsuario, slug);
        setBlocks((b) => ({
          ...b,
          [slug]: {
            ...b[slug],
            data,
            loading: false,
            error: null,
            open: true,
          },
        }));
      } catch (e) {
        setBlocks((b) => ({
          ...b,
          [slug]: {
            ...b[slug],
            loading: false,
            error: isAxiosError(e)
              ? getApiErrorMessage(e)
              : "Erro ao carregar domínio.",
          },
        }));
      }
    },
    [loginUsuario]
  );

  const loadAll = useCallback(async () => {
    if (!loginUsuario.trim()) {
      Toastify("Guarde primeiro a credencial no passo 1.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    setBulkBusy(true);
    setBlocks((prev) => {
      const next = { ...prev };
      for (const d of DOMINIOS_MARGENS) {
        next[d.slug] = { ...prev[d.slug], loading: true, error: null };
      }
      return next;
    });
    try {
      const entries = await Promise.all(
        DOMINIOS_MARGENS.map(async (d) => {
          try {
            const data = await daycovalDominioGet(loginUsuario, d.slug);
            return {
              slug: d.slug,
              patch: {
                data,
                loading: false,
                error: null,
                open: true,
              },
            };
          } catch (e) {
            return {
              slug: d.slug,
              patch: {
                data: null,
                loading: false,
                error: isAxiosError(e)
                  ? getApiErrorMessage(e)
                  : "Erro ao carregar.",
                open: true,
              },
            };
          }
        })
      );

      setBlocks((prev) => {
        const next = { ...prev };
        for (const { slug, patch } of entries) {
          next[slug as DominiosSlug] = {
            ...prev[slug as DominiosSlug],
            ...patch,
          };
        }
        return next;
      });

      Toastify("Tabelas de domínio atualizadas.", {
        type: "success",
        position: "top-right",
      });
    } finally {
      setBulkBusy(false);
    }
  }, [loginUsuario]);

  const toggleOpen = (slug: DominiosSlug) => {
    setBlocks((b) => ({
      ...b,
      [slug]: { ...b[slug], open: !b[slug].open },
    }));
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/40">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-600/20">
            <HiRectangleStack className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              2. Cadastro — domínios Daycoval
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Listas oficiais para preenchimento de cadastro (bancos,
              documentos, UF, etc.). Requer credencial válida gravada no passo
              1.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={bulkBusy}
          onClick={() => void loadAll()}
          className="shrink-0 gap-2 self-start"
        >
          <HiArrowPath
            className={`h-4 w-4 ${bulkBusy ? "animate-spin" : ""}`}
            aria-hidden
          />
          Carregar todas
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {DOMINIOS_MARGENS.map((d) => {
          const st = blocks[d.slug];
          return (
            <div
              key={d.slug}
              className="overflow-hidden rounded-xl border border-slate-200/90 bg-slate-50/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleOpen(d.slug)}
                  className="min-w-0 flex-1 text-left transition hover:opacity-90"
                >
                  <span className="font-medium text-slate-900">{d.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {d.desc}
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="!min-h-8 !px-3 !py-1.5 text-xs"
                    disabled={st.loading}
                    onClick={() => void loadOne(d.slug)}
                  >
                    {st.loading ? "…" : "Carregar"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => toggleOpen(d.slug)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-800"
                    aria-label={st.open ? "Recolher" : "Expandir"}
                  >
                    <HiChevronDown
                      className={[
                        "h-5 w-5 transition-transform",
                        st.open ? "rotate-180" : "",
                      ].join(" ")}
                      aria-hidden
                    />
                  </button>
                </div>
              </div>
              {st.open ? (
                <div className="border-t border-slate-200/80 bg-white px-4 py-3">
                  {st.error ? (
                    <p className="text-sm text-red-700" role="alert">
                      {st.error}
                    </p>
                  ) : st.data !== null ? (
                    <DominioResultado data={st.data} />
                  ) : (
                    <p className="text-sm text-slate-500">
                      Clique em Carregar para obter os dados.
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
