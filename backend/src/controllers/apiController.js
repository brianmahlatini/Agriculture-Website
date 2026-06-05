// Root API controller returns discoverability metadata for clients and uptime checks.
import { apiResources } from '../constants/apiResources.js';

export function getApiIndex(_req, res) {
  res.json({
    name: 'Agricore Enterprise API',
    version: '1.0.0',
    resources: apiResources
  });
}

