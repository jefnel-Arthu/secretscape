import React, { useState } from 'react';
import { Users, Clock, ChevronRight, Circle, Eye, ArrowLeft, Zap, Heart, Mail, Map, Search, Calendar, ExternalLink, Compass, Brain, Plus, Minus } from 'lucide-react';

interface Session {
  sessionId: string;
  actionCount: number;
  firstSeen: string;
  lastSeen: string;
  isActive: boolean;
}

interface Action {
  id: string;
  type: string;
  detail: string;
  spotId?: string;
  timestamp: string;
  sessionId?: string;
}

interface SessionTimelineProps {
  sessions: Session[];
  allActions: Action[];
}

const ACTION_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  visit:            { icon: Compass,  color: 'text-blue-400',    bg: 'bg-blue-500/20' },
  navigate:         { icon: ChevronRight, color: 'text-slate-400', bg: 'bg-slate-500/20' },
  time_spent:       { icon: Clock,    color: 'text-slate-500',   bg: 'bg-slate-500/10' },
  search:           { icon: Search,   color: 'text-amber-400',   bg: 'bg-amber-500/20' },
  filter_city:      { icon: Map,      color: 'text-cyan-400',    bg: 'bg-cyan-500/20' },
  filter_category:  { icon: Map,      color: 'text-cyan-400',    bg: 'bg-cyan-500/20' },
  filter_secret:    { icon: Map,      color: 'text-cyan-400',    bg: 'bg-cyan-500/20' },
  view_mode:        { icon: Eye,      color: 'text-purple-400',  bg: 'bg-purple-500/20' },
  spot_view:        { icon: Eye,      color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  spot_preview:     { icon: Eye,      color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  favorite_add:     { icon: Heart,    color: 'text-rose-400',    bg: 'bg-rose-500/20' },
  favorite_remove:  { icon: Minus,    color: 'text-rose-400',    bg: 'bg-rose-500/20' },
  calendar_add:     { icon: Calendar, color: 'text-amber-400',   bg: 'bg-amber-500/20' },
  calendar_remove:  { icon: Calendar, color: 'text-amber-400',   bg: 'bg-amber-500/20' },
  category_click:   { icon: Plus,     color: 'text-orange-400',  bg: 'bg-orange-500/20' },
  homepage_click:   { icon: Compass,  color: 'text-blue-400',    bg: 'bg-blue-500/20' },
  external_link:    { icon: ExternalLink, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  ai_itinerary:     { icon: Brain,    color: 'text-violet-400',  bg: 'bg-violet-500/20' },
  spot_proposal:    { icon: Plus,     color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  message:          { icon: Mail,     color: 'text-rose-400',    bg: 'bg-rose-500/20' },
  services_to_contact: { icon: Mail,  color: 'text-rose-400',    bg: 'bg-rose-500/20' },
};

function formatDuration(ts1: string, ts2: string): string {
  const diff = Math.abs(new Date(ts2).getTime() - new Date(ts1).getTime());
  if (diff < 1000) return '<1s';
  if (diff < 60000) return `${Math.round(diff / 1000)}s`;
  return `${Math.round(diff / 60000)}min`;
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export const SessionTimeline: React.FC<SessionTimelineProps> = ({ sessions, allActions }) => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const sessionActions = selectedSession
    ? allActions.filter(a => a.sessionId === selectedSession).sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    : [];

  if (selectedSession) {
    const session = sessions.find(s => s.sessionId === selectedSession);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedSession(null)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Session {selectedSession.slice(0, 16)}...
              {session?.isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            </h3>
            <p className="text-[10px] text-slate-500">
              {session?.actionCount} actions · {formatDate(session?.firstSeen || '')} → {formatDate(session?.lastSeen || '')}
            </p>
          </div>
        </div>

        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-700" />
          <div className="space-y-1">
            {sessionActions.map((action, i) => {
              const meta = ACTION_META[action.type] || { icon: Zap, color: 'text-slate-400', bg: 'bg-slate-500/20' };
              const Icon = meta.icon;
              const prevAction = i > 0 ? sessionActions[i - 1] : null;
              const gap = prevAction ? formatDuration(prevAction.timestamp, action.timestamp) : null;

              return (
                <div key={action.id}>
                  {gap && gap !== '<1s' && (
                    <div className="flex items-center gap-2 py-1 pl-1">
                      <div className="w-2 h-px bg-slate-700" />
                      <span className="text-[9px] text-slate-600 italic">+{gap}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3 py-1.5 group">
                    <div className={`absolute -left-[18px] w-3 h-3 rounded-full ${meta.bg} border border-slate-700 flex items-center justify-center mt-1.5`}>
                      <Icon className={`w-1.5 h-1.5 ${meta.color}`} />
                    </div>
                    <span className="text-[10px] text-slate-600 w-16 shrink-0 pt-0.5 font-mono">
                      {formatTime(action.timestamp)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 truncate">{action.detail}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.color} font-medium`}>
                          {action.type}
                        </span>
                        {action.spotId && (
                          <span className="text-[9px] text-slate-600 truncate">{action.spotId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {sessionActions.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">Aucune action dans cette session.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sessions list view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          Sessions visiteurs ({sessions.length})
        </h3>
        <span className="text-[10px] text-slate-500">Cliquez sur une session pour voir le détail</span>
      </div>

      {sessions.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-10">Aucune session enregistrée.</p>
      ) : (
        <div className="space-y-2">
          {sessions.map(session => (
            <button
              key={session.sessionId}
              onClick={() => setSelectedSession(session.sessionId)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 hover:bg-slate-900 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${session.isActive ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                    <Users className={`w-4 h-4 ${session.isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                      {session.sessionId.slice(0, 20)}...
                      {session.isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {formatDate(session.firstSeen)} → {formatDate(session.lastSeen)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-100">{session.actionCount}</p>
                    <p className="text-[9px] text-slate-500 uppercase">actions</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
