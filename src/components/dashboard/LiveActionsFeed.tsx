import React from 'react';
import { Activity, MapPin, Clock, ChevronRight, Globe } from 'lucide-react';
import type { UserAction, ActionSeverity, ActionCategory } from '../../types/dashboard';

interface LiveActionsFeedProps {
  actions: UserAction[];
  onSelectAction: (action: UserAction) => void;
}

const severityDot: Record<ActionSeverity, string> = {
  success: 'bg-emerald-400',
  critical: 'bg-red-400',
  info: 'bg-blue-400',
  warning: 'bg-yellow-400',
};

const categoryBadge: Record<ActionCategory, string> = {
  booking: 'bg-blue-500/20 text-blue-300',
  gameplay: 'bg-purple-500/20 text-purple-300',
  auth: 'bg-cyan-500/20 text-cyan-300',
  payment: 'bg-emerald-500/20 text-emerald-300',
  navigation: 'bg-amber-500/20 text-amber-300',
  security: 'bg-rose-500/20 text-rose-300',
  page_view: 'bg-slate-500/20 text-slate-300',
};

export const LiveActionsFeed: React.FC<LiveActionsFeedProps> = ({
  actions,
  onSelectAction,
}) => {
  return (
    <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-100">
            Journal d'Activité en Direct
          </h2>
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
        </div>
        <span className="text-xs text-slate-500">{actions.length} actions</span>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto max-h-[520px] divide-y divide-slate-800/60">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onSelectAction(action)}
            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-slate-800/40 transition-colors group"
          >
            {/* Severity dot */}
            <span
              className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${severityDot[action.severity]}`}
            />

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-100 truncate">
                  {action.action}
                </span>
                {action.roomName && (
                  <span className="text-xs text-slate-500 truncate">
                    · {action.roomName}
                  </span>
                )}
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${categoryBadge[action.category]}`}
                >
                  {action.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {action.details}
              </p>
            </div>

            {/* Right side: timestamp + location */}
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Clock size={10} />
                <span className="font-mono tabular-nums">{action.timestamp}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>{action.userLocation.flag}</span>
                <span>{action.userLocation.city}</span>
              </div>
            </div>

            {/* Chevron */}
            <ChevronRight
              size={14}
              className="flex-shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
