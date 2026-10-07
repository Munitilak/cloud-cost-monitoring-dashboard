import { Cloud, LayoutDashboard, DollarSign, Bell, Lightbulb, Settings } from 'lucide-react';

export type View = 'overview' | 'services' | 'budgets' | 'alerts' | 'recommendations';

interface SidebarProps {
  view: View;
  onViewChange: (v: View) => void;
  alertCount: number;
}

export function Sidebar({ view, onViewChange, alertCount }: SidebarProps) {
  const navItems: { id: View; label: string; icon: typeof Cloud; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: DollarSign },
    { id: 'budgets', label: 'Budgets', icon: Cloud },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: alertCount },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  ];

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-slate-200/80 h-screen sticky top-0">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-200/80">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
          <Cloud size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-800 leading-tight">CloudCost</h1>
          <p className="text-[10px] text-slate-400 leading-tight">Monitoring Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-2">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-400'} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
              {active && <span className="w-1 h-5 rounded-full bg-blue-600" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-200/80">
        <div className="px-3 py-3 rounded-lg bg-slate-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <Settings size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">Admin Console</p>
            <p className="text-[10px] text-slate-400">Multi-cloud view</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav({ view, onViewChange, alertCount }: SidebarProps) {
  const navItems: { id: View; label: string; icon: typeof Cloud; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: DollarSign },
    { id: 'budgets', label: 'Budgets', icon: Cloud },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: alertCount },
    { id: 'recommendations', label: 'Optimize', icon: Lightbulb },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = view === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 relative ${active ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute top-1 right-1/4 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold">
                {item.badge}
              </span>
            )}
            {active && <span className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-full bg-blue-600" />}
          </button>
        );
      })}
    </nav>
  );
}
