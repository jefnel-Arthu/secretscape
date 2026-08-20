import React from 'react';
import {
  Users,
  Zap,
  Clock,
  AlertTriangle,
  Server,
  Activity,
  ShoppingBag,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { MetricDataPoint } from '../../types/dashboard';

interface MetricCardsProps {
  current: MetricDataPoint;
  prev?: MetricDataPoint;
  totalBookingsToday: number;
  totalRevenueToday: number;
}

interface CardDef {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  delta?: number;
}

export const MetricCards = ({
  current,
  prev,
  totalBookingsToday,
  totalRevenueToday,
}: MetricCardsProps) => {
  const delta = (cur: number, old?: number) =>
    old != null ? ((cur - old) / (old || 1)) * 100 : undefined;

  const cards: CardDef[] = [
    {
      label: 'TOURISTES LIVE',
      value: current.activeUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-400',
      delta: delta(current.activeUsers, prev?.activeUsers),
    },
    {
      label: 'REQUÊTES/SEC',
      value: current.requestsPerSec.toLocaleString(),
      icon: Zap,
      color: 'text-amber-400',
      delta: delta(current.requestsPerSec, prev?.requestsPerSec),
    },
    {
      label: 'LATENCE',
      value: `${current.latencyMs} ms`,
      icon: Clock,
      color: 'text-emerald-400',
      delta: delta(current.latencyMs, prev?.latencyMs),
    },
    {
      label: 'ERREURS',
      value: `${current.errorRate.toFixed(1)} %`,
      icon: AlertTriangle,
      color: 'text-red-400',
      delta: delta(current.errorRate, prev?.errorRate),
    },
    {
      label: 'CPU',
      value: `${current.cpuPercent.toFixed(1)} %`,
      icon: Server,
      color: 'text-violet-400',
      delta: delta(current.cpuPercent, prev?.cpuPercent),
    },
    {
      label: 'RAM',
      value: `${current.memoryPercent.toFixed(1)} %`,
      icon: Activity,
      color: 'text-cyan-400',
      delta: delta(current.memoryPercent, prev?.memoryPercent),
    },
    {
      label: 'REVENUS JOUR',
      value: `${totalRevenueToday.toLocaleString()} FCFA`,
      icon: ShoppingBag,
      color: 'text-emerald-400',
    },
    {
      label: 'RÉSERVATIONS',
      value: totalBookingsToday.toLocaleString(),
      icon: ShieldCheck,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isUp = card.delta != null && card.delta >= 0;
        const isDown = card.delta != null && card.delta < 0;
        const ArrowIcon = isDown ? ArrowDownRight : ArrowUpRight;

        return (
          <div
            key={card.label}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <Icon className={`w-4 h-4 ${card.color}`} />
              {card.delta != null && (
                <span
                  className={`flex items-center text-[10px] font-medium ${
                    isUp ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  <ArrowIcon className="w-3 h-3 mr-0.5" />
                  {Math.abs(card.delta).toFixed(1)}%
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
              {card.label}
            </span>
            <span className="text-2xl font-bold text-slate-100 leading-tight">
              {card.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
