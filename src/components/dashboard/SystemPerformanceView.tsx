import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Server, Cpu, HardDrive, Wifi, Thermometer } from 'lucide-react';
import { MetricDataPoint, SystemNode } from '../../types/dashboard';

interface SystemPerformanceViewProps {
  metrics: MetricDataPoint[];
  nodes: SystemNode[];
}

const statusStyles: Record<SystemNode['status'], { bg: string; text: string; dot: string }> = {
  healthy: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  degraded: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
};

function NodeCard({ node }: { node: SystemNode }) {
  const style = statusStyles[node.status];
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-100">{node.name}</p>
          <p className="text-xs text-slate-500">{node.region}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {node.status}
        </span>
      </div>

      {([
        { label: 'CPU', value: node.cpu, icon: Cpu, gradient: 'from-emerald-500 to-emerald-300' },
        { label: 'RAM', value: node.ram, icon: Server, gradient: 'from-violet-500 to-violet-300' },
        { label: 'Disk', value: node.disk, icon: HardDrive, gradient: 'from-sky-500 to-sky-300' },
      ] as const).map(({ label, value, gradient }) => (
        <div key={label} className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{label}</span>
            <span>{value}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}

      <div className="grid grid-cols-3 gap-2 pt-1">
        {([
          { icon: Wifi, label: 'Uptime', value: node.uptime },
          { icon: Thermometer, label: 'QPS', value: node.qps.toLocaleString() },
          { icon: Server, label: 'Threads', value: node.threads },
        ] as const).map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-xs font-medium text-slate-200">{value}</span>
            <span className="text-[10px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-medium text-slate-300">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
        </p>
      ))}
    </div>
  );
}

export const SystemPerformanceView = ({ metrics, nodes }: SystemPerformanceViewProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {nodes.map((node) => (
          <React.Fragment key={node.id}>
            <NodeCard node={node} />
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">Charge CPU &amp; RAM (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="cpuPercent" name="CPU %" stroke="#10b981" fill="url(#gradCpu)" strokeWidth={2} />
                <Area type="monotone" dataKey="memoryPercent" name="RAM %" stroke="#8b5cf6" fill="url(#gradMem)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">Base de données</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradDb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradCache" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="dbQueriesPerSec" name="Requêtes/s" stroke="#3b82f6" fill="url(#gradDb)" strokeWidth={2} />
                <Area type="monotone" dataKey="cacheHitRatio" name="Cache Hit %" stroke="#f59e0b" fill="url(#gradCache)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
