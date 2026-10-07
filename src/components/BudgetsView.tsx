import type { ServiceWithCosts, Provider } from '@/types';
import { formatCurrency, PROVIDER_COLORS } from '@/lib/utils';
import { Cloud, TrendingUp, TrendingDown } from 'lucide-react';

interface BudgetsViewProps {
  services: ServiceWithCosts[];
  provider: Provider | 'all';
}

export function BudgetsView({ services, provider }: BudgetsViewProps) {
  const filtered = provider === 'all' ? services : services.filter((s) => s.provider === provider);

  const totalBudget = filtered.reduce((s, svc) => s + Number(svc.monthly_budget), 0);
  const totalSpend = filtered.reduce((s, svc) => s + svc.current_month_spend, 0);
  const overBudget = filtered.filter((s) => s.budget_pct > 100);
  const nearBudget = filtered.filter((s) => s.budget_pct > 75 && s.budget_pct <= 100);
  const healthy = filtered.filter((s) => s.budget_pct <= 75);

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Budget Overview</h3>
            <p className="text-xs text-slate-400">Tracking monthly spend against allocated budgets</p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-slate-400">Total Budget</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(totalBudget, true)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Spent</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(totalSpend, true)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Remaining</p>
              <p className={`text-xl font-bold ${totalBudget - totalSpend < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatCurrency(totalBudget - totalSpend, true)}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 h-3 rounded-full bg-slate-100 overflow-hidden flex">
          {overBudget.length > 0 && (
            <div className="bg-red-500" style={{ width: `${(overBudget.length / filtered.length) * 100}%` }} title="Over budget" />
          )}
          {nearBudget.length > 0 && (
            <div className="bg-amber-500" style={{ width: `${(nearBudget.length / filtered.length) * 100}%` }} title="Near limit" />
          )}
          {healthy.length > 0 && (
            <div className="bg-emerald-500" style={{ width: `${(healthy.length / filtered.length) * 100}%` }} title="Healthy" />
          )}
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy ({healthy.length})</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Near Limit ({nearBudget.length})</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Over Budget ({overBudget.length})</span>
        </div>
      </div>

      {/* Budget cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered
          .sort((a, b) => b.budget_pct - a.budget_pct)
          .map((svc) => {
            const colors = PROVIDER_COLORS[svc.provider];
            const pct = svc.budget_pct;
            const over = pct > 100;
            const near = pct > 75 && pct <= 100;
            const barColor = over ? 'bg-red-500' : near ? 'bg-amber-500' : 'bg-emerald-500';
            const remaining = svc.monthly_budget - svc.current_month_spend;

            return (
              <div key={svc.id} className="bg-white rounded-xl border border-slate-200/80 p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Cloud size={16} className={colors.text} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{svc.service_name}</p>
                      <p className="text-xs text-slate-400">{svc.provider} · {svc.region}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${over ? 'bg-red-50 text-red-600' : near ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {pct.toFixed(0)}%
                  </span>
                </div>

                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-xs text-slate-400">Spent</p>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(svc.current_month_spend, true)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Budget</p>
                    <p className="text-sm font-semibold text-slate-600">{formatCurrency(svc.monthly_budget, true)}</p>
                  </div>
                </div>

                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden mb-3">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${remaining < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                    {remaining < 0 ? `${formatCurrency(Math.abs(remaining), true)} over` : `${formatCurrency(remaining, true)} left`}
                  </span>
                  <span className={`inline-flex items-center gap-1 font-medium ${svc.trend_pct >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {svc.trend_pct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {svc.trend_pct >= 0 ? '+' : ''}{svc.trend_pct.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
