import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock, BarChart3, Mail, Bookmark, Map, Eye, CheckCircle, Trash2, LogOut, Loader2, Activity
} from 'lucide-react';
import SecretScapeDashboard from './SecretScapeDashboard';

interface AdminPanelProps {
  onClose: () => void;
}

interface Stats {
  pageViews: number;
  totalSpotViews: number;
  totalFavorites: number;
  totalMessages: number;
  unreadMessages: number;
  totalSpots: number;
  topSpots: { id: string; views: number }[];
  topFavs: { id: string; count: number }[];
}

interface Message {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  subject: string;
  arrivalDate: string;
  tripDuration: string;
  adults: string;
  children: string;
  budget: string;
  tripType: string;
  accommodation: string;
  transport: string;
  guide: string;
  foodPreferences: string;
  message: string;
  date: string;
  read: boolean;
}

type AdminTab = 'stats' | 'messages' | 'favorites' | 'spots' | 'liveops';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'x-admin-token': token || '',
  }), [token]);

  const handleLogin = async () => {
    setLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        setToken(data.token);
        localStorage.setItem('secretscape_admin_token', data.token);
      } else {
        setLoginError(data.error || 'Erreur');
      }
    } catch {
      setLoginError('Erreur de connexion');
    }
    setLoading(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('secretscape_admin_token');
    if (saved) setToken(saved);
  }, []);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/stats', { headers: headers() });
      if (res.ok) setStats(await res.json());
    } catch {}
  }, [token, headers]);

  const fetchMessages = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/messages', { headers: headers() });
      if (res.ok) setMessages((await res.json()).messages);
    } catch {}
  }, [token, headers]);

  useEffect(() => {
    if (token) {
      fetchStats();
      fetchMessages();
    }
  }, [token, fetchStats, fetchMessages]);

  const markRead = async (id: string) => {
    await fetch('/api/admin/messages/read', {
      method: 'POST', headers: headers(), body: JSON.stringify({ id }),
    });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    fetchStats();
  };

  const deleteMessage = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE', headers: headers() });
    setMessages(prev => prev.filter(m => m.id !== id));
    fetchStats();
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('secretscape_admin_token');
    onClose();
  };

  // ── Login screen ──
  if (!token) {
    return (
      <div className="fixed inset-0 z-[800] bg-black/60 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-display font-bold text-lg text-stone-900">Espace Admin</h2>
            <p className="text-xs text-stone-500 mt-1">Mot de passe requis</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Mot de passe"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          {loginError && <p className="text-xs text-red-500 text-center">{loginError}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>Se connecter</span>
          </button>
          <button onClick={onClose} className="w-full text-center text-xs text-stone-400 hover:text-stone-600">
            Annuler
          </button>
        </div>
      </div>
    );
  }

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'stats', label: 'Statistiques', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'liveops', label: 'Live Ops', icon: <Activity className="w-4 h-4" /> },
    { key: 'messages', label: `Messages${stats?.unreadMessages ? ` (${stats.unreadMessages})` : ''}`, icon: <Mail className="w-4 h-4" /> },
    { key: 'favorites', label: 'Favoris', icon: <Bookmark className="w-4 h-4" /> },
    { key: 'spots', label: 'Lieux', icon: <Map className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-[800] bg-stone-100 flex flex-col overflow-auto">
      {/* Top bar */}
      <div className="bg-stone-900 text-stone-100 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" />
          <span className="font-display font-bold text-sm">Admin SecretScape</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { fetchStats(); fetchMessages(); }} className="p-2 hover:bg-stone-800 rounded-lg text-xs text-stone-300 transition-colors">Rafraîchir</button>
          <button onClick={logout} className="p-2 hover:bg-stone-800 rounded-lg text-xs text-stone-300 flex items-center gap-1 transition-colors">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
          <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-lg text-xs text-stone-300 transition-colors">✕</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-200 px-4 flex items-center gap-1 overflow-x-auto shrink-0">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === t.key
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-400 hover:text-stone-600'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto">

        {/* ── Stats Tab ── */}
        {activeTab === 'stats' && stats && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="font-display font-bold text-lg text-stone-900">Tableau de bord</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Visites page', value: stats.pageViews, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                { label: 'Vues lieux', value: stats.totalSpotViews, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { label: 'Favoris ajoutés', value: stats.totalFavorites, color: 'text-rose-600 bg-rose-50 border-rose-200' },
                { label: 'Messages', value: stats.totalMessages, color: 'text-amber-600 bg-amber-50 border-amber-200' },
              ].map(c => (
                <div key={c.label} className={`rounded-2xl border p-4 ${c.color}`}>
                  <p className="text-2xl font-bold">{c.value}</p>
                  <p className="text-xs mt-1 opacity-70">{c.label}</p>
                </div>
              ))}
            </div>

            {stats.topSpots.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="font-display font-bold text-sm text-stone-900 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600" /> Lieux les plus vus
                </h3>
                <div className="space-y-2">
                  {stats.topSpots.map(s => (
                    <div key={s.id} className="flex items-center justify-between text-xs">
                      <span className="text-stone-700 truncate max-w-[200px]">{s.id}</span>
                      <span className="font-bold text-stone-900">{s.views}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.topFavs.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="font-display font-bold text-sm text-stone-900 mb-3 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-rose-500" /> Favoris les plus ajoutés
                </h3>
                <div className="space-y-2">
                  {stats.topFavs.map(s => (
                    <div key={s.id} className="flex items-center justify-between text-xs">
                      <span className="text-stone-700 truncate max-w-[200px]">{s.id}</span>
                      <span className="font-bold text-stone-900">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Live Ops Tab ── */}
        {activeTab === 'liveops' && (
          <SecretScapeDashboard />
        )}

        {/* ── Messages Tab ── */}
        {activeTab === 'messages' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="font-display font-bold text-lg text-stone-900">Messages reçus ({messages.length})</h2>
            {messages.length === 0 ? (
              <p className="text-xs text-stone-400 py-10 text-center">Aucun message pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`bg-white rounded-2xl border p-5 space-y-2 ${msg.read ? 'border-stone-200' : 'border-amber-300 bg-amber-50/30'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-stone-900">{msg.name}</span>
                          {!msg.read && <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">Nouveau</span>}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {msg.email}{msg.phone ? ` · ${msg.phone}` : ''}{msg.city ? ` · ${msg.city}` : ''}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {msg.subject} · {new Date(msg.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!msg.read && (
                          <button onClick={() => markRead(msg.id)} className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors" title="Marquer lu">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </button>
                        )}
                        <button onClick={() => deleteMessage(msg.id)} className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>

                    {msg.message && (
                      <p className="text-xs text-stone-600 bg-stone-50 rounded-xl p-3 whitespace-pre-wrap">{msg.message}</p>
                    )}

                    {(msg.arrivalDate || msg.tripDuration || msg.adults || msg.children || msg.budget || msg.tripType || msg.accommodation || msg.transport || msg.guide || msg.foodPreferences) && (
                      <div className="bg-stone-50 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        {msg.arrivalDate && <div><span className="text-stone-400">Arrivée:</span> <span className="font-medium">{msg.arrivalDate}</span></div>}
                        {msg.tripDuration && <div><span className="text-stone-400">Durée:</span> <span className="font-medium">{msg.tripDuration}j</span></div>}
                        {msg.adults && <div><span className="text-stone-400">Adultes:</span> <span className="font-medium">{msg.adults}</span></div>}
                        {msg.children && <div><span className="text-stone-400">Enfants:</span> <span className="font-medium">{msg.children}</span></div>}
                        {msg.budget && <div><span className="text-stone-400">Budget:</span> <span className="font-medium">{msg.budget} FCFA</span></div>}
                        {msg.tripType && <div><span className="text-stone-400">Type:</span> <span className="font-medium">{msg.tripType}</span></div>}
                        {msg.accommodation && <div><span className="text-stone-400">Hébergement:</span> <span className="font-medium">{msg.accommodation}</span></div>}
                        {msg.transport && <div><span className="text-stone-400">Transport:</span> <span className="font-medium">{msg.transport}</span></div>}
                        {msg.guide && <div><span className="text-stone-400">Guide:</span> <span className="font-medium">{msg.guide}</span></div>}
                        {msg.foodPreferences && <div className="col-span-full"><span className="text-stone-400">Préférences:</span> <span className="font-medium">{msg.foodPreferences}</span></div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Favorites Tab ── */}
        {activeTab === 'favorites' && stats && (
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="font-display font-bold text-lg text-stone-900">Favoris les plus populaires</h2>
            {stats.topFavs.length === 0 ? (
              <p className="text-xs text-stone-400 py-10 text-center">Aucun favori enregistré.</p>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50">
                      <th className="text-left px-4 py-3 font-semibold text-stone-600">ID du lieu</th>
                      <th className="text-right px-4 py-3 font-semibold text-stone-600">Favoris</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topFavs.map((s, i) => (
                      <tr key={s.id} className={`border-b border-stone-100 ${i === 0 ? 'bg-amber-50' : ''}`}>
                        <td className="px-4 py-3 text-stone-700 truncate max-w-[300px]">{s.id}</td>
                        <td className="px-4 py-3 text-right font-bold text-stone-900">{s.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Spots Tab ── */}
        {activeTab === 'spots' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="font-display font-bold text-lg text-stone-900">Gestion des lieux</h2>
            <p className="text-xs text-stone-500">
              Les lieux sont gérés dans <code className="bg-stone-100 px-1 rounded">src/data/hiddenSpots.ts</code>.
              Pour ajouter un lieu, utilisez le formulaire "Proposer un lieu" du site ou éditez le fichier directement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
