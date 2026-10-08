import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity, Users, Zap, Mail, BarChart3, RefreshCw, Clock,
  LayoutDashboard, AlertTriangle, Inbox, Check, Trash2,
  Phone, MapPin, Eye, Compass, Heart, Plus, Minus, TrendingUp
} from 'lucide-react';
import { UserAction } from '../types/dashboard';
import { MetricCards } from './dashboard/MetricCards';
import { LiveActionsFeed } from './dashboard/LiveActionsFeed';
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

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('secretscape_admin_token');
  return token ? { 'x-admin-token': token } : {};
}

const POLL_INTERVAL_MS = 10000;

type MainTab = 'overview' | 'visitors' | 'actions' | 'messages' | 'stats';

const TYPE_LABELS: Record<string, string> = {
  visit: 'Visite',
  navigate: 'Navigation',
  time_spent: 'Temps passé',
  search: 'Recherche',
  filter_city: 'Filtre ville',
  filter_category: 'Filtre catégorie',
  filter_secret: 'Filtre secrets',
  view_mode: 'Affichage',
  spot_view: 'Vue lieu',
  spot_preview: 'Aperçu lieu',
  favorite_add: 'Favori +',
  favorite_remove: 'Favori −',
  calendar_add: 'Agenda +',
  calendar_remove: 'Agenda −',
  category_click: 'Catégorie',
  homepage_click: 'Accueil',
  external_link: 'Lien externe',
  ai_itinerary: 'Itinéraire IA',
  spot_proposal: 'Proposition',
  message: 'Message',
  services_to_contact: 'Contact service',
};

const SEVERITY_DOT: Record<UserAction['severity'], string> = {
  info: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
};

function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
        <Inbox className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

// ── Vue d'ensemble ──────────────────────────────────────────────

function OverviewTab({
  actions,
  topSpots,
  onSelectAction,
}: {
  actions: UserAction[];
  topSpots: LiveOpsData['topSpots'];
  onSelectAction: (a: UserAction) => void;
}) {
  const recent = actions.slice(0, 10);
  const maxViews = Math.max(1, ...topSpots.map(s => s.views));

  if (!recent.length && !topSpots.length) {
    return <EmptyState title="Aucune activité pour le moment" hint="Les actions des visiteurs apparaîtront ici en temps réel." />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dernières actions</h3>
          <span className="text-xs font-medium text-gray-400">{recent.length}/10</span>
        </div>
        <div className="divide-y divide-gray-100">
          {recent.length === 0 && (
            <p className="px-4 py-8 text-sm text-gray-400 text-center">Aucune action enregistrée.</p>
          )}
          {recent.map(a => (
            <button
              key={a.id}
              onClick={() => onSelectAction(a)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${SEVERITY_DOT[a.severity]}`} />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 w-24 shrink-0 hidden sm:block">
                {TYPE_LABELS[a.action] || a.category}
              </span>
              <span className="text-sm font-medium text-gray-900 truncate w-32 shrink-0">{a.userName}</span>
              <span className="text-sm text-gray-600 truncate flex-1 hidden md:block">{a.details}</span>
              <span className="text-xs text-gray-400 shrink-0 font-mono ml-auto">{a.timestamp}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden self-start">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lieux les plus vus</h3>
        </div>
        <div className="p-4 space-y-3">
          {topSpots.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Aucune vue enregistrée.</p>}
          {topSpots.slice(0, 8).map((s, i) => (
            <div key={s.id}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-sm text-gray-800">{s.id}</span>
                <span className="text-sm font-bold text-gray-900 shrink-0">{s.views.toLocaleString('fr-FR')}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden ml-7">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${Math.max((s.views / maxViews) * 100, 2)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Messages ────────────────────────────────────────────────────

function MessagesTab({
  messages,
  onMarkRead,
  onDelete,
}: {
  messages: LiveOpsData['recentMessages'];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const unread = messages.filter(m => !m.read).length;

  if (!messages.length) {
    return <EmptyState title="Aucun message" hint="Les messages du formulaire de contact apparaîtront ici." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span>{messages.length} message{messages.length > 1 ? 's' : ''}</span>
        {unread > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
            {unread} non lu{unread > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {messages.map(m => (
        <div
          key={m.id}
          className={`bg-white rounded-xl border shadow-sm p-4 ${
            m.read ? 'border-gray-200' : 'border-l-4 border-l-amber-500 border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${m.read ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-600'}`}>
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm truncate ${m.read ? 'font-medium text-gray-800' : 'font-bold text-gray-900'}`}>
                    {m.name}
                  </span>
                  {!m.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Non lu" />
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(m.date).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-gray-500">
                  <span className="truncate">{m.email}</span>
                  {m.phone && (
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</span>
                  )}
                  {m.city && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{m.city}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onMarkRead(m.id)}
                disabled={m.read}
                title={m.read ? 'Déjà lu' : 'Marquer comme lu'}
                className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-25 disabled:hover:bg-transparent"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => { if (window.confirm('Supprimer définitivement ce message ?')) onDelete(m.id); }}
                title="Supprimer"
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-3 pl-12">
            <p className={`text-sm ${m.read ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>{m.subject}</p>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words">{m.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Statistiques ────────────────────────────────────────────────

function StatsTab({ liveOps }: { liveOps: LiveOpsData }) {
  const favAdds = liveOps.recentActions.filter(a => a.type === 'favorite_add').length;
  const favRemoves = liveOps.recentActions.filter(a => a.type === 'favorite_remove').length;
  const favNet = favAdds - favRemoves;

  const totalRefs = liveOps.pageViews + liveOps.totalSpotViews || 1;
  const pvPct = Math.round((liveOps.pageViews / totalRefs) * 100);
  const svPct = 100 - pvPct;

  const sortedSpots = [...liveOps.topSpots].sort((a, b) => b.views - a.views);
  const maxViews = Math.max(1, ...sortedSpots.map(s => s.views));

  return (
    <div className="space-y-6">
      {!sortedSpots.length && !liveOps.pageViews && !liveOps.totalSpotViews && (
        <EmptyState title="Pas encore de statistiques" hint="Les données se constitueront au fil des visites." />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Pages vues vs Vues de lieux
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Eye className="w-4 h-4 text-blue-500" /> Pages vues
                </span>
                <span className="font-bold text-gray-900">{liveOps.pageViews.toLocaleString('fr-FR')}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pvPct}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Compass className="w-4 h-4 text-emerald-500" /> Vues de lieux
                </span>
                <span className="font-bold text-gray-900">{liveOps.totalSpotViews.toLocaleString('fr-FR')}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${svPct}%` }} />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Répartition : {pvPct}% navigation générale · {svPct}% consultation de lieux
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Favoris</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <Heart className="w-4 h-4 text-rose-500 mb-1.5" />
              <p className="text-xl font-bold text-gray-900">{liveOps.totalFavorites.toLocaleString('fr-FR')}</p>
              <p className="text-xs text-gray-500">Total favoris actifs</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <Plus className="w-4 h-4 text-emerald-500 mb-1.5" />
              <p className="text-xl font-bold text-gray-900">{favAdds}</p>
              <p className="text-xs text-gray-500">Ajouts récents</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <Minus className="w-4 h-4 text-gray-500 mb-1.5" />
              <p className="text-xl font-bold text-gray-900">{favRemoves}</p>
              <p className="text-xs text-gray-500">Retraits récents</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <TrendingUp className={`w-4 h-4 mb-1.5 ${favNet >= 0 ? 'text-amber-500' : 'text-red-500'}`} />
              <p className={`text-xl font-bold ${favNet >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                {favNet >= 0 ? '+' : ''}{favNet}
              </p>
              <p className="text-xs text-gray-500">Solde fenêtre récente</p>
            </div>
          </div>
        </div>
      </div>

      {sortedSpots.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Lieux les plus consultés
          </h3>
          <div className="space-y-3">
            {sortedSpots.map(s => {
              const pct = Math.round((s.views / maxViews) * 100);
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700 truncate max-w-[70%]">{s.id}</span>
                    <span className="font-bold text-gray-900 shrink-0">{s.views.toLocaleString('fr-FR')} vues</span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-md overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-md flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    >
                      {pct >= 20 && <span className="text-[10px] font-bold text-white">{pct}%</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400">
        Uptime serveur : {formatUptime(liveOps.uptime)} · Heure serveur :{' '}
        {new Date(liveOps.serverTime).toLocaleTimeString('fr-FR')}
      </p>
    </div>
  );
}

// ── Composant principal ─────────────────────────────────────────

export default function SecretScapeDashboard() {
  const [actions, setActions] = useState<UserAction[]>([]);
  const [selectedAction, setSelectedAction] = useState<UserAction | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('overview');

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
      const res = await fetch('/api/admin/liveops', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data: LiveOpsData = await res.json();
      setLiveOps(data);

      const realActions = (data.recentActions || []).map(serverActionToUserAction);
      const msgActions = (data.recentMessages || []).map(messageToAction);
      setActions(
        [...realActions, ...msgActions].sort(
          (a, b) => new Date(b.isoTime).getTime() - new Date(a.isoTime).getTime()
        )
      );
    } catch (err) {
      setLiveOpsError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLiveOpsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    const poll = setInterval(fetchLiveData, POLL_INTERVAL_MS);
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

  const markMessageRead = useCallback(async (id: string) => {
    try {
      await fetch('/api/admin/messages/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ id }),
      });
      await fetchLiveData();
    } catch {}
  }, [fetchLiveData]);

  const deleteMessage = useCallback(async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      await fetchLiveData();
    } catch {}
  }, [fetchLiveData]);

  const mainTabs: { key: MainTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'visitors', label: 'Visiteurs', icon: <Users className="w-4 h-4" /> },
    { key: 'actions', label: 'Actions', icon: <Zap className="w-4 h-4" /> },
    { key: 'messages', label: 'Messages', icon: <Mail className="w-4 h-4" />, badge: liveOps?.unreadMessages || 0 },
    { key: 'stats', label: 'Statistiques', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const activeVisitors = liveOps?.activeVisitors ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* ── En-tête ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 text-amber-400 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Tourisme Bénin — Console Live Ops</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3" />
                <span className="font-mono font-semibold text-gray-700">{currentTime}</span>
                <span className="text-gray-300">·</span>
                Actualisation auto · {POLL_INTERVAL_MS / 1000}s
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${
                activeVisitors > 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {activeVisitors > 0 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    activeVisitors > 0 ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}
                />
              </span>
              {activeVisitors} visiteur{activeVisitors !== 1 ? 's' : ''} actif{activeVisitors !== 1 ? 's' : ''}
            </div>

            <button
              onClick={fetchLiveData}
              disabled={liveOpsLoading}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${liveOpsLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>
      </header>

      {/* ── Cartes métriques ── */}
      <div className="px-4 lg:px-8 py-4">
        <MetricCards
          activeVisitors={activeVisitors}
          pageViews={liveOps?.pageViews ?? 0}
          totalSpotViews={liveOps?.totalSpotViews ?? 0}
          totalFavorites={liveOps?.totalFavorites ?? 0}
          totalMessages={liveOps?.totalMessages ?? 0}
          unreadMessages={liveOps?.unreadMessages ?? 0}
          customSpotsCount={liveOps?.customSpotsCount ?? 0}
          uptime={liveOps?.uptime ?? 0}
        />
      </div>

      {/* ── Onglets ── */}
      <div className="px-4 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 bg-white rounded-t-xl">
          {mainTabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveMainTab(t.key)}
              className={`relative px-4 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeMainTab === t.key
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
              {!!t.badge && t.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold leading-none">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="flex-1 px-4 lg:px-8 py-6 overflow-auto">
        {liveOpsError && (
          <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm flex-1">Impossible de charger les données : {liveOpsError}</p>
            <button
              onClick={fetchLiveData}
              className="text-sm font-semibold underline hover:no-underline shrink-0"
            >
              Réessayer
            </button>
          </div>
        )}

        {liveOpsLoading && !liveOps && !liveOpsError ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-sm text-gray-500">Connexion au flux temps réel…</p>
          </div>
        ) : (
          <>
            {activeMainTab === 'overview' && (
              <OverviewTab
                actions={actions}
                topSpots={liveOps?.topSpots ?? []}
                onSelectAction={setSelectedAction}
              />
            )}

            {activeMainTab === 'visitors' && (
              liveOps ? (
                <SessionTimeline sessions={liveOps.sessions || []} allActions={liveOps.recentActions || []} />
              ) : (
                <EmptyState title="Aucune session" hint="Les sessions visiteurs apparaîtront ici." />
              )
            )}

            {activeMainTab === 'actions' && (
              actions.length > 0 ? (
                <LiveActionsFeed actions={actions} onSelectAction={setSelectedAction} />
              ) : (
                <EmptyState title="Aucune action enregistrée" hint="Le flux se remplira dès la première interaction." />
              )
            )}

            {activeMainTab === 'messages' && (
              <MessagesTab
                messages={liveOps?.recentMessages ?? []}
                onMarkRead={markMessageRead}
                onDelete={deleteMessage}
              />
            )}

            {activeMainTab === 'stats' && (
              liveOps ? <StatsTab liveOps={liveOps} /> : (
                <EmptyState title="Statistiques indisponibles" hint="Vérifiez la connexion au serveur." />
              )
            )}
          </>
        )}
      </div>

      <ActionDetailModal action={selectedAction} onClose={() => setSelectedAction(null)} />
    </div>
  );
}
