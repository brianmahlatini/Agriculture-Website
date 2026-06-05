// Operations renders PostgreSQL-backed farm and forecast data in a scannable executive view.
import { Sprout } from 'lucide-react';
import type { OperationsOverview } from '../types';
import { formatNumber, formatPercent } from '../utils/formatters';

type OperationsSectionProps = {
  overview: OperationsOverview | null;
};

export function OperationsSection({ overview }: OperationsSectionProps) {
  return (
    <section className="section operations" id="operations">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Operating network</p>
          <h2>Commercial farms, controlled climate campuses, and resilient rotations.</h2>
        </div>
        <p>PostgreSQL powers structured farm-site and crop forecast data for the enterprise API.</p>
      </div>

      <div className="operations-grid">
        <div className="site-table" aria-label="Farm operating sites">
          <div className="table-row table-head">
            <span>Site</span>
            <span>Region</span>
            <span>Hectares</span>
            <span>Water</span>
          </div>
          {(overview?.sites ?? []).map((site) => (
            <div className="table-row" key={site.id}>
              <strong>{site.name}</strong>
              <span>{site.region}</span>
              <span>{formatNumber(site.hectares)}</span>
              <span>{formatPercent(site.water_efficiency)}</span>
            </div>
          ))}
        </div>

        <div className="forecast-panel">
          <div className="panel-title">
            <Sprout size={21} />
            <strong>Crop forecast</strong>
          </div>
          {(overview?.forecasts ?? []).map((forecast) => (
            <article className="forecast" key={forecast.id}>
              <div>
                <strong>{forecast.crop}</strong>
                <span>{forecast.season}</span>
              </div>
              <div>
                <strong>{formatNumber(forecast.projected_yield_tons)}t</strong>
                <span>{formatPercent(forecast.confidence)} confidence</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

