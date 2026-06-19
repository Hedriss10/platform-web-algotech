import type { SafraInterestTableBand } from "../types/safra";

/** Prazo usado na simulação para uma faixa (`prazoFinal`, ou `prazoInicial` se não houver final). */
export function prazoDaFaixa(band: SafraInterestTableBand): number | null {
  if (band.prazoFinal != null && band.prazoFinal > 0) return band.prazoFinal;
  if (band.prazoInicial != null && band.prazoInicial > 0)
    return band.prazoInicial;
  return null;
}

/** Lista de prazos únicos (um por faixa) para o campo `prazos` do body. */
export function prazosFromBands(bands: SafraInterestTableBand[]): number[] {
  const set = new Set<number>();
  for (const band of bands) {
    const prazo = prazoDaFaixa(band);
    if (prazo != null) set.add(prazo);
  }
  return [...set].sort((a, b) => a - b);
}

export function formatFaixaPrazoLabel(band: SafraInterestTableBand): string {
  const ini = band.prazoInicial;
  const fim = band.prazoFinal;
  const prazo = prazoDaFaixa(band);
  if (ini != null && fim != null && ini !== fim && prazo != null) {
    return `${prazo} meses (faixa ${ini}–${fim})`;
  }
  if (prazo != null) return `${prazo} meses`;
  return "Faixa sem prazo";
}
