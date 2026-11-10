import { Search } from "lucide-react";
import { formatBRL } from "@/lib/porsche/analytics";
import type { Sale } from "@/lib/porsche/types";
import { Panel } from "./Panel";

const ROWS_PER_PAGE = 7;

const badge: Record<string, string> = {
  PIX: "bg-pay-pix/15 text-success border-pay-pix/30",
  Financiamento: "bg-pay-financiamento/15 text-info border-pay-financiamento/30",
  Transferência: "bg-pay-transferencia/15 text-warning border-pay-transferencia/30",
  "Cartão de Crédito": "bg-pay-cartao/15 text-pink border-pay-cartao/30",
};

const pagerBtn =
  "rounded-lg bg-secondary px-3 py-1.5 text-secondary-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40";

export function SalesTable({
  data,
  search,
  onSearch,
  page,
  onPage,
}: {
  data: Sale[];
  search: string;
  onSearch: (v: string) => void;
  page: number;
  onPage: (p: number) => void;
}) {
  const total = data.length;
  const start = (page - 1) * ROWS_PER_PAGE;
  const end = Math.min(start + ROWS_PER_PAGE, total);
  const rows = data.slice(start, end);

  return (
    <Panel className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-foreground">Detalhamento de Transações</h3>
          <p className="text-xs text-muted-foreground">
            Lista individualizada das vendas correspondentes ao recorte dos filtros aplicados.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-subtle-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar por modelo, cidade..."
            aria-label="Buscar transações"
            className="w-full rounded-xl border border-input bg-surface-sunken py-2.5 pl-9 pr-4 text-xs text-secondary-foreground outline-none placeholder:text-subtle-foreground focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-xs text-secondary-foreground">
          <thead className="border-b border-border bg-surface-sunken/80 font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3"># ID</th>
              <th className="px-4 py-3">Modelo</th>
              <th className="px-4 py-3">Localização</th>
              <th className="px-4 py-3 text-center">Ano</th>
              <th className="px-4 py-3">Preço (R$)</th>
              <th className="px-4 py-3">Forma de Pagamento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-subtle-foreground">
                  Nenhum registro encontrado para o filtro aplicado.
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s.id} className="transition hover:bg-secondary/40">
                  <td className="px-4 py-3 font-mono text-muted-foreground">#{s.id}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">Porsche {s.modelo}</td>
                  <td className="px-4 py-3">
                    {s.cidade} <span className="text-subtle-foreground">({s.estado})</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded bg-secondary px-2 py-0.5 font-mono">{s.ano}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-success">{formatBRL(s.preco)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${badge[s.metodoPagamento] ?? badge["Cartão de Crédito"]}`}
                    >
                      {s.metodoPagamento}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
        <span>{total > 0 ? `Exibindo ${start + 1} a ${end} de ${total} transações` : "0 registros"}</span>
        <div className="flex gap-2">
          <button className={pagerBtn} disabled={page === 1} onClick={() => onPage(page - 1)}>
            Anterior
          </button>
          <button className={pagerBtn} disabled={end >= total} onClick={() => onPage(page + 1)}>
            Próximo
          </button>
        </div>
      </div>
    </Panel>
  );
}
