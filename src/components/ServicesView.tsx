import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, Cloud, TrendingUp, TrendingDown } from 'lucide-react';
import type { ServiceWithCosts, Provider } from '@/types';
import { formatCurrency, formatPercent, PROVIDER_COLORS, STATUS_COLORS, CATEGORY_LABELS } from '@/lib/utils';
import { AreaChart } from '@/components/AreaChart';

interface ServicesViewProps {
  services: ServiceWithCosts[];
  provider: Provider | 'all';
}

type SortKey = 'service_name' | 'current_month_spend' | 'trend_pct' | 'budget_pct' | 'daily_avg';

export function ServicesView({ services, provider }: ServicesViewProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('current_month_spend');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...services];
    if (provider !== 'all') result = result.filter((s) => s.provider === provider);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.service_name.toLowerCase().includes(q) || s.region.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      let av: number | string = a[sortKey];
      let bv: number | string = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return result;
  }, [services, provider, search, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
    ) : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm font-bold text-slate-800">All Services</h3>
          <p className="text-xs text-slate-400">{filtered.length} services across {provider === 'all' ? 'all clouds' : provider}</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <button onClick={() => toggleSort('service_name')} className="flex items-center gap-1 hover:text-slate-600">
                  Service <SortIcon col="service_name" />
                </button>
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Provider</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Category</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <button onClick={() => toggleSort('current_month_spend')} className="flex items-center gap-1 hover:text-slate-600 ml-auto">
                  MTD Spend <SortIcon col="current_month_spend" />
                </button>
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <button onClick={() => toggleSort('trend_pct')} className="flex items-center gap-1 hover:text-slate-600 ml-auto">
                  Trend <SortIcon col="trend_pct" />
                </button>
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <button onClick={() => toggleSort('budget_pct')} className="flex items-center gap-1 hover:text-slate-600 ml-auto">
                  Budget <SortIcon col="budget_pct" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((svc) => {
              const colors = PROVIDER_COLORS[svc.provider];
              const statusColors = STATUS_COLORS[svc.status];
              const isExpanded = expanded === svc.id;
              return (
                <>
                  <tr
                    key={svc.id}
                    onClick={() => setExpanded(isExpanded ? null : svc.id)}
                    className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                          <Cloud size={15} className={colors.text} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-700 truncate">{svc.service_name}</p>
                          <p className="text-xs text-slate-400">{svc.region}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${colors.bg} ${colors.text}`}>
                        {svc.provider}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{CATEGORY_LABELS[svc.category]}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md ${statusColors.bg} ${statusColors.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
                        {svc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatCurrency(svc.current_month_spend, true)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${svc.trend_pct >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {svc.trend_pct >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {formatPercent(svc.trend_pct)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-20 h-1.5 rounded-full bg-slate-100">
                          <div
                            className={`h-1.5 rounded-full ${svc.budget_pct > 90 ? 'bg-red-500' : svc.budget_pct > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(svc.budget_pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-500 w-10 text-right">{svc.budget_pct.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={svc.id + '-exp'} className="border-b border-slate-100 bg-slate-50/30">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white rounded-lg border border-slate-100 p-3">
                            <p className="text-xs text-slate-400">Daily Average</p>
                            <p className="text-lg font-bold text-slate-800">{formatCurrency(svc.daily_avg)}</p>
                          </div>
                          <div className="bg-white rounded-lg border border-slate-100 p-3">
                            <p className="text-xs text-slate-400">Monthly Budget</p>
                            <p className="text-lg font-bold text-slate-800">{formatCurrency(svc.monthly_budget)}</p>
                          </div>
                          <div className="bg-white rounded-lg border border-slate-100 p-3">
                            <p className="text-xs text-slate-400">Projected Month-End</p>
                            <p className="text-lg font-bold text-slate-800">{formatCurrency(svc.daily_avg * 30, true)}</p>
                          </div>
                          <div className="bg-white rounded-lg border border-slate-100 p-3">
                            <p className="text-xs text-slate-400">Remaining Budget</p>
                            <p className={`text-lg font-bold ${svc.monthly_budget - svc.current_month_spend < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                              {formatCurrency(svc.monthly_budget - svc.current_month_spend, true)}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border border-slate-100 p-3">
                          <p className="text-xs text-slate-400 mb-2">90-Day Cost History</p>
                          <AreaChart data={svc.cost_history} height={140} color={colors.solid} />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-slate-400">No services match your search.</div>
      )}
    </div>
  );
}
