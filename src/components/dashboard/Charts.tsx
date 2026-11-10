import { CreditCard, Info, MapPin } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { byCity, byModel, formatBRL, PAGAMENTOS, paymentsByYear } from "@/lib/porsche/analytics";
import type { Sale } from "@/lib/porsche/types";
import { Insight, Panel, QuestionHeader } from "./Panel";

const axis = { fill: "var(--muted-foreground)", fontSize: 11 };
const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    fontSize: 12,
    color: "var(--popover-foreground)",
  },
  labelStyle: { color: "var(--popover-foreground)", fontWeight: 600 },
  itemStyle: { color: "var(--popover-foreground)" },
  cursor: { fill: "var(--chart-grid)" },
};
const legendStyle = { fontSize: 11, color: "var(--muted-foreground)" };

const CITY_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const PAY_COLORS: Record<string, string> = {
  PIX: "var(--pay-pix)",
  Financiamento: "var(--pay-financiamento)",
  Transferência: "var(--pay-transferencia)",
  "Cartão de Crédito": "var(--pay-cartao)",
};

export function ModelChart({ data }: { data: Sale[] }) {
  return (
    <Panel className="flex flex-col justify-between lg:col-span-2">
      <div>
        <QuestionHeader
          number={1}
          title="Qual o desempenho financeiro e volume por Modelo?"
          description="Comparativo direto de Receita Bruta (R$) e Quantidade comercializada de cada modelo."
        />
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byModel(data)} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="modelo" tick={axis} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="receita"
                tick={axis}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `R$ ${(v / 1_000_000).toFixed(1)}M`}
                width={84}
              />
              <YAxis yAxisId="unidades" orientation="right" tick={axis} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                {...tooltipStyle}
                formatter={(v: number, name: string) =>
                  name === "Receita Total (R$)" ? [formatBRL(v), "Receita"] : [`${v} veículos`, "Unidades"]
                }
              />
              <Legend wrapperStyle={legendStyle} />
              <Bar yAxisId="receita" dataKey="receita" name="Receita Total (R$)" fill="var(--chart-revenue)" fillOpacity={0.8} radius={[6, 6, 0, 0]} />
              <Bar yAxisId="unidades" dataKey="unidades" name="Unidades Vendidas" fill="var(--chart-volume)" fillOpacity={0.8} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Insight icon={<Info className="h-4 w-4 text-info" />}>
        <strong>Insight:</strong> O <strong>Porsche 911</strong> gera maior ticket absoluto, enquanto SUVs como{" "}
        <strong>Macan</strong> garantem liquidez em volume.
      </Insight>
    </Panel>
  );
}

export function CityChart({ data }: { data: Sale[] }) {
  const rows = byCity(data);
  const total = rows.reduce((a, r) => a + r.receita, 0);
  return (
    <Panel className="flex flex-col justify-between">
      <div>
        <QuestionHeader
          number={2}
          title="Participação por Cidade / Estado?"
          description="Distribuição percentual do faturamento total entre os principais polos regionais."
        />
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rows}
                dataKey="receita"
                nameKey="cidade"
                innerRadius="62%"
                outerRadius="90%"
                stroke="var(--card)"
                strokeWidth={2}
              >
                {rows.map((r, i) => (
                  <Cell key={r.cidade} fill={CITY_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                {...tooltipStyle}
                formatter={(v: number, name: string) => [
                  `${formatBRL(v)} (${total > 0 ? ((v / total) * 100).toFixed(1) : 0}%)`,
                  name,
                ]}
              />
              <Legend wrapperStyle={{ ...legendStyle, fontSize: 10 }} iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Insight icon={<MapPin className="h-4 w-4 text-success" />}>
        <strong>Insight:</strong> <strong>São Paulo</strong> concentra o maior volume comprador premium da marca.
      </Insight>
    </Panel>
  );
}

export function PaymentsChart({ data }: { data: Sale[] }) {
  return (
    <Panel className="lg:col-span-3">
      <QuestionHeader
        number={3}
        title="Como as formas de pagamento evoluíram por Ano do veículo?"
        description="Análise de adoção de Pix, Financiamento e Transferências em cada ano-modelo."
      />
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={paymentsByYear(data)} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="ano" tick={axis} axisLine={false} tickLine={false} />
            <YAxis tick={axis} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
            <Tooltip {...tooltipStyle} formatter={(v: number, name: string) => [`${v} transações`, name]} />
            <Legend wrapperStyle={legendStyle} />
            {PAGAMENTOS.map((p, i) => (
              <Bar
                key={p.value}
                dataKey={p.value}
                stackId="pay"
                fill={PAY_COLORS[p.value]}
                radius={i === PAGAMENTOS.length - 1 ? [4, 4, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Insight icon={<CreditCard className="h-4 w-4 text-warning" />}>
        <strong>Insight:</strong> Modalidades como <strong>PIX à vista</strong> ganharam destaque representativo em
        vendas recentes de seminovos de alto luxo.
      </Insight>
    </Panel>
  );
}
