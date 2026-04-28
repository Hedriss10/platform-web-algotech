/**
 * Extrai linhas utilizáveis como "oferta" a partir da resposta da simulação (estruturas variam entre ambientes).
 */
export function extrairOfertasSimulacaoParaUI(
  resposta: unknown
): { idx: number; label: string; oferta: Record<string, unknown> }[] {
  const arraysPlano = coletarArraysDeObjetos(resposta);
  const deOferta = arraysPlano.filter(
    (arr) =>
      arr.length > 0 && pareceLinhaOferta(arr[0] as Record<string, unknown>)
  );
  const melhor =
    deOferta.length > 0
      ? deOferta.reduce((a, b) => (b.length >= a.length ? b : a))
      : [];

  if (melhor.length === 0 && resposta && typeof resposta === "object") {
    const root = resposta as Record<string, unknown>;
    if (!Array.isArray(resposta) && pareceLinhaOferta(root)) {
      return [
        {
          idx: 0,
          label: rotuloOferta(root, 0),
          oferta: root,
        },
      ];
    }
  }

  return melhor.map((row, idx) => ({
    idx,
    label: rotuloOferta(row as Record<string, unknown>, idx),
    oferta: row as Record<string, unknown>,
  }));
}

function pareceLinhaOferta(o: Record<string, unknown>): boolean {
  return (
    "CodConvenio" in o ||
    "VlrParcela" in o ||
    "VlrLiquido" in o ||
    "QtdParcela" in o ||
    "VlrFinanciado" in o
  );
}

function rotuloOferta(o: Record<string, unknown>, idx: number): string {
  const conv = o.CodConvenio ?? o.CodigoConvenio ?? "—";
  const parc = o.QtdParcela ?? "—";
  const vl =
    o.VlrParcela ?? o.VlrLiquido ?? o.VlrCliente ?? o.VlrFinanciado ?? "—";
  return `Opção ${idx + 1} · Conv. ${String(conv)} · ${String(parc)}x · R$ ${String(vl)}`;
}

/** Percorre a árvore JSON e junta todos os arrays cujo primeiro elemento é objeto. */
function coletarArraysDeObjetos(node: unknown, depth = 0): object[][] {
  if (depth > 14 || node === undefined || node === null) return [];
  const saida: object[][] = [];
  if (Array.isArray(node)) {
    const first = node[0];
    if (first !== undefined && typeof first === "object" && first !== null) {
      saida.push(node as object[]);
    }
    for (const item of node) {
      saida.push(...coletarArraysDeObjetos(item, depth + 1));
    }
    return saida;
  }
  if (typeof node === "object") {
    for (const v of Object.values(node as Record<string, unknown>)) {
      saida.push(...coletarArraysDeObjetos(v, depth + 1));
    }
  }
  return saida;
}

/** Empregadores: tenta ler lista plana típica do retorno GET /margem/empregadores. */
export function parseListaEmpregadoresDaycoval(data: unknown): {
  cod: number;
  label: string;
}[] {
  if (!Array.isArray(data)) return [];
  const out: { cod: number; label: string }[] = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const codRaw =
      o.CodEmpregador ?? o.codEmpregador ?? o.CodigoEmpregador ?? o.Codigo;
    const cod =
      typeof codRaw === "number"
        ? codRaw
        : Number.parseInt(String(codRaw ?? ""), 10);
    if (!Number.isFinite(cod)) continue;
    const nome =
      (o.NomeEmpregador as string) ??
      (o.Nome as string) ??
      (o.Descricao as string) ??
      (o.Label as string) ??
      `Empregador ${cod}`;
    out.push({
      cod,
      label: `${cod} — ${String(nome).trim()}`,
    });
  }
  return out;
}
