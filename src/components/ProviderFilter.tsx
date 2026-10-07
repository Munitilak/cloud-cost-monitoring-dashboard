import type { Provider } from '@/types';
import { PROVIDER_COLORS } from '@/lib/utils';

interface ProviderFilterProps {
  selected: Provider | 'all';
  onChange: (p: Provider | 'all') => void;
  counts: Record<string, number>;
}

export function ProviderFilter({ selected, onChange, counts }: ProviderFilterProps) {
  const providers: (Provider | 'all')[] = ['all', 'AWS', 'GCP', 'Azure'];
  const labels: Record<string, string> = { all: 'All Clouds', AWS: 'AWS', GCP: 'GCP', Azure: 'Azure' };

  return (
    <div className="inline-flex items-center gap-1 bg-slate-100/80 rounded-lg p-1">
      {providers.map((p) => {
        const active = selected === p;
        const color = p === 'all' ? null : PROVIDER_COLORS[p];
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {p !== 'all' && color && (
              <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ backgroundColor: color.solid }} />
            )}
            {labels[p]}
            <span className="ml-1.5 text-slate-300">{counts[p] || 0}</span>
          </button>
        );
      })}
    </div>
  );
}
