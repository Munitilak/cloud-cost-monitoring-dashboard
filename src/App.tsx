import { useState, useMemo } from 'react';
import { Cloud, RefreshCw, AlertCircle } from 'lucide-react';
import { useCloudData } from '@/lib/useCloudData';
import type { Provider, Alert, Recommendation } from '@/types';
import { Sidebar, MobileNav, type View } from '@/components/Sidebar';
import { KPICards } from '@/components/KPICards';
import { ProviderFilter } from '@/components/ProviderFilter';
import { OverviewView } from '@/components/OverviewView';
import { ServicesView } from '@/components/ServicesView';
import { BudgetsView } from '@/components/BudgetsView';
import { AlertsView } from '@/components/AlertsView';
import { RecommendationsView } from '@/components/RecommendationsView';
import { formatCurrency } from '@/lib/utils';

const VIEW_TITLES: Record<View, { title: string; subtitle: string }> = {
  overview: { title: 'Dashboard Overview', subtitle: 'Monitor your cloud spending across all providers' },
  services: { title: 'Services', subtitle: 'Detailed cost breakdown per cloud service' },
  budgets: { title: 'Budget Tracking', subtitle: 'Monthly spend vs allocated budgets' },
  alerts: { title: 'Alerts', subtitle: 'Budget warnings, anomalies, and unused resources' },
  recommendations: { title: 'Recommendations', subtitle: 'Cost optimization opportunities and actions' },
};

function App() {
  const [view, setView] = useState<View>('overview');
  const [provider, setProvider] = useState<Provider | 'all'>('all');
  const {
    servicesWithCosts,
    costEntries,
    alerts,
    recommendations,
    loading,
    error,
    refetch,
  } = useCloudData();

  const providerCounts = useMemo(() => {
    const counts: Record<string, number> = { all: servicesWithCosts.length };
    for (const svc of servicesWithCosts) {
      counts[svc.provider] = (counts[svc.provider] || 0) + 1;
    }
    return counts;
  }, [servicesWithCosts]);

  const filteredServices = useMemo(
    () => (provider === 'all' ? servicesWithCosts : servicesWithCosts.filter((s) => s.provider === provider)),
    [servicesWithCosts, provider]
  );

  const filteredCostEntries = useMemo(() => {
    if (provider === 'all') return costEntries.map((e) => ({ date: e.date, cost: Number(e.cost), service_id: e.service_id }));
    const ids = new Set(filteredServices.map((s) => s.id));
    return costEntries.filter((e) => ids.has(e.service_id)).map((e) => ({ date: e.date, cost: Number(e.cost), service_id: e.service_id }));
  }, [costEntries, filteredServices, provider]);

  const filteredSpend = useMemo(
    () => filteredServices.reduce((s, svc) => s + svc.current_month_spend, 0),
    [filteredServices]
  );

  const filteredBudget = useMemo(
    () => filteredServices.reduce((s, svc) => s + Number(svc.monthly_budget), 0),
    [filteredServices]
  );

  const filteredProjected = useMemo(() => {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    if (dayOfMonth === 0) return 0;
    return (filteredSpend / dayOfMonth) * daysInMonth;
  }, [filteredSpend]);

  const filteredTrendPct = useMemo(() => {
    const prev = filteredServices.reduce((s, svc) => s + svc.previous_month_spend, 0);
    const curr = filteredServices.reduce((s, svc) => s + svc.current_month_spend, 0);
    return prev > 0 ? ((curr - prev) / prev) * 100 : 0;
  }, [filteredServices]);

  const filteredAlerts: Alert[] = useMemo(() => {
    if (provider === 'all') return alerts;
    const ids = new Set(filteredServices.map((s) => s.id));
    return alerts.filter((a) => ids.has(a.service_id));
  }, [alerts, filteredServices, provider]);

  const filteredActiveAlerts = useMemo(() => filteredAlerts.filter((a) => !a.resolved), [filteredAlerts]);

  const filteredRecommendations: Recommendation[] = useMemo(() => {
    if (provider === 'all') return recommendations;
    const ids = new Set(filteredServices.map((s) => s.id));
    return recommendations.filter((r) => ids.has(r.service_id));
  }, [recommendations, filteredServices, provider]);

  const filteredSavings = useMemo(
    () => filteredRecommendations.filter((r) => r.status === 'open').reduce((s, r) => s + Number(r.potential_savings), 0),
    [filteredRecommendations]
  );

  const headerInfo = VIEW_TITLES[view];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Cloud size={24} className="text-white" />
          </div>
          <p className="text-sm text-slate-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">Failed to load data</p>
          <p className="text-xs text-slate-400 mb-4">{error}</p>
          <button onClick={refetch} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar view={view} onViewChange={setView} alertCount={filteredActiveAlerts.length} />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-200/80 h-16 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Cloud size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">{headerInfo.title}</h2>
              <p className="text-xs text-slate-400 leading-tight hidden sm:block">{headerInfo.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50">
              <span className="text-xs text-slate-400">MTD Total</span>
              <span className="text-sm font-bold text-slate-800">{formatCurrency(filteredSpend, true)}</span>
            </div>
            <button
              onClick={refetch}
              className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={16} className="text-slate-500" />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Provider filter */}
          {view !== 'alerts' && view !== 'recommendations' && (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <ProviderFilter selected={provider} onChange={setProvider} counts={providerCounts} />
            </div>
          )}
          {view === 'alerts' && (
            <ProviderFilter selected={provider} onChange={setProvider} counts={providerCounts} />
          )}
          {view === 'recommendations' && (
            <ProviderFilter selected={provider} onChange={setProvider} counts={providerCounts} />
          )}

          {/* KPI cards - only on overview */}
          {view === 'overview' && (
            <KPICards
              totalSpend={filteredSpend}
              projectedSpend={filteredProjected}
              totalBudget={filteredBudget}
              totalSavings={filteredSavings}
              activeAlertsCount={filteredActiveAlerts.length}
              trendPct={filteredTrendPct}
            />
          )}

          {/* Views */}
          {view === 'overview' && (
            <OverviewView
              services={filteredServices}
              costEntries={filteredCostEntries}
              totalSpend={filteredSpend}
              projectedSpend={filteredProjected}
              totalBudget={filteredBudget}
              totalSavings={filteredSavings}
              activeAlertsCount={filteredActiveAlerts.length}
              trendPct={filteredTrendPct}
              provider={provider}
            />
          )}
          {view === 'services' && <ServicesView services={filteredServices} provider={provider} />}
          {view === 'budgets' && <BudgetsView services={filteredServices} provider={provider} />}
          {view === 'alerts' && (
            <AlertsView alerts={filteredAlerts} services={servicesWithCosts} provider={provider} onRefresh={refetch} />
          )}
          {view === 'recommendations' && (
            <RecommendationsView
              recommendations={filteredRecommendations}
              services={servicesWithCosts}
              provider={provider}
              onRefresh={refetch}
            />
          )}
        </main>
      </div>

      <MobileNav view={view} onViewChange={setView} alertCount={filteredActiveAlerts.length} />
    </div>
  );
}

export default App;
