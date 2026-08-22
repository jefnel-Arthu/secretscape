export type TrafficPreset = 'normal' | 'surge' | 'incident' | 'sale';

export interface MetricDataPoint {
  timestamp: string;
  inboundMbps: number;
  outboundMbps: number;
  requestsPerSec: number;
  latencyMs: number;
  errorRate: number;
  activeUsers: number;
  cpuPercent: number;
  memoryPercent: number;
  dbQueriesPerSec: number;
  cacheHitRatio: number;
}

export type ActionCategory =
  | 'booking'
  | 'gameplay'
  | 'auth'
  | 'payment'
  | 'navigation'
  | 'security'
  | 'page_view';

export type ActionSeverity = 'info' | 'success' | 'warning' | 'critical';

export interface UserAction {
  id: string;
  timestamp: string;
  isoTime: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userLocation: {
    city: string;
    country: string;
    countryCode: string;
    flag: string;
    lat: number;
    lng: number;
  };
  ipAddress: string;
  action: string;
  details: string;
  category: ActionCategory;
  severity: ActionSeverity;
  endpoint: string;
  statusCode: number;
  durationMs: number;
  roomName?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface SystemNode {
  id: string;
  name: string;
  region: string;
  status: 'healthy' | 'warning' | 'degraded';
  cpu: number;
  ram: number;
  disk: number;
  uptime: string;
  qps: number;
  threads: number;
}

export interface EndpointStat {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WS';
  avgLatencyMs: number;
  p99LatencyMs: number;
  requestsPerSec: number;
  errorCount: number;
  status: 'nominal' | 'degraded' | 'critical';
}

export interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  sourceIp: string;
  mitigation: string;
  status: 'active' | 'mitigated' | 'investigating';
  category: 'ddos' | 'bruteforce' | 'sqli' | 'anomaly' | 'waf';
}

export interface EscapeRoomPerformance {
  id: string;
  name: string;
  theme: string;
  activePlayers: number;
  liveSessions: number;
  avgSolveTimeMin: number;
  successRatePercent: number;
  todayRevenue: number;
  serverInstance: string;
}
