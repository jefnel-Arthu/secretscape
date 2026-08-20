import { MetricDataPoint, EndpointStat } from '../../types/dashboard';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { Zap, Globe, ArrowDown, ArrowUp } from 'lucide-react';

interface NetworkTrafficViewProps {
  metrics: MetricDataPoint[];
  endpoints: EndpointStat[];
}

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  PATCH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function statusDot(errorCount: number) {
  if (errorCount === 0) return 'bg-emerald-400';
  if (errorCount < 10) return 'bg-amber-400';
  return 'bg-red-400';
}

export const NetworkTrafficView = ({ metrics, endpoints }: NetworkTrafficViewProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inbound / Outbound Area Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-medium text-slate-200">Débit Réseau (Mbps)</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  color: '#e2e8f0',
                }}
              />
              <Area
                type="monotone"
                dataKey="inboundMbps"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.15}
                strokeWidth={2}
                name="Entrant"
                icon={<ArrowDown className="h-3 w-3" />}
              />
              <Area
                type="monotone"
                dataKey="outboundMbps"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.15}
                strokeWidth={2}
                name="Sortant"
                icon={<ArrowUp className="h-3 w-3" />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Latency & Requests Line Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-slate-200">Latence & Requêtes</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="latency"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="requests"
                orientation="right"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  color: '#e2e8f0',
                }}
              />
              <Line
                yAxisId="latency"
                type="monotone"
                dataKey="latencyMs"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Latence (ms)"
              />
              <Line
                yAxisId="requests"
                type="monotone"
                dataKey="requestsPerSec"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="Requêtes/s"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-medium text-slate-200">Endpoints API</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Path</th>
                <th className="pb-3 font-medium">Method</th>
                <th className="pb-3 font-medium">Latence moy. (ms)</th>
                <th className="pb-3 font-medium">P99 (ms)</th>
                <th className="pb-3 font-medium">Requêtes/s</th>
                <th className="pb-3 font-medium">Erreurs</th>
                <th className="pb-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep) => (
                <tr
                  key={`${ep.method}-${ep.path}`}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 text-slate-200 font-mono text-xs">{ep.path}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${
                        methodColors[ep.method] ?? 'bg-slate-700/30 text-slate-400 border-slate-600/30'
                      }`}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{ep.avgLatencyMs.toFixed(1)}</td>
                  <td className="py-3 text-slate-300">{ep.p99LatencyMs.toFixed(1)}</td>
                  <td className="py-3 text-slate-300">{ep.requestsPerSec.toFixed(1)}</td>
                  <td className="py-3 text-slate-300">{ep.errorCount}</td>
                  <td className="py-3">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusDot(ep.errorCount)}`} />
                  </td>
                </tr>
              ))}
              {endpoints.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Aucun endpoint disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
