/** Extrai URLs legíveis da resposta de formalização Safra (estrutura variável). */
export function extrairUrlsFormalizacao(data: unknown): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();

  const push = (v: unknown) => {
    if (typeof v !== "string" || !v.trim()) return;
    const t = v.trim();
    if (!/^https?:\/\//i.test(t)) return;
    if (seen.has(t)) return;
    seen.add(t);
    urls.push(t);
  };

  const walk = (node: unknown, depth = 0) => {
    if (depth > 6 || node == null) return;
    if (typeof node === "string") {
      push(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) walk(item, depth + 1);
      return;
    }
    if (typeof node === "object") {
      const o = node as Record<string, unknown>;
      for (const key of [
        "url",
        "link",
        "linkFormalizacao",
        "linkFormalizacaoDigital",
        "urlFormalizacao",
      ]) {
        push(o[key]);
      }
      for (const v of Object.values(o)) walk(v, depth + 1);
    }
  };

  walk(data);
  return urls;
}
