// Operations service aggregates PostgreSQL site and forecast data into dashboard-ready metrics.
import { query } from '../db/postgres.js';

export async function getOperationsOverview() {
  const [sitesResult, forecastsResult] = await Promise.all([
    query('SELECT * FROM farm_sites ORDER BY hectares DESC'),
    query('SELECT * FROM crop_forecasts ORDER BY confidence DESC')
  ]);

  const sites = sitesResult.rows;
  const forecasts = forecastsResult.rows;
  const totalHectares = sites.reduce((sum, site) => sum + Number(site.hectares), 0);
  const avgWaterEfficiency =
    sites.reduce((sum, site) => sum + Number(site.water_efficiency), 0) / Math.max(sites.length, 1);
  const projectedYield = forecasts.reduce(
    (sum, forecast) => sum + Number(forecast.projected_yield_tons),
    0
  );

  return {
    metrics: {
      totalHectares,
      avgWaterEfficiency: Number(avgWaterEfficiency.toFixed(1)),
      projectedYield,
      activeSites: sites.length
    },
    sites,
    forecasts
  };
}
