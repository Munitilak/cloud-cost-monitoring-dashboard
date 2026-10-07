import type { Provider } from '@/types';
import { formatCurrency, PROVIDER_COLORS, CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/utils';
import { AreaChart } from '@/components/AreaChart';
import { DonutChart } from '@/components/DonutChart';
import type { ServiceWithCosts } from '@/types';
import { Cloud, Server, HardDrive, Wifi, Database, BrainCircuit } from 'lucide-react';

interface OverviewViewProps {
  services: ServiceWithCosts[];
  costEntries: { date: string; cost: number; service_id: string }[];
  totalSpend: number;
  projectedSpend: number;
  totalBudget: number;
  totalSavings: number;
  activeAlertsCount: number;
  trendPct: number;
  provider: Provider | 'all';
}

const CATEGORY_ICONS: Record<string, typeof Server> = {
  compute: Server,
  storage: HardDrive,
  network: Wifi,
  database: Database,
  ai: BrainCircuit,
};

export function OverviewView({
  services,
  costEntries,
  totalSpend,
  totalBudget,
  totalSavings,
  activeAlertsCount,
  trendPct,
  provider,
}: OverviewViewProps) {
  // Aggregate daily costs across all filtered services
  const dailyMap: Record<string, number> = {};
  const serviceIds = new Set(services.map((s) => s.id));
  for (const entry of costEntries) {
    if (!serviceIds.has(entry.service_id)) continue;
    dailyMap[entry.date] = (dailyMap[entry.date] || 0) + Number(entry.cost);
  }
  const trendData = Object.entries(dailyMap)
    .map(([date, cost]) => ({ date, cost }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Category breakdown for donut
  const categoryMap: Record<string, number> = {};
  for (const svc of services) {
    categoryMap[svc.category] = (categoryMap[svc.category] || 0) + svc.current_month_spend;
  }
  const donutData = Object.entries(categoryMap).map(([key, value]) => ({
    label: CATEGORY_LABELS[key] || key,
    value,
    color: CATEGORY_COLORS[key] || '#94a3b8',
  }));

  // Provider breakdown
  const providerMap: Record<string, number> = {};
  for (const svc of services) {
    providerMap[svc.provider] = (providerMap[svc.provider] || 0) + svc.current_month_spend;
  }

  // Top services by spend
  const topServices = [...services].sort((a, b) => b.current_month_spend - a.current_month_spend).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Trend + Category breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Cost Trend</h3>
              <p className="text-xs text-slate-400">Daily spend across all services (90 days)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-500 font-medium">Daily Cost</span>
            </div>
          </div>
          <AreaChart data={trendData} height={240} color="#3b82f6" />
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Spend by Category</h3>
          <p className="text-xs text-slate-400 mb-4">Current month breakdown</p>
          <div className="flex items-center justify-center flex-1">
            <DonutChart
              data={donutData}
              size={180}
              centerValue={formatCurrency(totalSpend, true)}
              centerLabel="Total"
            />
          </div>
          <div className="space-y-2 mt-4">
            {donutData
              .sort((a, b) => b.value - a.value)
              .map((d) => {
                const catKey = Object.keys(CATEGORY_LABELS).find((k) => CATEGORY_LABELS[k] === d.label);
                const Icon = (catKey && CATEGORY_ICONS[catKey]) || Server;
                return (
                  <div key={d.label} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <Icon size={13} className="text-slate-400" />
                    <span className="flex-1 text-slate-600">{d.label}</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(d.value, true)}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Provider breakdown + Top services */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Spend by Provider</h3>
          <p className="text-xs text-slate-400 mb-4">Current month distribution</p>
          <div className="space-y-4">
            {Object.entries(providerMap).map(([p, val]) => {
              const colors = PROVIDER_COLORS[p];
              const pct = totalSpend > 0 ? (val / totalSpend) * 100 : 0;
              return (
                <div key={p}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Cloud size={15} className={colors?.text} />
                      <span className="text-sm font-medium text-slate-700">{p}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{formatCurrency(val, true)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: colors?.solid }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{pct.toFixed(1)}% of total spend</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Top Services by Spend</h3>
              <p className="text-xs text-slate-400">Highest cost services this month</p>
            </div>
          </div>
          <div className="space-y-3">
            {topServices.map((svc, i) => {
              const colors = PROVIDER_COLORS[svc.provider];
              const maxSpend = topServices[0]?.current_month_spend || 1;
              return (
                <div key={svc.id} className="flex items-center gap-3 group">
                  <span className="text-xs font-bold text-slate-300 w-5">{i + 1}</span>
                  <div className={`w-8 h-8 rounded-lg ${colors?.bg} flex items-center justify-center shrink-0`}>
                    <Cloud size={15} className={colors?.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-700 truncate">{svc.service_name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors?.bg} ${colors?.text}`}>{svc.provider}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(svc.current_month_spend / maxSpend) * 100}%`, backgroundColor: colors?.solid }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-800">{formatCurrency(svc.current_month_spend, true)}</span>
                    <span className={`block text-[10px] font-medium ${svc.trend_pct >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {svc.trend_pct >= 0 ? '+' : ''}{svc.trend_pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
