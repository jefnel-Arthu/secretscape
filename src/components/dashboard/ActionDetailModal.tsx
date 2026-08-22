import React from 'react';
import { X, Globe, Clock, Server, MapPin, User, Shield, Copy, ExternalLink } from 'lucide-react';
import type { UserAction, ActionCategory, ActionSeverity } from '../../types/dashboard';
import { useState } from 'react';

interface ActionDetailModalProps {
  action: UserAction | null;
  onClose: () => void;
}

const categoryBadge: Record<ActionCategory, string> = {
  booking: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  gameplay: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  auth: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  payment: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  navigation: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  security: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  page_view: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

const severityBadge: Record<ActionSeverity, string> = {
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  critical: 'bg-red-500/15 text-red-400 border-red-500/25',
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</span>
    <span className="text-sm text-slate-200 font-mono truncate">{value ?? '—'}</span>
  </div>
);

export const ActionDetailModal: React.FC<ActionDetailModalProps> = ({ action, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!action) return null;

  const jsonData = action.metadata ?? action;
  const jsonString = JSON.stringify(jsonData, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-slate-700/50">
          <div className="flex flex-col gap-2 min-w-0">
            <h2 className="text-lg font-bold text-slate-100 truncate">{action.action}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${categoryBadge[action.category]}`}>
                {action.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${severityBadge[action.severity]}`}>
                {action.severity}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Grid details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
              <div className="flex items-center gap-1.5 text-slate-400">
                <User size={13} />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Utilisateur</span>
              </div>
              <DetailRow label="Nom" value={action.userName} />
              <DetailRow label="ID" value={action.userId} />
              <DetailRow label="Adresse IP" value={action.ipAddress} />
            </div>

            <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin size={13} />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Localisation</span>
              </div>
              <DetailRow label="Ville" value={`${action.userLocation.flag} ${action.userLocation.city}`} />
              <DetailRow label="Pays" value={`${action.userLocation.country} (${action.userLocation.countryCode})`} />
              <DetailRow label="Lat / Lng" value={`${action.userLocation.lat}, ${action.userLocation.lng}`} />
            </div>

            <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Server size={13} />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Requête</span>
              </div>
              <DetailRow label="Endpoint" value={action.endpoint} />
              <DetailRow label="Status" value={action.statusCode} />
              <DetailRow label="Durée" value={`${action.durationMs} ms`} />
            </div>

            <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock size={13} />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Temps</span>
              </div>
              <DetailRow label="Timestamp" value={action.timestamp} />
              <DetailRow label="ISO" value={action.isoTime} />
              {action.roomName && (
                <>
                  <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                    <Globe size={13} />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Room</span>
                  </div>
                  <DetailRow label="Nom" value={action.roomName} />
                </>
              )}
            </div>
          </div>

          {/* Metadata JSON */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Shield size={13} />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Métadonnées JSON</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/50 transition-colors"
              >
                <Copy size={12} />
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/30 text-xs text-slate-300 font-mono overflow-x-auto max-h-48 overflow-y-auto">
              {jsonString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
