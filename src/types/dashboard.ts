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
