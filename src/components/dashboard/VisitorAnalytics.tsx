import { Gamepad2, Users, DollarSign, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { EscapeRoomPerformance, MetricDataPoint } from '../../types/dashboard';

interface VisitorAnalyticsProps {
  escapeRooms: EscapeRoomPerformance[];
  metrics: MetricDataPoint[];
}

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

function formatRevenue(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

export function VisitorAnalytics({ escapeRooms, metrics }: VisitorAnalyticsProps) {
  const totalPlayers = escapeRooms.reduce((sum, r) => sum + r.activePlayers, 0);
  const totalRevenue = escapeRooms.reduce((sum, r) => sum + r.todayRevenue, 0);
  const totalSessions = escapeRooms.reduce((sum, r) => sum + r.liveSessions, 0);
  const avgSuccessRate =
    escapeRooms.length > 0
      ? escapeRooms.reduce((sum, r) => sum + r.successRatePercent, 0) / escapeRooms.length
      : 0;

  const barData = escapeRooms.map((r) => ({ name: r.name, joueurs: r.activePlayers }));
  const pieData = escapeRooms.map((r) => ({ name: r.name, value: r.todayRevenue }));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Joueurs Actifs</p>
            <p className="text-xl font-bold text-slate-100">{totalPlayers}</p>
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Revenus Aujourd'hui</p>
            <p className="text-xl font-bold text-slate-100">{formatRevenue(totalRevenue)} FCFA</p>
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400">
            <Gamepad2 size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Sessions en Cours</p>
            <p className="text-xl font-bold text-slate-100">{totalSessions}</p>
          </div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/15 text-violet-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Taux de Réussite Moyen</p>
            <p className="text-xl font-bold text-slate-100">{avgSuccessRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Salles d'Escape Game</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                  }}
                />
                <Bar dataKey="joueurs" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Revenus par Salle</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                  }}
                  formatter={(value: number) => `${formatRevenue(value)} FCFA`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-5 pb-0">
          <h3 className="text-sm font-semibold text-slate-300">Sessions en Cours</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left mt-3">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-400 text-xs uppercase">
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">Thème</th>
                <th className="px-5 py-3 text-center">Joueurs</th>
                <th className="px-5 py-3 text-center">Sessions</th>
                <th className="px-5 py-3 text-center">Temps Moy.</th>
                <th className="px-5 py-3">Réussite</th>
                <th className="px-5 py-3 text-right">Revenus (FCFA)</th>
                <th className="px-5 py-3">Serveur</th>
              </tr>
            </thead>
            <tbody>
              {escapeRooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-slate-100">{room.name}</td>
                  <td className="px-5 py-3 text-slate-400">{room.theme}</td>
                  <td className="px-5 py-3 text-center text-slate-200">{room.activePlayers}</td>
                  <td className="px-5 py-3 text-center text-slate-200">{room.liveSessions}</td>
                  <td className="px-5 py-3 text-center text-slate-200">
                    {room.avgSolveTimeMin} min
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            room.successRatePercent >= 70
                              ? 'bg-emerald-500'
                              : room.successRatePercent >= 40
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${room.successRatePercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-300 tabular-nums">
                        {room.successRatePercent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-emerald-400 tabular-nums">
                    {formatRevenue(room.todayRevenue)} FCFA
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-slate-700/60 text-slate-400 border border-slate-600/40 font-mono">
                      {room.serverInstance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
