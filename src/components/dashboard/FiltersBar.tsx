import { SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL, ANOS, CIDADES, MODELOS, PAGAMENTOS } from "@/lib/porsche/analytics";
import type { SalesFilters } from "@/lib/porsche/types";
import { Panel } from "./Panel";

type Option = { value: string; label: string };

function FilterSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
}: {
  label: string;
  value: string;
  allLabel: string;
  options: readonly Option[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          aria-label={label}
          className="h-11 rounded-xl border-input bg-surface-sunken text-sm text-secondary-foreground focus:ring-2 focus:ring-ring"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function FiltersBar({
  filters,
  onChange,
  shown,
  total,
}: {
  filters: SalesFilters;
  onChange: (patch: Partial<SalesFilters>) => void;
  shown: number;
  total: number;
}) {
  return (
    <Panel className="sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" /> Filtros de Segmentação
        </h2>
        <span className="text-xs text-muted-foreground">
          {shown === total
            ? `Exibindo todos os ${total} registros`
            : `Filtrado: ${shown} de ${total} registros`}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          label="Modelo do Veículo"
          value={filters.modelo}
          allLabel="Todos os Modelos"
          options={MODELOS.map((m) => ({ value: m, label: `Porsche ${m}` }))}
          onChange={(modelo) => onChange({ modelo })}
        />
        <FilterSelect
          label="Cidade / Estado"
          value={filters.cidade}
          allLabel="Todas as Regiões"
          options={CIDADES}
          onChange={(cidade) => onChange({ cidade })}
        />
        <FilterSelect
          label="Ano do Veículo"
          value={filters.ano}
          allLabel="Todos os Anos"
          options={ANOS.map((a) => ({ value: String(a), label: String(a) }))}
          onChange={(ano) => onChange({ ano })}
        />
        <FilterSelect
          label="Método de Pagamento"
          value={filters.pagamento}
          allLabel="Todas as Formas"
          options={PAGAMENTOS}
          onChange={(pagamento) => onChange({ pagamento })}
        />
      </div>
    </Panel>
  );
}
