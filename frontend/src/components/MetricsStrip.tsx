// Metrics are data-driven cards, separated so the dashboard strip can be reused later.
import type { LucideIcon } from 'lucide-react';

type Metric = {
  label: string;
  value: string;
  icon: LucideIcon;
};

type MetricsStripProps = {
  metrics: Metric[];
};

export function MetricsStrip({ metrics }: MetricsStripProps) {
  return (
    <section className="metrics-strip" aria-label="Agricore operating metrics">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <article className="metric" key={metric.label}>
            <Icon size={22} />
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        );
      })}
    </section>
  );
}

