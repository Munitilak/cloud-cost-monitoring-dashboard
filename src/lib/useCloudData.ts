import { useEffect, useState, useMemo } from 'react';
import { supabase } from './supabase';
import type { CloudService, CostEntry, Alert, Recommendation, ServiceWithCosts } from '@/types';

const PAGE_SIZE = 1000;

async function fetchAllCostEntries(): Promise<CostEntry[]> {
  let all: CostEntry[] = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from('cost_entries')
      .select('*')
      .order('date', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all = all.concat(data as CostEntry[]);
    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return all;
}

export function useCloudData() {
  const [services, setServices] = useState<CloudService[]>([]);
  const [costEntries, setCostEntries] = useState<CostEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [costData, svcRes, alertRes, recRes] = await Promise.all([
        fetchAllCostEntries(),
        supabase.from('cloud_services').select('*').order('provider, service_name'),
        supabase.from('alerts').select('*').order('created_at', { ascending: false }),
        supabase.from('recommendations').select('*').order('potential_savings', { ascending: false }),
      ]);

      if (svcRes.error) throw svcRes.error;
      if (alertRes.error) throw alertRes.error;
      if (recRes.error) throw recRes.error;

      setServices(svcRes.data as CloudService[]);
      setCostEntries(costData);
      setAlerts(alertRes.data as Alert[]);
      setRecommendations(recRes.data as Recommendation[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const servicesWithCosts = useMemo<ServiceWithCosts[]>(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    return services.map((svc) => {
      const entries = costEntries.filter((e) => e.service_id === svc.id);

      const currentMonthEntries = entries.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });
      const currentMonthSpend = currentMonthEntries.reduce((sum, e) => sum + Number(e.cost), 0);

      const previousMonthSpend = entries
        .filter((e) => {
          const d = new Date(e.date);
          return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
        })
        .reduce((sum, e) => sum + Number(e.cost), 0);

      const last30 = entries.slice(-30);
      const dailyAvg = last30.length > 0 ? last30.reduce((s, e) => s + Number(e.cost), 0) / last30.length : 0;

      const trendPct =
        previousMonthSpend > 0
          ? ((currentMonthSpend - previousMonthSpend) / previousMonthSpend) * 100
          : 0;

      const budgetPct = svc.monthly_budget > 0 ? (currentMonthSpend / svc.monthly_budget) * 100 : 0;

      const costHistory = entries.map((e) => ({ date: e.date, cost: Number(e.cost) }));

      return {
        ...svc,
        current_month_spend: currentMonthSpend,
        previous_month_spend: previousMonthSpend,
        daily_avg: dailyAvg,
        trend_pct: trendPct,
        budget_pct: budgetPct,
        cost_history: costHistory,
      };
    });
  }, [services, costEntries]);

  const totalCurrentSpend = useMemo(
    () => servicesWithCosts.reduce((s, svc) => s + svc.current_month_spend, 0),
    [servicesWithCosts]
  );

  const totalBudget = useMemo(
    () => services.reduce((s, svc) => s + Number(svc.monthly_budget), 0),
    [services]
  );

  const projectedSpend = useMemo(() => {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    if (dayOfMonth === 0) return 0;
    return (totalCurrentSpend / dayOfMonth) * daysInMonth;
  }, [totalCurrentSpend]);

  const totalSavings = useMemo(
    () =>
      recommendations
        .filter((r) => r.status === 'open')
        .reduce((s, r) => s + Number(r.potential_savings), 0),
    [recommendations]
  );

  const activeAlerts = useMemo(() => alerts.filter((a) => !a.resolved), [alerts]);

  return {
    services,
    servicesWithCosts,
    costEntries,
    alerts,
    recommendations,
    loading,
    error,
    totalCurrentSpend,
    totalBudget,
    projectedSpend,
    totalSavings,
    activeAlerts,
    refetch: fetchAll,
  };
}
