import { createFileRoute } from "@tanstack/react-router";
import { RotateCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CityChart, ModelChart, PaymentsChart } from "@/components/dashboard/Charts";
import { FiltersBar } from "@/components/dashboard/FiltersBar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { SalesTable } from "@/components/dashboard/SalesTable";
import { EMPTY_FILTERS, filterSales } from "@/lib/porsche/analytics";
import { SALES } from "@/lib/porsche/sales-data";
import type { SalesFilters } from "@/lib/porsche/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Porsche Analytics Hub — Painel de Vendas" },
      {
        name: "description",
        content: "Receita, volume, regiões e formas de pagamento das vendas Porsche em um só painel.",
      },
      { property: "og:title", content: "Porsche Analytics Hub — Painel de Vendas" },
      {
        property: "og:description",
        content: "Receita, volume, regiões e formas de pagamento das vendas Porsche em um só painel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [filters, setFilters] = useState<SalesFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [today, setToday] = useState("Hoje");

  useEffect(() => setToday(new Date().toLocaleDateString("pt-BR")), []);

  const data = useMemo(() => filterSales(SALES, filters), [filters]);

  const update = (patch: Partial<SalesFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-xl font-bold text-primary-foreground shadow-brand">
              P
            </div>
            <div>
              <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                PORSCHE
                <span className="rounded border border-primary/50 bg-primary/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-brand-soft">
                  Analytics Hub
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Painel de Inteligência de Vendas e Performance Comercial
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => update(EMPTY_FILTERS)}
              className="flex items-center gap-2 rounded-lg border border-input bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition hover:bg-accent hover:text-foreground"
            >
              <RotateCw className="h-3.5 w-3.5" /> Limpar Filtros
            </button>
            <div className="hidden border-l border-border pl-3 text-xs text-muted-foreground sm:block">
              Atualizado: <span className="font-semibold text-secondary-foreground">{today}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6 lg:px-8">
        <FiltersBar filters={filters} onChange={update} shown={data.length} total={SALES.length} />
        <KpiCards data={data} />
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ModelChart data={data} />
          <CityChart data={data} />
          <PaymentsChart data={data} />
        </section>
        <SalesTable
          data={data}
          search={filters.search}
          onSearch={(search) => update({ search })}
          page={page}
          onPage={setPage}
        />
      </main>

      <footer className="mx-auto mt-12 max-w-7xl border-t border-border px-4 pt-6 text-center text-xs text-subtle-foreground sm:px-6 lg:px-8">
        <p>Porsche Sales Analytics Dashboard • Desenvolvido para Portfólio de Inteligência de Dados</p>
      </footer>
    </div>
  );
}
