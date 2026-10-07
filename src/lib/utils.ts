export function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function daysAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
}

export const PROVIDER_COLORS: Record<string, { bg: string; text: string; border: string; solid: string }> = {
  AWS: { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/30', solid: '#f97316' },
  GCP: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/30', solid: '#3b82f6' },
  Azure: { bg: 'bg-sky-500/10', text: 'text-sky-600', border: 'border-sky-500/30', solid: '#0ea5e9' },
};

export const CATEGORY_COLORS: Record<string, string> = {
  compute: '#6366f1',
  storage: '#10b981',
  network: '#f59e0b',
  database: '#ec4899',
  ai: '#8b5cf6',
};

export const CATEGORY_LABELS: Record<string, string> = {
  compute: 'Compute',
  storage: 'Storage',
  network: 'Network',
  database: 'Database',
  ai: 'AI & Analytics',
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  idle: { bg: 'bg-slate-400/10', text: 'text-slate-600', dot: 'bg-slate-400' },
  underutilized: { bg: 'bg-amber-500/10', text: 'text-amber-700', dot: 'bg-amber-500' },
};

export const SEVERITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export const REC_TYPE_LABELS: Record<string, string> = {
  rightsizing: 'Right-size',
  reservation: 'Reserve',
  terminate: 'Terminate',
  schedule: 'Schedule',
};

export const ALERT_TYPE_LABELS: Record<string, string> = {
  budget_warning: 'Budget Warning',
  budget_exceeded: 'Budget Exceeded',
  anomaly: 'Anomaly Detected',
  unused_resource: 'Unused Resource',
};
