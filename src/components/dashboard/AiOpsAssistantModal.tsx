import React, { useState, useMemo } from 'react';
import { X, Bot, Send, Sparkles, AlertTriangle, Server, Activity } from 'lucide-react';
import { MetricDataPoint, SecurityAlert, SystemNode } from '../../types/dashboard';

interface AiOpsAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: MetricDataPoint[];
  alerts: SecurityAlert[];
  nodes: SystemNode[];
}

export const AiOpsAssistantModal: React.FC<AiOpsAssistantModalProps> = ({
  isOpen,
  onClose,
  metrics,
  alerts,
  nodes,
}) => {
  const [message, setMessage] = useState('');

  const analysis = useMemo(() => {
    const latest = metrics[metrics.length - 1];
    const avgCpu = metrics.reduce((sum, m) => sum + m.cpuPercent, 0) / (metrics.length || 1);
    const avgRam = metrics.reduce((sum, m) => sum + m.memoryPercent, 0) / (metrics.length || 1);
    const avgLatency = metrics.reduce((sum, m) => sum + m.latencyMs, 0) / (metrics.length || 1);
    const avgErrorRate = metrics.reduce((sum, m) => sum + m.errorRate, 0) / (metrics.length || 1);
    const avgCacheHit = metrics.reduce((sum, m) => sum + m.cacheHitRatio, 0) / (metrics.length || 1);

    const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && a.status === 'active');
    const activeAlerts = alerts.filter((a) => a.status === 'active');

    const healthyNodes = nodes.filter((n) => n.status === 'healthy');
    const warningNodes = nodes.filter((n) => n.status === 'warning');
    const degradedNodes = nodes.filter((n) => n.status === 'degraded');

    const recommendations: string[] = [];
    if (latest && latest.cpuPercent > 70) recommendations.push('Augmenter les ressources serveur');
    if (latest && latest.latencyMs > 100) recommendations.push('Investiguer le bottleneck réseau');
    if (criticalAlerts.length > 0) recommendations.push('Priorité: investiguer les alertes critiques');
    if (latest && latest.cacheHitRatio < 90) recommendations.push('Optimiser le cache Redis');
    if (recommendations.length === 0) recommendations.push('Système en bonne santé - Aucune action requise');

    return {
      latest,
      avgCpu: avgCpu.toFixed(1),
      avgRam: avgRam.toFixed(1),
      avgLatency: avgLatency.toFixed(1),
      avgErrorRate: avgErrorRate.toFixed(2),
      avgCacheHit: avgCacheHit.toFixed(1),
      criticalAlerts,
      activeAlerts,
      healthyNodes,
      warningNodes,
      degradedNodes,
      recommendations,
    };
  }, [metrics, alerts, nodes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-700/50 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">AI Ops Assistant</h3>
              <p className="text-slate-400 text-xs">Analyse en temps réel de vos systèmes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analysis Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {metrics.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-10">Aucune donnée disponible pour analyser.</p>
          ) : (
            <>
              {/* System Health Summary */}
              <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-sm uppercase tracking-wider">Santé du Système</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">CPU (moy)</span>
                    <span className={`font-bold text-lg ${Number(analysis.avgCpu) > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {analysis.avgCpu}%
                    </span>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">RAM (moy)</span>
                    <span className={`font-bold text-lg ${Number(analysis.avgRam) > 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {analysis.avgRam}%
                    </span>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">Latence (moy)</span>
                    <span className={`font-bold text-lg ${Number(analysis.avgLatency) > 100 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {analysis.avgLatency}ms
                    </span>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">Cache Hit (moy)</span>
                    <span className={`font-bold text-lg ${Number(analysis.avgCacheHit) < 90 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {analysis.avgCacheHit}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Alerts Summary */}
              <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-sm uppercase tracking-wider">Alertes de Sécurité</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50 text-center">
                    <span className="text-slate-400 block mb-1">Critiques</span>
                    <span className={`font-bold text-lg ${analysis.criticalAlerts.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {analysis.criticalAlerts.length}
                    </span>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50 text-center">
                    <span className="text-slate-400 block mb-1">Actives</span>
                    <span className={`font-bold text-lg ${analysis.activeAlerts.length > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {analysis.activeAlerts.length}
                    </span>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50 text-center">
                    <span className="text-slate-400 block mb-1">Total</span>
                    <span className="font-bold text-lg text-slate-300">
                      {alerts.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Node Status Overview */}
              <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-sm uppercase tracking-wider">État des Nœuds</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50 text-center">
                    <span className="text-slate-400 block mb-1">Sains</span>
                    <span className="font-bold text-lg text-emerald-400">{analysis.healthyNodes.length}</span>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50 text-center">
                    <span className="text-slate-400 block mb-1">Avertissement</span>
                    <span className="font-bold text-lg text-amber-400">{analysis.warningNodes.length}</span>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/50 text-center">
                    <span className="text-slate-400 block mb-1">Dégradé</span>
                    <span className={`font-bold text-lg ${analysis.degradedNodes.length > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                      {analysis.degradedNodes.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-xl p-4 space-y-3 border border-violet-500/20">
                <div className="flex items-center gap-2 text-violet-300">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold text-sm uppercase tracking-wider">Recommandations IA</span>
                </div>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-violet-400 mt-0.5 shrink-0">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Demandez à l'assistant ops..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <button
              className="p-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors shadow-lg shadow-violet-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
