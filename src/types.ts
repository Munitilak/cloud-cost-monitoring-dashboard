export type Provider = 'AWS' | 'GCP' | 'Azure';
export type Category = 'compute' | 'storage' | 'network' | 'database' | 'ai';
export type ServiceStatus = 'active' | 'idle' | 'underutilized';
export type AlertType = 'budget_warning' | 'budget_exceeded' | 'anomaly' | 'unused_resource';
export type AlertSeverity = 'warning' | 'critical';
export type RecType = 'rightsizing' | 'reservation' | 'terminate' | 'schedule';
export type RecStatus = 'open' | 'applied' | 'dismissed';

export interface CloudService {
  id: string;
  provider: Provider;
  service_name: string;
  category: Category;
  region: string;
  status: ServiceStatus;
  monthly_budget: number;
  icon: string | null;
  created_at: string;
}

export interface CostEntry {
  id: string;
  service_id: string;
  date: string;
  cost: number;
  usage_hours: number;
}

export interface Alert {
  id: string;
  service_id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  resolved: boolean;
  created_at: string;
}

export interface Recommendation {
  id: string;
  service_id: string;
  type: RecType;
  description: string;
  potential_savings: number;
  status: RecStatus;
  created_at: string;
}

export interface ServiceWithCosts extends CloudService {
  current_month_spend: number;
  previous_month_spend: number;
  daily_avg: number;
  trend_pct: number;
  budget_pct: number;
  cost_history: { date: string; cost: number }[];
}
