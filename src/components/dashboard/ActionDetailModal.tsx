import React, { useState } from 'react';
import { X, Clock, Copy } from 'lucide-react';
import type { UserAction } from '../../types/dashboard';

interface ActionDetailModalProps {
  action: UserAction | null;
  onClose: () => void;
}

export const ActionDetailModal: React.FC<ActionDetailModalProps> = ({ action, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!action) return null;

  const jsonString = JSON.stringify(action, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">{action.action}</h2>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {action.timestamp}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Type', value: action.category },
              { label: 'Détails', value: action.details },
              { label: 'Utilisateur', value: action.userName || action.userId },
              { label: 'Localisation', value: `${action.userLocation.flag} ${action.userLocation.city}` },
              { label: 'Endpoint', value: action.endpoint },
              { label: 'Sévérité', value: action.severity },
            ].map(row => (
              <div key={row.label} className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{row.label}</p>
                <p className="text-xs text-gray-700 font-medium truncate mt-0.5">{row.value}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-400 uppercase font-medium">JSON</span>
              <button onClick={handleCopy} className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <Copy className="w-3 h-3" /> {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <pre className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-600 font-mono overflow-x-auto max-h-40">
              {jsonString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
