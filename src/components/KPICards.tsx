import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Target, Lightbulb } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface KPICardsProps {
  totalSpend: number;
  projectedSpend: number;
  totalBudget: number;
  totalSavings: number;
  activeAlertsCount: number;
  trendPct: number;
}

export function KPICards({ totalSpend, projectedSpend, totalBudget, totalSavings, activeAlertsCount, trendPct }: KPICardsProps) {
  const budgetPct = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
  const projectedPct = totalBudget > 0 ? (projectedSpend / totalBudget) * 100 : 0;

  const cards = [
    {
      label: 'Current Month Spend',
      value: formatCurrency(totalSpend, true),
      icon: DollarSign,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      sub: (
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${trendPct >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
          {trendPct >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {formatPercent(trendPct)} vs last month
        </span>
      ),
    },
    {
      label: 'Projected Month-End',
      value: formatCurrency(projectedSpend, true),
      icon: Target,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      sub: (
        <span className={`text-xs font-medium ${projectedPct > 100 ? 'text-red-600' : 'text-slate-500'}`}>
          {projectedPct.toFixed(0)}% of total budget
        </span>
      ),
    },
    {
      label: 'Budget Utilization',
      value: `${budgetPct.toFixed(0)}%`,
      icon: Target,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      sub: (
        <div className="mt-1">
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div
              className={`h-1.5 rounded-full transition-all ${budgetPct > 90 ? 'bg-red-500' : budgetPct > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(budgetPct, 100)}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 mt-1 block">{formatCurrency(totalBudget, true)} total budget</span>
        </div>
      ),
    },
    {
      label: 'Potential Savings',
      value: formatCurrency(totalSavings, true),
      icon: Lightbulb,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      sub: <span className="text-xs font-medium text-slate-500">From open recommendations</span>,
    },
    {
      label: 'Active Alerts',
      value: String(activeAlertsCount),
      icon: AlertTriangle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      sub: <span className={`text-xs font-medium ${activeAlertsCount > 0 ? 'text-red-600' : 'text-slate-500'}`}>{activeAlertsCount > 0 ? 'Requires attention' : 'All clear'}</span>,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200/80 p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon size={20} className={card.iconColor} />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{card.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
            <div className="mt-2">{card.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
