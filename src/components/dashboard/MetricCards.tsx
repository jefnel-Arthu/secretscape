import React from 'react';
import {
  Users,
  Eye,
  EyeOff,
  Heart,
  Mail,
  MapPin,
  Clock,
  Activity,
} from 'lucide-react';

interface MetricCardsProps {
  activeVisitors: number;
  pageViews: number;
  totalSpotViews: number;
  totalFavorites: number;
  totalMessages: number;
  unreadMessages: number;
  customSpotsCount: number;
  uptime: number;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  return d > 0 ? `${d}j ${h}h` : `${h}h`;
}

export const MetricCards = ({
  activeVisitors,
  pageViews,
  totalSpotViews,
  totalFavorites,
  totalMessages,
  unreadMessages,
  customSpotsCount,
  uptime,
}: MetricCardsProps) => {
  const cards = [
    { label: 'VISITEURS LIVE', value: activeVisitors.toLocaleString(), icon: Users, color: 'text-blue-600' },
    { label: 'PAGES VUES', value: pageViews.toLocaleString(), icon: Eye, color: 'text-amber-600' },
    { label: 'VUES LIEUX', value: totalSpotViews.toLocaleString(), icon: MapPin, color: 'text-emerald-600' },
    { label: 'FAVORIS', value: totalFavorites.toLocaleString(), icon: Heart, color: 'text-rose-500' },
    { label: 'MESSAGES', value: totalMessages.toLocaleString(), icon: Mail, color: 'text-violet-600' },
    { label: 'NON LUS', value: unreadMessages.toLocaleString(), icon: EyeOff, color: unreadMessages > 0 ? 'text-red-500' : 'text-gray-400' },
    { label: 'LIEUX CUSTOM', value: customSpotsCount.toLocaleString(), icon: Activity, color: 'text-cyan-600' },
    { label: 'UPTIME', value: formatUptime(uptime), icon: Clock, color: 'text-emerald-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-1.5"
          >
            <Icon className={`w-4 h-4 ${card.color}`} />
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
              {card.label}
            </span>
            <span className="text-2xl font-bold text-gray-900 leading-tight">
              {card.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
