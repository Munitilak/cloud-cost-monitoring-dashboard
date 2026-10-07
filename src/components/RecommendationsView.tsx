import { useState } from 'react';
import { Lightbulb, Check, X, TrendingDown, ArrowRight } from 'lucide-react';
import type { Recommendation, ServiceWithCosts, Provider } from '@/types';
import { formatCurrency, REC_TYPE_LABELS, PROVIDER_COLORS, daysAgo } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
  services: ServiceWithCosts[];
  provider: Provider | 'all';
  onRefresh: () => void;
}

const REC_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  rightsizing: { bg: 'bg-blue-50', text: 'text-blue-600' },
  reservation: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  terminate: { bg: 'bg-red-50', text: 'text-red-600' },
  schedule: { bg: 'bg-amber-50', text: 'text-amber-600' },
};

export function RecommendationsView({ recommendations, services, provider, onRefresh }: RecommendationsViewProps) {
  const [acting, setActing] = useState<string | null>(null);
  const serviceMap = new Map(services.map((s) => [s.id, s]));

  let filtered = [...recommendations];
  if (provider !== 'all') {
    filtered = filtered.filter((r) => serviceMap.get(r.service_id)?.provider === provider);
  }
  const openRecs = filtered.filter((r) => r.status === 'open');
  const appliedRecs = filtered.filter((r) => r.status === 'applied');
  const dismissedRecs = filtered.filter((r) => r.status === 'dismissed');

  const totalPotential = openRecs.reduce((s, r) => s + Number(r.potential_savings), 0);

  const updateStatus = async (id: string, status: 'applied' | 'dismissed') => {
    setActing(id);
    try {
      const { error } = await supabase.from('recommendations').update({ status }).eq('id', id);
      if (error) throw error;
      onRefresh();
    } catch {
      // silently handle
    } finally {
      setActing(null);
    }
  };

  const renderRec = (rec: Recommendation) => {
    const svc = serviceMap.get(rec.service_id);
    const colors = svc ? PROVIDER_COLORS[svc.provider] : null;
    const styles = REC_TYPE_STYLES[rec.type] || { bg: 'bg-slate-50', text: 'text-slate-600' };

    return (
      <div
        key={rec.id}
        className={`bg-white rounded-xl border border-slate-200/80 p-4 ${rec.status !== 'open' ? 'opacity-60' : ''}`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${styles.bg} flex items-center justify-center shrink-0`}>
            <Lightbulb size={18} className={styles.text} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${styles.bg} ${styles.text}`}>
                {REC_TYPE_LABELS[rec.type]}
              </span>
              {svc && colors && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                  {svc.provider} · {svc.service_name}
                </span>
              )}
              {rec.status === 'applied' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <Check size={13} /> Applied
                </span>
              )}
              {rec.status === 'dismissed' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                  <X size={13} /> Dismissed
                </span>
              )}
            </div>
            <p className="text-sm text-slate-700">{rec.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                <TrendingDown size={14} />
                Save {formatCurrency(rec.potential_savings)}/mo
              </span>
              <span className="text-xs text-slate-400">{daysAgo(rec.created_at)}</span>
            </div>
          </div>
          {rec.status === 'open' && (
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => updateStatus(rec.id, 'applied')}
                disabled={acting === rec.id}
                className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 inline-flex items-center gap-1"
              >
                <Check size={14} /> Apply
              </button>
              <button
                onClick={() => updateStatus(rec.id, 'dismissed')}
                disabled={acting === rec.id}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm">
              <TrendingDown size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Cost Optimization Opportunities</h3>
              <p className="text-xs text-slate-500">{openRecs.length} open recommendations that could save you money</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Total Potential Savings</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalPotential)}/mo</p>
            <p className="text-xs text-slate-400">{formatCurrency(totalPotential * 12, true)}/year</p>
          </div>
        </div>
      </div>

      {openRecs.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Open ({openRecs.length})
          </h4>
          <div className="space-y-3">{openRecs.map(renderRec)}</div>
        </div>
      )}

      {appliedRecs.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <ArrowRight size={14} className="text-emerald-500" /> Applied ({appliedRecs.length})
          </h4>
          <div className="space-y-3">{appliedRecs.map(renderRec)}</div>
        </div>
      )}

      {dismissedRecs.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <X size={14} className="text-slate-400" /> Dismissed ({dismissedRecs.length})
          </h4>
          <div className="space-y-3">{dismissedRecs.map(renderRec)}</div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 py-16 text-center">
          <Lightbulb size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-400">No recommendations at this time.</p>
        </div>
      )}
    </div>
  );
}
