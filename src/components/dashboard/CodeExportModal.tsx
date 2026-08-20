import React from 'react';
import { useState } from 'react';
import { X, Code, Download, Copy, Check } from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = ['Installation', 'Composant', 'SDK Télémétrie'] as const;

const codeBlocks: Record<(typeof tabs)[number], string> = {
  Installation: `npm install recharts lucide-react`,
  Composant: `import { VisitorAnalytics } from './components/dashboard/VisitorAnalytics';
import { MetricCards } from './components/dashboard/MetricCards';
import { LiveActionsFeed } from './components/dashboard/LiveActionsFeed';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <MetricCards
        totalVisitors={1234}
        activeNow={56}
        revenue={89000}
        conversionRate={12.5}
      />
      <VisitorAnalytics
        escapeRooms={rooms}
        metrics={metrics}
      />
      <LiveActionsFeed
        actions={liveActions}
        onRefresh={handleRefresh}
      />
    </div>
  );
}`,
  'SDK Télémétrie': `const API_URL = 'https://api.tourisme-benin.com';

async function connectTelemetry() {
  const response = await fetch(API_URL + '/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY',
    },
    body: JSON.stringify({
      event: 'visitor_check_in',
      venue: 'Porte de Nonvides',
      timestamp: new Date().toISOString(),
      metadata: {
        zone: 'Entree Principale',
        visitorType: 'individual',
      },
    }),
  });

  const data = await response.json();
  console.log('Event sent:', data.id);
  return data;
}

// Connect SSE stream for live updates
const evtSource = new EventSource(API_URL + '/stream');
evtSource.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Live update:', update);
};`,
};

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Installation');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeBlocks[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 900 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
              <Code size={18} />
            </div>
            <h2 className="text-lg font-semibold text-slate-100">Code & Intégration</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCopied(false); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-slate-800 text-slate-100 border border-slate-600/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="relative">
            <pre className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">
              {codeBlocks[activeTab]}
            </pre>

            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/50 text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">Copié!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-700/50">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
            <Download size={14} />
            Télécharger le projet
          </button>
        </div>
      </div>
    </div>
  );
};
