import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Ban,
  Search,
} from 'lucide-react';
import type { SecurityAlert, EndpointStat } from '../../types/dashboard';

interface SecurityAlertsPanelProps {
  alerts: SecurityAlert[];
  endpoints: EndpointStat[];
}

const severityColor: Record<SecurityAlert['severity'], string> = {
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusColor: Record<SecurityAlert['status'], string> = {
  active: 'bg-red-500/20 text-red-400 border-red-500/30',
  mitigated: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  investigating: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const categoryLabel: Record<SecurityAlert['category'], string> = {
  ddos: 'DDoS',
  bruteforce: 'Brute Force',
  sqli: 'SQL Injection',
  anomaly: 'Anomalie',
  waf: 'WAF',
};

const categoryColor: Record<SecurityAlert['category'], string> = {
  ddos: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  bruteforce: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  sqli: 'bg-red-500/20 text-red-400 border-red-500/30',
  anomaly: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  waf: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const categoryIcon: Record<SecurityAlert['category'], React.ElementType> = {
  ddos: Globe,
  bruteforce: Ban,
  sqli: AlertTriangle,
  anomaly: Search,
  waf: ShieldCheck,
};

const endpointStatusColor: Record<EndpointStat['status'], string> = {
  nominal: 'text-emerald-400',
  degraded: 'text-yellow-400',
  critical: 'text-red-400',
};

export const SecurityAlertsPanel = ({
  alerts,
  endpoints,
}: SecurityAlertsPanelProps) => {
  const problemEndpoints = endpoints.filter(
    (e) => e.status === 'critical' || e.status === 'degraded'
  );

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Alertes Sécurité
          </h3>
        </div>
        <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold px-2 py-0.5 rounded-full">
          {alerts.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
        {alerts.map((alert) => {
          const CatIcon = categoryIcon[alert.category];
          return (
            <div
              key={alert.id}
              className={`border rounded-lg p-3 flex flex-col gap-2 ${
                alert.severity === 'critical' && alert.status === 'active'
                  ? 'border-red-500/40 bg-red-500/5 animate-pulse'
                  : 'border-slate-800 bg-slate-800/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${severityColor[alert.severity]}`}
                  >
                    {alert.severity}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${statusColor[alert.status]}`}
                  >
                    {alert.status}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-medium uppercase px-1.5 py-0.5 rounded border ${categoryColor[alert.category]}`}
                  >
                    <CatIcon className="w-3 h-3" />
                    {categoryLabel[alert.category]}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-100">
                  {alert.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {alert.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {alert.sourceIp}
                </span>
                <span>{alert.timestamp}</span>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                {alert.mitigation}
              </p>
            </div>
          );
        })}

        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-slate-600">
            <ShieldCheck className="w-8 h-8 mb-2" />
            <p className="text-xs">Aucune alerte active</p>
          </div>
        )}
      </div>

      {problemEndpoints.length > 0 && (
        <div className="border-t border-slate-800 pt-3">
          <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Endpoints Monitor
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-slate-500 uppercase tracking-wider">
                  <th className="text-left font-medium pb-1.5">Méthode</th>
                  <th className="text-left font-medium pb-1.5">Endpoint</th>
                  <th className="text-right font-medium pb-1.5">Latence</th>
                  <th className="text-right font-medium pb-1.5">Err/s</th>
                  <th className="text-right font-medium pb-1.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {problemEndpoints.map((ep) => (
                  <tr key={`${ep.method}-${ep.path}`}>
                    <td className="py-1.5">
                      <span className="font-mono font-semibold text-slate-300">
                        {ep.method}
                      </span>
                    </td>
                    <td className="py-1.5 text-slate-400 font-mono truncate max-w-[180px]">
                      {ep.path}
                    </td>
                    <td className="py-1.5 text-right text-slate-300">
                      {ep.avgLatencyMs} ms
                    </td>
                    <td className="py-1.5 text-right text-red-400 font-medium">
                      {ep.errorCount}
                    </td>
                    <td
                      className={`py-1.5 text-right font-semibold uppercase ${endpointStatusColor[ep.status]}`}
                    >
                      {ep.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
