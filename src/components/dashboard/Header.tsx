import React from 'react';
import { Play, Pause, Volume2, VolumeX, Bot, Code, Clock, Zap, Activity, Radio } from 'lucide-react';
import type { TrafficPreset } from '../../types/dashboard';

interface DashboardHeaderProps {
  isStreaming: boolean;
  onToggleStreaming: () => void;
  preset: TrafficPreset;
  onSelectPreset: (p: TrafficPreset) => void;
  refreshInterval: number;
  onChangeInterval: (ms: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTriggerAction: () => void;
  onOpenAiAssistant: () => void;
  onOpenCodeExport: () => void;
  currentTime: string;
}

const presets: { value: TrafficPreset; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'normal', label: 'Normal', icon: <Activity size={12} />, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { value: 'surge', label: 'Surge', icon: <Zap size={12} />, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { value: 'incident', label: 'Incident', icon: <Radio size={12} />, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'sale', label: 'Sale', icon: <Clock size={12} />, color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
];

const intervals = [
  { value: 1000, label: '1s' },
  { value: 2000, label: '2s' },
  { value: 5000, label: '5s' },
  { value: 10000, label: '10s' },
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isStreaming,
  onToggleStreaming,
  preset,
  onSelectPreset,
  refreshInterval,
  onChangeInterval,
  soundEnabled,
  onToggleSound,
  onOpenAiAssistant,
  onOpenCodeExport,
  currentTime,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-700/50">
      {/* Left section: branding + time */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">
            SecretScape Live Ops
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-400">
          <Clock size={14} />
          <span className="font-mono tabular-nums">{currentTime}</span>
        </div>
      </div>

      {/* Center section: controls */}
      <div className="flex items-center gap-3">
        {/* Play / Pause */}
        <button
          onClick={onToggleStreaming}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isStreaming
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
              : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700'
          }`}
        >
          {isStreaming ? <Pause size={14} /> : <Play size={14} />}
          {isStreaming ? 'Pause' : 'Play'}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-700/50" />

        {/* Traffic presets */}
        <div className="flex items-center gap-1">
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => onSelectPreset(p.value)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                preset === p.value
                  ? `${p.color} ring-1 ring-inset ring-white/10`
                  : 'bg-slate-800/50 text-slate-500 border-slate-700/50 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {p.icon}
              {p.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-700/50" />

        {/* Refresh interval */}
        <div className="flex items-center gap-1">
          {intervals.map((i) => (
            <button
              key={i.value}
              onClick={() => onChangeInterval(i.value)}
              className={`px-2 py-1 rounded text-xs font-mono font-medium transition-colors ${
                refreshInterval === i.value
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-slate-800/50 text-slate-500 border border-slate-700/50 hover:text-slate-300'
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right section: actions */}
      <div className="flex items-center gap-2">
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-md transition-colors ${
            soundEnabled
              ? 'bg-slate-700/50 text-slate-200 hover:bg-slate-700'
              : 'bg-slate-800/50 text-slate-500 hover:bg-slate-700/50 hover:text-slate-300'
          }`}
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-700/50" />

        {/* AI Assistant */}
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
        >
          <Bot size={14} />
          AI Assistant
        </button>

        {/* Code & Integration */}
        <button
          onClick={onOpenCodeExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700 transition-colors"
        >
          <Code size={14} />
          Code &amp; Intégration
        </button>
      </div>
    </header>
  );
};
