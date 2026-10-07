import { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle, Clock } from 'lucide-react';
import type { Alert, ServiceWithCosts, Provider } from '@/types';
import { SEVERITY_COLORS, ALERT_TYPE_LABELS, daysAgo, PROVIDER_COLORS } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface AlertsViewProps {
  alerts: Alert[];
  services: ServiceWithCosts[];
  provider: Provider | 'all';
  onRefresh: () => void;
}

export function AlertsView({ alerts, services, provider, onRefresh }: AlertsViewProps) {
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');
  const [resolving, setResolving] = useState<string | null>(null);

  const serviceMap = new Map(services.map((s) => [s.id, s]));

  let filtered = [...alerts];
  if (provider !== 'all') {
    filtered = filtered.filter((a) => serviceMap.get(a.service_id)?.provider === provider);
  }
  if (filter === 'unresolved') filtered = filtered.filter((a) => !a.resolved);
  if (filter === 'resolved') filtered = filtered.filter((a) => a.resolved);

  const unresolvedCount = alerts.filter((a) => !a.resolved).length;

  const handleResolve = async (id: string) => {
    setResolving(id);
    try {
      const { error } = await supabase.from('alerts').update({ resolved: true }).eq('id', id);
      if (error) throw error;
      onRefresh();
    } catch {
      // silently handle
    } finally {
      setResolving(null);
    }
  };

  const tabs: { id: typeof filter; label: string; count: number }[] = [
    { id: 'unresolved', label: 'Active', count: alerts.filter((a) => !a.resolved).length },
    { id: 'resolved', label: 'Resolved', count: alerts.filter((a) => a.resolved).length },
    { id: 'all', label: 'All', count: alerts.length },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <Bell size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Cost Alerts</h3>
            <p className="text-xs text-slate-400">{unresolvedCount} active alerts requiring attention</p>
          </div>
        </div>
        <div className="inline-flex gap-1 bg-slate-100/80 rounded-lg p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                filter === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label} <span className="ml-1 text-slate-300">{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((alert) => {
          const svc = serviceMap.get(alert.service_id);
          const sev = SEVERITY_COLORS[alert.severity];
          const colors = svc ? PROVIDER_COLORS[svc.provider] : null;

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border ${alert.resolved ? 'border-slate-200/60 opacity-70' : sev.border} p-4 flex items-start gap-3 hover:shadow-sm transition-all`}
            >
              <div className={`w-9 h-9 rounded-lg ${sev.bg} flex items-center justify-center shrink-0`}>
                <AlertTriangle size={17} className={sev.text} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${sev.bg} ${sev.text}`}>
                    {alert.severity === 'critical' ? 'Critical' : 'Warning'}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{ALERT_TYPE_LABELS[alert.type]}</span>
                  {svc && colors && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                      {svc.provider} · {svc.service_name}
                    </span>
                  )}
                  {alert.resolved && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle size={13} /> Resolved
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700">{alert.message}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                  <Clock size={12} />
                  {daysAgo(alert.created_at)}
                </div>
              </div>
              {!alert.resolved && (
                <button
                  onClick={() => handleResolve(alert.id)}
                  disabled={resolving === alert.id}
                  className="text-xs font-semibold text-slate-500 hover:text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-all disabled:opacity-50 shrink-0"
                >
                  {resolving === alert.id ? 'Resolving...' : 'Resolve'}
                </button>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200/80 py-16 text-center">
            <CheckCircle size={32} className="mx-auto text-emerald-400 mb-2" />
            <p className="text-sm text-slate-400">No alerts in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
