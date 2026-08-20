import React, { useState, useEffect } from 'react';
import { 
  Activity, ShieldCheck, Zap, Server, 
  ShoppingBag, Clock, Users, ArrowUpRight, ArrowDownRight,
  Sparkles, Play, Pause, AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, BarChart, Bar, CartesianGrid 
} from 'recharts';

export interface TelemetryPoint {
  time: string;
  bandwidthInMbps: number;
  bandwidthOutMbps: number;
  requestsPerSecond: number;
  latencyMs: number;
  cpuUsage: number;
  ramUsage: number;
  activeUsers: number;
}

export interface UserActionItem {
  id: string;
  timestamp: string;
  userName: string;
  actionName: string;
  roomName: string;
  category: 'booking' | 'gameplay' | 'payment' | 'auth' | 'security';
  details: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
}

export default function SecretScapeDashboard() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [metrics, setMetrics] = useState<TelemetryPoint[]>([
    { time: '14:20:00', bandwidthInMbps: 240, bandwidthOutMbps: 380, requestsPerSecond: 120, latencyMs: 18, cpuUsage: 34, ramUsage: 48, activeUsers: 412 },
    { time: '14:20:02', bandwidthInMbps: 280, bandwidthOutMbps: 420, requestsPerSecond: 135, latencyMs: 22, cpuUsage: 38, ramUsage: 49, activeUsers: 425 },
    { time: '14:20:04', bandwidthInMbps: 310, bandwidthOutMbps: 460, requestsPerSecond: 152, latencyMs: 19, cpuUsage: 42, ramUsage: 50, activeUsers: 438 },
  ]);

  const [actions, setActions] = useState<UserActionItem[]>([
    {
      id: 'act-1',
      timestamp: '14:20:04',
      userName: 'Sophie Martin',
      actionName: 'Réservation Confirmée',
      roomName: 'Cyber Bunker 2099',
      category: 'booking',
      details: 'Créneau 21h00 validé • 5 Joueurs • 160 €',
      severity: 'success'
    },
    {
      id: 'act-2',
      timestamp: '14:20:02',
      userName: 'Thomas Laurent',
      actionName: 'Indice Demandé',
      roomName: 'The Shadow Society Vault',
      category: 'gameplay',
      details: 'GameMaster a transmis l\'indice sonore n°2',
      severity: 'info'
    },
    {
      id: 'act-3',
      timestamp: '14:20:00',
      userName: 'IP 185.220.101.4',
      actionName: 'Tentative Brute-Force WAF',
      roomName: 'Auth Gateway',
      category: 'security',
      details: '5 requêtes erronées en 2s • IP bannie temporairement',
      severity: 'critical'
    }
  ]);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString('fr-FR');
      const prev = metrics[metrics.length - 1] || {
        bandwidthInMbps: 250,
        bandwidthOutMbps: 400,
        requestsPerSecond: 130,
        latencyMs: 20,
        cpuUsage: 35,
        ramUsage: 50,
        activeUsers: 420
      };

      const nextPoint: TelemetryPoint = {
        time: now,
        bandwidthInMbps: Math.max(80, Math.min(800, prev.bandwidthInMbps + (Math.random() * 40 - 20))),
        bandwidthOutMbps: Math.max(120, Math.min(1200, prev.bandwidthOutMbps + (Math.random() * 60 - 30))),
        requestsPerSecond: Math.max(40, Math.min(400, prev.requestsPerSecond + (Math.random() * 20 - 10))),
        latencyMs: Math.max(10, Math.min(150, prev.latencyMs + (Math.random() * 8 - 4))),
        cpuUsage: Math.max(15, Math.min(95, prev.cpuUsage + (Math.random() * 6 - 3))),
        ramUsage: Math.max(30, Math.min(85, prev.ramUsage + (Math.random() * 2 - 1))),
        activeUsers: Math.max(200, Math.min(900, prev.activeUsers + Math.floor(Math.random() * 9 - 4)))
      };

      setMetrics(old => [...old.slice(Math.max(0, old.length - 20)), nextPoint]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming, metrics]);

  const current = metrics[metrics.length - 1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              SecretScape Live Ops &bull; Centre de Contrôle
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supervision réseau, performances serveurs et télémétrie des utilisateurs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isStreaming ? 'Flux Actif' : 'En Pause'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Touristes Connectés</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">{current?.activeUsers}</div>
          <span className="text-[11px] text-emerald-400 mt-2 block flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% cette dernière heure
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Requêtes / Sec (QPS)</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">{Math.round(current?.requestsPerSecond || 0)} req/s</div>
          <span className="text-[11px] text-slate-400 mt-2 block">Latence moy. {Math.round(current?.latencyMs || 0)} ms</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Bande Passante</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{Math.round(current?.bandwidthOutMbps || 0)} Mbps</div>
          <span className="text-[11px] text-slate-400 mt-2 block">In: {Math.round(current?.bandwidthInMbps || 0)} Mbps</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Charge Serveur (CPU / RAM)</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {Math.round(current?.cpuUsage || 0)}% <span className="text-xs font-normal text-slate-400">/ {Math.round(current?.ramUsage || 0)}%</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-2 block">Clusters Edge Paris & Francfort OK</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Débit Réseau & Bande Passante (Mbps)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="bandwidthOutMbps" name="Sortant" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                <Area type="monotone" dataKey="bandwidthInMbps" name="Entrant" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            Charge Processeur & Mémoire (%)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="cpuUsage" name="CPU %" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                <Area type="monotone" dataKey="ramUsage" name="RAM %" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Journal des Actions & Réservations Récentes
          </h3>
          <span className="text-xs text-slate-500 font-mono">En direct</span>
        </div>
        <div className="divide-y divide-slate-800/60">
          {actions.map(action => (
            <div key={action.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  action.severity === 'success' ? 'bg-emerald-400' :
                  action.severity === 'critical' ? 'bg-rose-500' : 'bg-blue-400'
                }`} />
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    {action.actionName} &bull; <span className="text-slate-400 font-normal">{action.roomName}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{action.details}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400">{action.timestamp}</span>
                <div className="text-[11px] text-slate-500">{action.userName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
