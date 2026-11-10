import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("glass-panel rounded-2xl p-5", className)}>{children}</section>;
}

export function QuestionHeader({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-brand-soft">
        Pergunta de Negócio #{number}
      </span>
      <h3 className="mt-0.5 text-lg font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function Insight({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface-sunken/60 p-3 text-xs text-muted-foreground">
      <span className="shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
