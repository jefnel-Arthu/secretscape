import React, { useState, useEffect } from 'react';
import {
  Activity, Network, Server, Layers, Gamepad2, ShieldAlert
} from 'lucide-react';
import {
  MetricDataPoint, UserAction, TrafficPreset, SecurityAlert,
  EscapeRoomPerformance, SystemNode, EndpointStat
} from '../types/dashboard';
import {
  generateInitialMetrics, generateNextMetricPoint, generateInitialActions,
  generateRandomUserAction, ESCAPE_ROOMS, INITIAL_SYSTEM_NODES,
  INITIAL_ENDPOINTS, INITIAL_ALERTS
} from '../data/mockEngine';
import { playSound } from '../utils/audio';
import { DashboardHeader } from './dashboard/Header';
import { MetricCards } from './dashboard/MetricCards';
import { NetworkTrafficView } from './dashboard/NetworkTrafficView';
import { SystemPerformanceView } from './dashboard/SystemPerformanceView';
import { LiveActionsFeed } from './dashboard/LiveActionsFeed';
import { VisitorAnalytics } from './dashboard/VisitorAnalytics';
import { SecurityAlertsPanel } from './dashboard/SecurityAlertsPanel';
import { ActionDetailModal } from './dashboard/ActionDetailModal';
import { AiOpsAssistantModal } from './dashboard/AiOpsAssistantModal';
import { CodeExportModal } from './dashboard/CodeExportModal';

export default function SecretScapeDashboard() {
  const [metrics, setMetrics] = useState<MetricDataPoint[]>(generateInitialMetrics);
  const [actions, setActions] = useState<UserAction[]>(() => generateInitialActions(20));
  const [nodes, setNodes] = useState<SystemNode[]>(INITIAL_SYSTEM_NODES);
  const [endpoints, setEndpoints] = useState<EndpointStat[]>(INITIAL_ENDPOINTS);
  const [escapeRooms, setEscapeRooms] = useState<EscapeRoomPerformance[]>(ESCAPE_ROOMS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);

  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [preset, setPreset] = useState<TrafficPreset>('normal');
  const [refreshInterval, setRefreshInterval] = useState<number>(2000);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeMainTab, setActiveMainTab] = useState<'overview' | 'network' | 'system' | 'actions' | 'rooms' | 'security'>('overview');

  const [selectedAction, setSelectedAction] = useState<UserAction | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isCodeExportOpen, setIsCodeExportOpen] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState<string>(() =>
    new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  const [totalBookingsToday, setTotalBookingsToday] = useState<number>(142);
  const [totalRevenueToday, setTotalRevenueToday] = useState<number>(20450);

  const currentMetric = metrics[metrics.length - 1] || metrics[0];
  const prevMetric = metrics.length > 1 ? metrics[metrics.length - 2] : undefined;

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setMetrics((prev) => {
        const last = prev[prev.length - 1];
        const next = generateNextMetricPoint(last, preset);
        return [...prev.slice(1), next];
      });

      const newAction = generateRandomUserAction();
      setActions((prev) => [newAction, ...prev.slice(0, 49)]);

      if (newAction.category === 'booking' || newAction.category === 'payment') {
        setTotalBookingsToday((prev) => prev + 1);
        setTotalRevenueToday((prev) => prev + (Math.floor(Math.random() * 80) + 120));
        if (soundEnabled) playSound('success');
      } else if (newAction.severity === 'critical') {
        if (soundEnabled) playSound('alert');
      }

      setEndpoints((prev) =>
        prev.map((ep) => ({
          ...ep,
          requestsPerSec: Math.max(10, ep.requestsPerSec + Math.floor(Math.random() * 20 - 10)),
          avgLatencyMs: Math.max(8, ep.avgLatencyMs + Math.floor(Math.random() * 6 - 3))
        }))
      );
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isStreaming, refreshInterval, preset, soundEnabled]);

  const mainTabs: { key: typeof activeMainTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: <Activity className="w-4 h-4" /> },
    { key: 'network', label: 'Réseau', icon: <Network className="w-4 h-4" /> },
    { key: 'system', label: 'Système', icon: <Server className="w-4 h-4" /> },
    { key: 'actions', label: 'Actions', icon: <Layers className="w-4 h-4" /> },
    { key: 'rooms', label: 'Escape Rooms', icon: <Gamepad2 className="w-4 h-4" /> },
    { key: 'security', label: 'Sécurité', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <DashboardHeader
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        preset={preset}
        onSelectPreset={setPreset}
        refreshInterval={refreshInterval}
        onChangeInterval={setRefreshInterval}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onTriggerAction={() => {}}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenCodeExport={() => setIsCodeExportOpen(true)}
        currentTime={currentTime}
      />

      <div className="px-4 lg:px-8 py-4">
        <MetricCards
          current={currentMetric}
          prev={prevMetric}
          totalBookingsToday={totalBookingsToday}
          totalRevenueToday={totalRevenueToday}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NetworkTrafficView metrics={metrics} endpoints={endpoints} />
              <LiveActionsFeed actions={actions} onSelectAction={setSelectedAction} />
            </div>
            <SecurityAlertsPanel alerts={alerts} endpoints={endpoints} />
          </div>
        )}

        {activeMainTab === 'network' && (
          <NetworkTrafficView metrics={metrics} endpoints={endpoints} />
        )}

        {activeMainTab === 'system' && (
          <SystemPerformanceView metrics={metrics} nodes={nodes} />
        )}

        {activeMainTab === 'actions' && (
          <LiveActionsFeed actions={actions} onSelectAction={setSelectedAction} />
        )}

        {activeMainTab === 'rooms' && (
          <VisitorAnalytics escapeRooms={escapeRooms} metrics={metrics} />
        )}

        {activeMainTab === 'security' && (
          <SecurityAlertsPanel alerts={alerts} endpoints={endpoints} />
        )}
      </div>

      <ActionDetailModal action={selectedAction} onClose={() => setSelectedAction(null)} />
      <AiOpsAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        metrics={metrics}
        alerts={alerts}
        nodes={nodes}
      />
      <CodeExportModal isOpen={isCodeExportOpen} onClose={() => setIsCodeExportOpen(false)} />
    </div>
  );
}
