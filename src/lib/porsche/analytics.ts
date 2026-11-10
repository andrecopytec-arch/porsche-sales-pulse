import type { Sale, SalesFilters } from "./types";

export const ALL = "ALL";

export const MODELOS = ["911", "Cayenne", "Macan", "Taycan", "Panamera"] as const;
export const CIDADES = [
  { value: "São Paulo", label: "São Paulo (SP)" },
  { value: "Rio de Janeiro", label: "Rio de Janeiro (RJ)" },
  { value: "Curitiba", label: "Curitiba (PR)" },
  { value: "Belo Horizonte", label: "Belo Horizonte (MG)" },
  { value: "Brasília", label: "Brasília (DF)" },
] as const;
export const ANOS = [2024, 2023, 2022, 2021] as const;
export const PAGAMENTOS = [
  { value: "PIX", label: "PIX à Vista" },
  { value: "Transferência", label: "Transferência Bancária" },
  { value: "Financiamento", label: "Financiamento" },
  { value: "Cartão de Crédito", label: "Cartão de Crédito" },
] as const;

export const EMPTY_FILTERS: SalesFilters = {
  modelo: ALL,
  cidade: ALL,
  ano: ALL,
  pagamento: ALL,
  search: "",
};

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});
export const formatBRL = (value: number) => brl.format(value);

export function filterSales(sales: Sale[], f: SalesFilters): Sale[] {
  const q = f.search.toLowerCase().trim();
  return sales.filter((s) => {
    if (f.modelo !== ALL && s.modelo !== f.modelo) return false;
    if (f.cidade !== ALL && s.cidade !== f.cidade) return false;
    if (f.ano !== ALL && String(s.ano) !== f.ano) return false;
    if (f.pagamento !== ALL && s.metodoPagamento !== f.pagamento) return false;
    if (!q) return true;
    return [s.modelo, s.cidade, s.estado, s.metodoPagamento, String(s.ano)].some((v) =>
      v.toLowerCase().includes(q),
    );
  });
}

export function computeKpis(data: Sale[]) {
  const revenue = data.reduce((acc, s) => acc + s.preco, 0);
  const count = data.length;
  const avgPrice = count > 0 ? revenue / count : 0;
  const counts = new Map<string, number>();
  for (const s of data) counts.set(s.modelo, (counts.get(s.modelo) ?? 0) + 1);
  let topModel: string | null = null;
  let topModelCount = 0;
  for (const [m, c] of counts) {
    if (c > topModelCount) {
      topModel = m;
      topModelCount = c;
    }
  }
  const topModelShare = count > 0 ? Math.round((topModelCount / count) * 100) : 0;
  return { revenue, count, avgPrice, topModel, topModelCount, topModelShare };
}

export function byModel(data: Sale[]) {
  return MODELOS.map((m) => {
    const rows = data.filter((s) => s.modelo === m);
    return {
      modelo: `Porsche ${m}`,
      receita: rows.reduce((acc, s) => acc + s.preco, 0),
      unidades: rows.length,
    };
  });
}

export function byCity(data: Sale[]) {
  return CIDADES.map((c) => ({
    cidade: c.value,
    receita: data.filter((s) => s.cidade === c.value).reduce((acc, s) => acc + s.preco, 0),
  }));
}

export function paymentsByYear(data: Sale[]) {
  return [...ANOS].reverse().map((ano) => {
    const row: Record<string, number | string> = { ano: `Ano ${ano}` };
    for (const p of PAGAMENTOS) {
      row[p.value] = data.filter((s) => s.ano === ano && s.metodoPagamento === p.value).length;
    }
    return row;
  });
}
