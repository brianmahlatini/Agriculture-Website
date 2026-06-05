// Shared frontend types mirror API response shapes and keep component props type-safe.
export type FarmSite = {
  id: number;
  name: string;
  region: string;
  hectares: number;
  focus: string;
  soil_moisture: string;
  water_efficiency: string;
  status: string;
};

export type CropForecast = {
  id: number;
  crop: string;
  season: string;
  projected_yield_tons: string;
  confidence: string;
  demand_signal: string;
};

export type OperationsOverview = {
  metrics: {
    totalHectares: number;
    avgWaterEfficiency: number;
    projectedYield: number;
    activeSites: number;
  };
  sites: FarmSite[];
  forecasts: CropForecast[];
};

export type ImpactStory = {
  _id: string;
  title: string;
  region: string;
  metric: string;
  summary: string;
  category: string;
};
