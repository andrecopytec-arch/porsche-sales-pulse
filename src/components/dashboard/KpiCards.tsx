import type { ReactNode } from "react";
import { BadgeDollarSign, Calculator, CarFront, CircleCheck, Flame, Tag, TrendingUp, Trophy } from "lucide-react";
import { computeKpis, formatBRL } from "@/lib/porsche/analytics";
import type { Sale } from "@/lib/porsche/types";

const tones = {
  success: { chip: "bg-success/10 text-success", text: "text-success" },
  info: { chip: "bg-info/10 text-info", text: "text-info" },
  warning: { chip: "bg-warning/10 text-warning", text: "text-warning" },
  brand: { chip: "bg-brand-soft/10 text-brand-soft", text: "text-brand-soft" },
} as const;

function Kpi({
  label,
  value,
  icon,
  note,
  noteIcon,
  tone,
  small,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  note: string;
  noteIcon: ReactNode;
  tone: keyof typeof tones;
  small?: boolean;
}) {
  const t = tones[tone];
  return (
    <div className="glass-panel glass-hover relative overflow-hidden rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.chip}`}>{icon}</div>
      </div>
      <div className="mt-3">
        <h3
          className={`truncate font-extrabold tracking-tight text-foreground ${small ? "text-xl" : "text-2xl"}`}
        >
          {value}
        </h3>
        <p className={`mt-1 flex items-center gap-1 text-xs ${t.text}`}>
          {noteIcon} {note}
        </p>
      </div>
    </div>
  );
}

export function KpiCards({ data }: { data: Sale[] }) {
  const k = computeKpis(data);
  const i = "h-4 w-4";
  const n = "h-3 w-3";
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi
        label="Receita Total"
        value={formatBRL(k.revenue)}
        icon={<BadgeDollarSign className={i} />}
        note="Volume acumulado no recorte"
        noteIcon={<TrendingUp className={n} />}
        tone="success"
      />
      <Kpi
        label="Total de Vendas"
        value={`${k.count} un`}
        icon={<CarFront className={i} />}
        note="Transações concluídas"
        noteIcon={<CircleCheck className={n} />}
        tone="info"
      />
      <Kpi
        label="Preço Médio"
        value={formatBRL(k.avgPrice)}
        icon={<Tag className={i} />}
        note="Ticket médio por unidade"
        noteIcon={<Calculator className={n} />}
        tone="warning"
      />
      <Kpi
        label="Carro Mais Vendido"
        value={k.topModel ? `Porsche ${k.topModel}` : "-"}
        icon={<Trophy className={i} />}
        note={k.topModel ? `${k.topModelCount} unidades (${k.topModelShare}%)` : "Sem dados"}
        noteIcon={<Flame className={n} />}
        tone="brand"
        small
      />
    </section>
  );
}
