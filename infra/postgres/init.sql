CREATE TABLE IF NOT EXISTS farm_sites (
  id SERIAL PRIMARY KEY,
  name VARCHAR(140) NOT NULL,
  region VARCHAR(120) NOT NULL,
  hectares INTEGER NOT NULL,
  focus VARCHAR(120) NOT NULL,
  soil_moisture NUMERIC(5,2) NOT NULL,
  water_efficiency NUMERIC(5,2) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'operational',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_forecasts (
  id SERIAL PRIMARY KEY,
  crop VARCHAR(100) NOT NULL,
  season VARCHAR(80) NOT NULL,
  projected_yield_tons NUMERIC(12,2) NOT NULL,
  confidence NUMERIC(5,2) NOT NULL,
  demand_signal VARCHAR(40) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO farm_sites (name, region, hectares, focus, soil_moisture, water_efficiency, status)
VALUES
  ('Karoo Precision Hub', 'Northern Cape', 18400, 'Drought-resilient grains', 41.80, 88.20, 'operational'),
  ('Lowveld Citrus Estate', 'Mpumalanga', 6200, 'Citrus export orchards', 52.10, 91.40, 'operational'),
  ('Midlands Regenerative Block', 'KwaZulu-Natal', 9700, 'Rotational maize and legumes', 48.70, 84.90, 'operational'),
  ('Western Cape Controlled Climate Campus', 'Western Cape', 2400, 'Greenhouse vegetables', 64.20, 94.60, 'scaling')
ON CONFLICT DO NOTHING;

INSERT INTO crop_forecasts (crop, season, projected_yield_tons, confidence, demand_signal)
VALUES
  ('White maize', '2026 winter planning', 312000.00, 87.50, 'high'),
  ('Citrus', '2026 export window', 188500.00, 91.20, 'high'),
  ('Sorghum', '2026 dryland rotation', 76400.00, 82.10, 'stable'),
  ('Greenhouse tomatoes', '2026 continuous harvest', 42800.00, 93.30, 'rising')
ON CONFLICT DO NOTHING;

