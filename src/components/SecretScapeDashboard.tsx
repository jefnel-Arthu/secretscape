import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity, Network, Server, ShieldAlert, Users, Layers
} from 'lucide-react';
import {
  UserAction, SecurityAlert,
  SystemNode, EndpointStat
} from '../types/dashboard';
import {
  INITIAL_SYSTEM_NODES, INITIAL_ENDPOINTS, INITIAL_ALERTS
} from '../data/mockEngine';
import { DashboardHeader } from './dashboard/Header';
import { MetricCards } from './dashboard/MetricCards';
import { NetworkTrafficView } from './dashboard/NetworkTrafficView';
import { SystemPerformanceView } from './dashboard/SystemPerformanceView';
import { LiveActionsFeed } from './dashboard/LiveActionsFeed';
import { SecurityAlertsPanel } from './dashboard/SecurityAlertsPanel';
import { ActionDetailModal } from './dashboard/ActionDetailModal';
import { SessionTimeline } from './dashboard/SessionTimeline';

interface LiveOpsData {
  pageViews: number;
  totalSpotViews: number;
  totalFavorites: number;
  totalMessages: number;
  unreadMessages: number;
  customSpotsCount: number;
  activeVisitors: number;
  recentMessages: {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    subject: string;
    message: string;
    date: string;
    read: boolean;
  }[];
  topSpots: { id: string; views: number }[];
  recentActions: { id: string; type: string; detail: string; spotId?: string; timestamp: string; sessionId?: string }[];
  sessions: { sessionId: string; actionCount: number; firstSeen: string; lastSeen: string; isActive: boolean }[];
  uptime: number;
  serverTime: string;
}

function messageToAction(msg: LiveOpsData['recentMessages'][number]): UserAction {
  return {
    id: `msg-${msg.id}`,
    timestamp: new Date(msg.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isoTime: msg.date,
    userId: `usr-msg-${msg.id}`,
    userName: msg.name,
    userLocation: {
      city: msg.city,
      country: 'Bénin',
      countryCode: 'BJ',
      flag: '🇧🇯',
      lat: 6.37,
      lng: 2.39,
    },
    ipAddress: '0.0.0.0',
    action: msg.subject,
    details: msg.message,
    category: 'booking',
    severity: msg.read ? 'info' : 'success',
    endpoint: '/api/messages',
    statusCode: 200,
    durationMs: 0,
  };
}

const ACTION_ICON: Record<string, { category: UserAction['category']; severity: UserAction['severity']; endpoint: string }> = {
  visit:            { category: 'page_view', severity: 'info',    endpoint: '/' },
  spot_view:        { category: 'page_view', severity: 'info',    endpoint: '/spots' },
  favorite_add:     { category: 'booking',  severity: 'success', endpoint: '/api/track/favorite' },
  favorite_remove:  { category: 'page_view', severity: 'info',    endpoint: '/api/track/favorite' },
  calendar_add:     { category: 'booking',  severity: 'success', endpoint: '/api/calendar' },
  spot_proposal:    { category: 'booking',  severity: 'success', endpoint: '/api/spots' },
  message:          { category: 'booking',  severity: 'success', endpoint: '/api/contact' },
  search:           { category: 'page_view', severity: 'info',    endpoint: '/search' },
};

function serverActionToUserAction(a: LiveOpsData['recentActions'][number]): UserAction {
  const meta = ACTION_ICON[a.type] || { category: 'page_view' as const, severity: 'info' as const, endpoint: '/' };
  return {
    id: a.id,
    timestamp: new Date(a.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isoTime: a.timestamp,
    userId: `usr-${a.id}`,
    userName: a.detail.split(':')[0] || 'Visiteur',
    userLocation: { city: 'Cotonou', country: 'Bénin', countryCode: 'BJ', flag: '🇧🇯', lat: 6.37, lng: 2.39 },
    ipAddress: '0.0.0.0',
    action: a.detail,
    details: a.detail,
    category: meta.category,
    severity: meta.severity,
    endpoint: meta.endpoint,
    statusCode: 200,
    durationMs: 0,
  };
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}j ${hours}h ${minutes}m`;
}

export default function SecretScapeDashboard() {
  const [actions, setActions] = useState<UserAction[]>([]);
  const [nodes] = useState<SystemNode[]>(INITIAL_SYSTEM_NODES);
  const [endpoints, setEndpoints] = useState<EndpointStat[]>(INITIAL_ENDPOINTS);
  const [alerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeMainTab, setActiveMainTab] = useState<'overview' | 'network' | 'system' | 'actions' | 'visitors' | 'security'>('overview');

  const [selectedAction, setSelectedAction] = useState<UserAction | null>(null);

  const [currentTime, setCurrentTime] = useState<string>(() =>
    new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  const [liveOps, setLiveOps] = useState<LiveOpsData | null>(null);
  const [liveOpsError, setLiveOpsError] = useState<string | null>(null);
  const [liveOpsLoading, setLiveOpsLoading] = useState<boolean>(false);

  const fetchLiveData = useCallback(async () => {
    setLiveOpsLoading(true);
    setLiveOpsError(null);
    try {
      const token = localStorage.getItem('secretscape_admin_token');
      const res = await fetch('/api/admin/liveops', {
        headers: token ? { 'x-admin-token': token } : {},
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data: LiveOpsData = await res.json();
      setLiveOps(data);

      if (data.recentActions?.length || data.recentMessages?.length) {
        const realActions = (data.recentActions || []).map(serverActionToUserAction);
        const msgActions = (data.recentMessages || []).map(messageToAction);
        setActions([...realActions, ...msgActions]);
      } else {
        setActions([]);
      }
    } catch (err) {
      setLiveOpsError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLiveOpsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    const poll = setInterval(fetchLiveData, 10000);
    return () => clearInterval(poll);
  }, [fetchLiveData]);

  // Heartbeat: ping server every 15s
  useEffect(() => {
    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const sendHeartbeat = async () => {
      try {
        await fetch('/api/track/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
      } catch {}
    };
    sendHeartbeat();
    const hb = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(hb);
  }, []);

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const mainTabs: { key: typeof activeMainTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: <Activity className="w-4 h-4" /> },
    { key: 'visitors', label: 'Visiteurs', icon: <Users className="w-4 h-4" /> },
    { key: 'actions', label: 'Actions', icon: <Layers className="w-4 h-4" /> },
    { key: 'network', label: 'Réseau', icon: <Network className="w-4 h-4" /> },
    { key: 'system', label: 'Système', icon: <Server className="w-4 h-4" /> },
    { key: 'security', label: 'Sécurité', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <DashboardHeader
        isStreaming={true}
        onToggleStreaming={() => {}}
        preset={'normal' as any}
        onSelectPreset={() => {}}
        refreshInterval={10000}
        onChangeInterval={() => {}}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onTriggerAction={fetchLiveData}
        onOpenAiAssistant={() => {}}
        onOpenCodeExport={() => {}}
        currentTime={currentTime}
      />

      <div className="px-4 lg:px-8 py-4">
        <MetricCards
          activeVisitors={liveOps?.activeVisitors ?? 0}
          pageViews={liveOps?.pageViews ?? 0}
          totalSpotViews={liveOps?.totalSpotViews ?? 0}
          totalFavorites={liveOps?.totalFavorites ?? 0}
          totalMessages={liveOps?.totalMessages ?? 0}
          unreadMessages={liveOps?.unreadMessages ?? 0}
          customSpotsCount={liveOps?.customSpotsCount ?? 0}
          uptime={liveOps?.uptime ?? 0}
        />
      </div>

      <div className="px-4 lg:px-8 flex items-center gap-1 overflow-x-auto border-b border-slate-800">
        {mainTabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveMainTab(t.key)}
            className={`px-4 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
              activeMainTab === t.key
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 lg:px-8 py-6 overflow-auto">
        {activeMainTab === 'overview' && (
          <div className="space-y-6">
            <LiveActionsFeed actions={actions} onSelectAction={setSelectedAction} />
            {liveOps && liveOps.topSpots.length > 0 && (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Lieux les plus vus</h3>
                <div className="space-y-2">
                  {liveOps.topSpots.map(s => (
                    <div key={s.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[250px]">{s.id}</span>
                      <span className="font-bold text-slate-100">{s.views} vues</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeMainTab === 'actions' && (
          <LiveActionsFeed actions={actions} onSelectAction={setSelectedAction} />
        )}

        {activeMainTab === 'visitors' && liveOps && (
          <SessionTimeline sessions={liveOps.sessions || []} allActions={liveOps.recentActions || []} />
        )}

        {activeMainTab === 'network' && (
          <NetworkTrafficView metrics={[]} endpoints={endpoints} />
        )}

        {activeMainTab === 'system' && (
          <SystemPerformanceView metrics={[]} nodes={nodes} />
        )}

        {activeMainTab === 'security' && (
          <SecurityAlertsPanel alerts={alerts} endpoints={endpoints} />
        )}
      </div>

      <ActionDetailModal action={selectedAction} onClose={() => setSelectedAction(null)} />
    </div>
  );
}
