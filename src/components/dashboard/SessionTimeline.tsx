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
  visit:            { icon: Compass,  color: 'text-blue-600',    bg: 'bg-blue-100' },
  navigate:         { icon: ChevronRight, color: 'text-gray-500', bg: 'bg-gray-100' },
  time_spent:       { icon: Clock,    color: 'text-gray-600',   bg: 'bg-gray-100' },
  search:           { icon: Search,   color: 'text-amber-600',   bg: 'bg-amber-100' },
  filter_city:      { icon: Map,      color: 'text-cyan-600',    bg: 'bg-cyan-100' },
  filter_category:  { icon: Map,      color: 'text-cyan-600',    bg: 'bg-cyan-100' },
  filter_secret:    { icon: Map,      color: 'text-cyan-600',    bg: 'bg-cyan-100' },
  view_mode:        { icon: Eye,      color: 'text-purple-600',  bg: 'bg-purple-100' },
  spot_view:        { icon: Eye,      color: 'text-emerald-600', bg: 'bg-emerald-100' },
  spot_preview:     { icon: Eye,      color: 'text-emerald-600', bg: 'bg-emerald-100' },
  favorite_add:     { icon: Heart,    color: 'text-rose-600',    bg: 'bg-rose-100' },
  favorite_remove:  { icon: Minus,    color: 'text-rose-600',    bg: 'bg-rose-100' },
  calendar_add:     { icon: Calendar, color: 'text-amber-600',   bg: 'bg-amber-100' },
  calendar_remove:  { icon: Calendar, color: 'text-amber-600',   bg: 'bg-amber-100' },
  category_click:   { icon: Plus,     color: 'text-orange-600',  bg: 'bg-orange-100' },
  homepage_click:   { icon: Compass,  color: 'text-blue-600',    bg: 'bg-blue-100' },
  external_link:    { icon: ExternalLink, color: 'text-amber-600', bg: 'bg-amber-100' },
  ai_itinerary:     { icon: Brain,    color: 'text-violet-600',  bg: 'bg-violet-100' },
  spot_proposal:    { icon: Plus,     color: 'text-emerald-600', bg: 'bg-emerald-100' },
  message:          { icon: Mail,     color: 'text-rose-600',    bg: 'bg-rose-100' },
  services_to_contact: { icon: Mail,  color: 'text-rose-600',    bg: 'bg-rose-100' },
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
      <div className="space-y-4 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedSession(null)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Session {selectedSession.slice(0, 16)}...
              {session?.isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            </h3>
            <p className="text-[10px] text-gray-500">
              {session?.actionCount} actions · {formatDate(session?.firstSeen || '')} → {formatDate(session?.lastSeen || '')}
            </p>
          </div>
        </div>

        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
          <div className="space-y-1">
            {sessionActions.map((action, i) => {
              const meta = ACTION_META[action.type] || { icon: Zap, color: 'text-gray-500', bg: 'bg-gray-100' };
              const Icon = meta.icon;
              const prevAction = i > 0 ? sessionActions[i - 1] : null;
              const gap = prevAction ? formatDuration(prevAction.timestamp, action.timestamp) : null;

              return (
                <div key={action.id}>
                  {gap && gap !== '<1s' && (
                    <div className="flex items-center gap-2 py-1 pl-1">
                      <div className="w-2 h-px bg-gray-300" />
                      <span className="text-[9px] text-gray-400 italic">+{gap}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3 py-1.5 group">
                    <div className={`absolute -left-[18px] w-3 h-3 rounded-full ${meta.bg} border border-gray-200 flex items-center justify-center mt-1.5`}>
                      <Icon className={`w-1.5 h-1.5 ${meta.color}`} />
                    </div>
                    <span className="text-[10px] text-gray-400 w-16 shrink-0 pt-0.5 font-mono">
                      {formatTime(action.timestamp)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 truncate">{action.detail}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.color} font-medium`}>
                          {action.type}
                        </span>
                        {action.spotId && (
                          <span className="text-[9px] text-gray-400 truncate">{action.spotId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {sessionActions.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-8">Aucune action dans cette session.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sessions list view
  return (
    <div className="space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          Sessions visiteurs ({sessions.length})
        </h3>
        <span className="text-[10px] text-gray-500">Cliquez sur une session pour voir le détail</span>
      </div>

      {sessions.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-10">Aucune session enregistrée.</p>
      ) : (
        <div className="space-y-2">
          {sessions.map(session => (
            <button
              key={session.sessionId}
              onClick={() => setSelectedSession(session.sessionId)}
              className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:bg-gray-50 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${session.isActive ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                    <Users className={`w-4 h-4 ${session.isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 flex items-center gap-2">
                      {session.sessionId.slice(0, 20)}...
                      {session.isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {formatDate(session.firstSeen)} → {formatDate(session.lastSeen)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{session.actionCount}</p>
                    <p className="text-[9px] text-gray-500 uppercase">actions</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
