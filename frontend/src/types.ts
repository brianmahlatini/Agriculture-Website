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

export type Role = 'ADMIN' | 'USER';

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  company: string;
  role: Role;
  status: 'ACTIVE' | 'SUSPENDED';
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type BookingStatus = 'REQUESTED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Booking = {
  _id: string;
  user?: AuthUser;
  service: string;
  farmName: string;
  region: string;
  hectares: number;
  preferredDate: string;
  notes: string;
  status: BookingStatus;
  cancellationReason?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Lead = {
  _id: string;
  name: string;
  email: string;
  company: string;
  acreage: string;
  interest: string;
  message: string;
  source: string;
  createdAt: string;
};

export type AdminOverview = {
  metrics: {
    users: number;
    leads: number;
    bookings: number;
    activeBookings: number;
    cancelledBookings: number;
    managedHectares: number;
    projectedYield: number;
  };
  statusBreakdown: Array<{ _id: BookingStatus; count: number }>;
  recentLeads: Lead[];
  users: AuthUser[];
  operations: OperationsOverview;
};
