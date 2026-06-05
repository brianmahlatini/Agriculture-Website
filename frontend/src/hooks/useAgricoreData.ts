// This hook centralizes API loading so page components stay focused on layout and content.
import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Droplets, RadioTower, Tractor } from 'lucide-react';
import { getImpactStories, getOperationsOverview } from '../api';
import type { ImpactStory, OperationsOverview } from '../types';
import { formatNumber } from '../utils/formatters';

export function useAgricoreData() {
  const [overview, setOverview] = useState<OperationsOverview | null>(null);
  const [stories, setStories] = useState<ImpactStory[]>([]);

  useEffect(() => {
    let mounted = true;

    void Promise.all([getOperationsOverview(), getImpactStories()]).then(([operations, impact]) => {
      if (!mounted) {
        return;
      }

      setOverview(operations);
      setStories(impact);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(
    () => [
      {
        label: 'managed hectares',
        value: overview ? formatNumber(overview.metrics.totalHectares) : '36,700',
        icon: Tractor
      },
      {
        label: 'water efficiency',
        value: `${overview?.metrics.avgWaterEfficiency ?? 89.8}%`,
        icon: Droplets
      },
      {
        label: 'forecast tonnes',
        value: overview ? formatNumber(overview.metrics.projectedYield) : '619,700',
        icon: BarChart3
      },
      {
        label: 'operating hubs',
        value: `${overview?.metrics.activeSites ?? 4}`,
        icon: RadioTower
      }
    ],
    [overview]
  );

  return { overview, stories, metrics };
}

