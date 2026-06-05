// API client wraps backend calls and provides fallbacks so the UI remains useful during outages.
import type { ImpactStory, OperationsOverview } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

export const fallbackOverview: OperationsOverview = {
  metrics: {
    totalHectares: 36700,
    avgWaterEfficiency: 89.8,
    projectedYield: 619700,
    activeSites: 4
  },
  sites: [
    {
      id: 1,
      name: 'Karoo Precision Hub',
      region: 'Northern Cape',
      hectares: 18400,
      focus: 'Drought-resilient grains',
      soil_moisture: '41.80',
      water_efficiency: '88.20',
      status: 'operational'
    },
    {
      id: 2,
      name: 'Lowveld Citrus Estate',
      region: 'Mpumalanga',
      hectares: 6200,
      focus: 'Citrus export orchards',
      soil_moisture: '52.10',
      water_efficiency: '91.40',
      status: 'operational'
    },
    {
      id: 3,
      name: 'Western Cape Controlled Climate Campus',
      region: 'Western Cape',
      hectares: 2400,
      focus: 'Greenhouse vegetables',
      soil_moisture: '64.20',
      water_efficiency: '94.60',
      status: 'scaling'
    }
  ],
  forecasts: [
    {
      id: 1,
      crop: 'White maize',
      season: '2026 winter planning',
      projected_yield_tons: '312000.00',
      confidence: '87.50',
      demand_signal: 'high'
    },
    {
      id: 2,
      crop: 'Citrus',
      season: '2026 export window',
      projected_yield_tons: '188500.00',
      confidence: '91.20',
      demand_signal: 'high'
    },
    {
      id: 3,
      crop: 'Greenhouse tomatoes',
      season: '2026 continuous harvest',
      projected_yield_tons: '42800.00',
      confidence: '93.30',
      demand_signal: 'rising'
    }
  ]
};

export const fallbackStories: ImpactStory[] = [
  {
    _id: 'water',
    title: 'Water-smart citrus expansion',
    region: 'Mpumalanga',
    metric: '31% lower water draw',
    summary: 'Sensor-led irrigation scheduling reduced abstraction while protecting export-grade fruit consistency.',
    category: 'Water stewardship'
  },
  {
    _id: 'soil',
    title: 'Regenerative maize rotation',
    region: 'KwaZulu-Natal',
    metric: '18% soil carbon lift',
    summary: 'Legume rotations and residue retention improved soil structure across commercial maize blocks.',
    category: 'Soil health'
  },
  {
    _id: 'greenhouse',
    title: 'Greenhouse yield command',
    region: 'Western Cape',
    metric: '2.7x yield density',
    summary: 'Controlled climate production increased tonnage per hectare and stabilized supply contracts.',
    category: 'Controlled environment'
  }
];

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getOperationsOverview() {
  return getJson<OperationsOverview>('/operations/overview', fallbackOverview);
}

export async function getImpactStories() {
  const response = await getJson<{ stories: ImpactStory[] }>('/content/impact', {
    stories: fallbackStories
  });

  return response.stories;
}

export async function submitLead(payload: Record<string, FormDataEntryValue>) {
  const response = await fetch(`${API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Unable to submit the partnership request');
  }

  return response.json();
}
