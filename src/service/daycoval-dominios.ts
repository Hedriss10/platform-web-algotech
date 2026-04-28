import { daycovalHttp } from "./daycoval-http";

function headers(loginUsuario: string) {
  return { "Login-Usuario": loginUsuario.trim() };
}

/** Endpoints públicos `/dominio/*` — listas auxiliares de cadastro. */
export const DOMINIOS_MARGENS = [
  {
    slug: "bancos",
    label: "Bancos",
    desc: "Lista de bancos para conta de crédito.",
  },
  {
    slug: "contas-bancarias",
    label: "Contas bancárias",
    desc: "Tipos de conta conforme cadastro.",
  },
  {
    slug: "documentos-identificacao",
    label: "Documentos de identificação",
    desc: "Tipos aceitos no cadastro do cliente.",
  },
  {
    slug: "estados-civis",
    label: "Estados civis",
    desc: "Opções para ficha cadastral.",
  },
  {
    slug: "nacionalidades",
    label: "Nacionalidades",
    desc: "Lista de nacionalidades.",
  },
  {
    slug: "naturezas-relacionamentos",
    label: "Naturezas de relacionamento",
    desc: "Classificações cadastrais.",
  },
  { slug: "sexos", label: "Sexos", desc: "Valores disponíveis." },
  {
    slug: "unidades-federativas",
    label: "Unidades federativas (UF)",
    desc: "Estados brasileiros.",
  },
] as const;

export type DominiosSlug = (typeof DOMINIOS_MARGENS)[number]["slug"];

export async function daycovalDominioGet(
  loginUsuario: string,
  slug: string
): Promise<unknown> {
  const { data } = await daycovalHttp.get<unknown>(`/dominio/${slug}`, {
    headers: headers(loginUsuario),
  });
  return data;
}
