import {
  MetricDataPoint,
  UserAction,
  TrafficPreset,
  SystemNode,
  EndpointStat,
  SecurityAlert,
  EscapeRoomPerformance,
} from '../types/dashboard';

const CITIES = [
  { city: 'Cotonou', country: 'Bénin', countryCode: 'BJ', flag: '🇧🇯', lat: 6.37, lng: 2.39 },
  { city: 'Porto-Novo', country: 'Bénin', countryCode: 'BJ', flag: '🇧🇯', lat: 6.49, lng: 2.62 },
  { city: 'Ouidah', country: 'Bénin', countryCode: 'BJ', flag: '🇧🇯', lat: 6.36, lng: 2.08 },
  { city: 'Abomey', country: 'Bénin', countryCode: 'BJ', flag: '🇧🇯', lat: 7.18, lng: 1.99 },
  { city: 'Grand-Popo', country: 'Bénin', countryCode: 'BJ', flag: '🇧🇯', lat: 6.28, lng: 1.97 },
  { city: 'Paris', country: 'France', countryCode: 'FR', flag: '🇫🇷', lat: 48.86, lng: 2.35 },
  { city: 'Lomé', country: 'Togo', countryCode: 'TG', flag: '🇹🇬', lat: 6.17, lng: 1.22 },
  { city: 'Abuja', country: 'Nigeria', countryCode: 'NG', flag: '🇳🇬', lat: 9.06, lng: 7.49 },
  { city: 'Lagos', country: 'Nigeria', countryCode: 'NG', flag: '🇳🇬', lat: 6.52, lng: 3.38 },
  { city: 'Montréal', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', lat: 45.5, lng: -73.57 },
];

const NAMES = [
  'Sophie Martin', 'Thomas Laurent', 'Amina Bello', 'Jean Koffi', 'Fatima Adeyemi',
  'Paul Agossa', 'Marie Dokpon', 'Ibrahim Sow', 'Claire Dupont', 'Brice Houédé',
  'Sarah Mensah', 'David Tchandjè', 'Léa Guézodjè', 'Michel Hountondji', 'Anne Cissé',
  'Emeka Obi', 'Grace Afolabi', 'Serge Gnacadja', 'Nadia Touré', 'François Amoussou',
];

const ACTIONS: Record<string, { action: string; details: string; endpoint: string; status: number; category: UserAction['category'] }[]> = {
  booking: [
    { action: 'Réservation Confirmée', details: 'Escape Room "Temple Secret" • 4 joueurs • 25 000 FCFA', endpoint: '/api/bookings', status: 201, category: 'booking' },
    { action: 'Créneau Bloqué', details: 'Salle "Route des Esclaves" vendredi 20h', endpoint: '/api/slots/reserve', status: 200, category: 'booking' },
    { action: 'Annulation Réservation', details: 'Salle "Tata Somba" - remboursement 50%', endpoint: '/api/bookings/cancel', status: 200, category: 'booking' },
  ],
  gameplay: [
    { action: 'Indice Débloqué', details: 'Indice sonore #3 dans "Mystère Ganvié"', endpoint: '/api/game/hint', status: 200, category: 'gameplay' },
    { action: 'Énigme Résolue', details: 'Énigme "Masques Royal" résolue en 12min', endpoint: '/api/game/puzzle', status: 200, category: 'gameplay' },
    { action: 'Session Commencée', details: 'Nouvelle partie "Porte du Non-Retour"', endpoint: '/api/game/start', status: 201, category: 'gameplay' },
  ],
  auth: [
    { action: 'Connexion Réussie', details: 'Authentification email/mot de passe', endpoint: '/api/auth/login', status: 200, category: 'auth' },
    { action: 'Token Rafraîchi', details: 'Refresh token JWT valide', endpoint: '/api/auth/refresh', status: 200, category: 'auth' },
    { action: 'Mot de Passe Réinitialisé', details: 'Email de reset envoyé', endpoint: '/api/auth/reset', status: 200, category: 'auth' },
  ],
  payment: [
    { action: 'Paiement Mobile Money', details: 'MTN Moov - 15 000 FCFA - Confirmation', endpoint: '/api/payments/momo', status: 200, category: 'payment' },
    { action: 'Paiement CB', details: 'Visa ****4523 - 32 000 FCFA', endpoint: '/api/payments/card', status: 200, category: 'payment' },
    { action: 'Remboursement Traitée', details: '12 500 FCFA retournés via MTN', endpoint: '/api/payments/refund', status: 200, category: 'payment' },
  ],
  navigation: [
    { action: 'Page Consultée', details: 'Fiche lieu "Plage Fidjrossè"', endpoint: '/api/spots/spot-fidjrosse', status: 200, category: 'navigation' },
    { action: 'Filtre Appliqué', details: 'Catégorie: Plages • Ville: Cotonou', endpoint: '/api/spots?filter=plages', status: 200, category: 'navigation' },
    { action: 'Favori Ajouté', details: '"Ganvié" ajouté aux favoris', endpoint: '/api/favorites', status: 201, category: 'navigation' },
  ],
  security: [
    { action: 'Tentative Brute-Force', details: '5 requêtes erronées en 2s • IP bannie temporairement', endpoint: '/api/auth/login', status: 429, category: 'security' },
    { action: 'SQL Injection Bloquée', details: 'Pattern détecté dans paramètre "q"', endpoint: '/api/search', status: 403, category: 'security' },
    { action: 'Rate Limit Dépassé', details: 'Client 192.168.1.x: 120 req/min (max 100)', endpoint: '/api/*', status: 429, category: 'security' },
  ],
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function now() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function generateInitialMetrics(): MetricDataPoint[] {
  const points: MetricDataPoint[] = [];
  const base = { inboundMbps: 280, outboundMbps: 420, requestsPerSec: 130, latencyMs: 18, cpuPercent: 35, ramUsage: 48, activeUsers: 412, errorRate: 0.2, dbQueriesPerSec: 85, cacheHitRatio: 94 };
  for (let i = 0; i < 30; i++) {
    points.push({
      timestamp: new Date(Date.now() - (30 - i) * 2000).toLocaleTimeString('fr-FR'),
      inboundMbps: Math.round(base.inboundMbps + rand(-30, 30)),
      outboundMbps: Math.round(base.outboundMbps + rand(-40, 40)),
      requestsPerSec: Math.round(base.requestsPerSec + rand(-15, 15)),
      latencyMs: Math.round(base.latencyMs + rand(-3, 3)),
      errorRate: Math.max(0, +(base.errorRate + rand(-0.1, 0.1)).toFixed(2)),
      activeUsers: Math.round(base.activeUsers + rand(-20, 20)),
      cpuPercent: Math.round(base.cpuPercent + rand(-5, 5)),
      memoryPercent: Math.round(base.ramUsage + rand(-2, 2)),
      dbQueriesPerSec: Math.round(base.dbQueriesPerSec + rand(-10, 10)),
      cacheHitRatio: Math.round(base.cacheHitRatio + rand(-2, 2)),
    });
  }
  return points;
}

export function generateNextMetricPoint(prev: MetricDataPoint, preset: TrafficPreset): MetricDataPoint {
  const multiplier = preset === 'surge' ? 2.5 : preset === 'incident' ? 0.4 : preset === 'sale' ? 1.8 : 1;
  return {
    timestamp: now(),
    inboundMbps: Math.round(Math.max(80, Math.min(1500, prev.inboundMbps + rand(-30, 30) * multiplier))),
    outboundMbps: Math.round(Math.max(120, Math.min(2000, prev.outboundMbps + rand(-40, 40) * multiplier))),
    requestsPerSec: Math.round(Math.max(20, Math.min(800, prev.requestsPerSec + rand(-12, 12) * multiplier))),
    latencyMs: Math.round(Math.max(5, Math.min(200, prev.latencyMs + rand(-4, 4) * (preset === 'incident' ? 3 : 1)))),
    errorRate: Math.max(0, Math.min(15, +(prev.errorRate + rand(-0.3, 0.3) * (preset === 'incident' ? 5 : 1)).toFixed(2))),
    activeUsers: Math.round(Math.max(100, Math.min(2000, prev.activeUsers + Math.floor(rand(-8, 8) * multiplier)))),
    cpuPercent: Math.round(Math.max(10, Math.min(98, prev.cpuPercent + rand(-4, 4) * multiplier))),
    memoryPercent: Math.round(Math.max(20, Math.min(95, prev.memoryPercent + rand(-1, 1) * multiplier))),
    dbQueriesPerSec: Math.round(Math.max(20, Math.min(400, prev.dbQueriesPerSec + rand(-8, 8) * multiplier))),
    cacheHitRatio: Math.round(Math.max(60, Math.min(99, prev.cacheHitRatio + rand(-1, 1)))),
  };
}

export function generateInitialActions(count: number): UserAction[] {
  return Array.from({ length: count }, () => generateRandomUserAction());
}

export function generateRandomUserAction(): UserAction {
  const categories: UserAction['category'][] = ['booking', 'gameplay', 'auth', 'payment', 'navigation', 'security'];
  const cat = pick(categories);
  const item = pick(ACTIONS[cat]);
  const name = pick(NAMES);
  const loc = pick(CITIES);
  const severities: UserAction['severity'][] = cat === 'security'
    ? ['warning', 'critical']
    : cat === 'booking' || cat === 'payment'
    ? ['success']
    : ['info', 'success'];

  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: now(),
    isoTime: new Date().toISOString(),
    userId: `usr-${Math.floor(rand(10000, 99999))}`,
    userName: name,
    userLocation: loc,
    ipAddress: `${Math.floor(rand(1, 200))}.${Math.floor(rand(0, 255))}.${Math.floor(rand(0, 255))}.${Math.floor(rand(1, 254))}`,
    action: item.action,
    details: item.details,
    category: item.category,
    severity: pick(severities),
    endpoint: item.endpoint,
    statusCode: item.status,
    durationMs: Math.round(rand(15, 500)),
    roomName: cat === 'gameplay' || cat === 'booking' ? pick(['Temple Secret', 'Mystère Ganvié', 'Route des Esclaves', 'Tata Somba', 'Porte du Non-Retour', 'Masques Royaux']) : undefined,
  };
}

export const ESCAPE_ROOMS: EscapeRoomPerformance[] = [
  { id: 'er-1', name: 'Temple Secret', theme: 'Mystique africaine', activePlayers: 8, liveSessions: 2, avgSolveTimeMin: 45, successRatePercent: 72, todayRevenue: 5800, serverInstance: 'srv-benin-1' },
  { id: 'er-2', name: 'Mystère Ganvié', theme: 'Villes lacustres', activePlayers: 12, liveSessions: 3, avgSolveTimeMin: 52, successRatePercent: 65, todayRevenue: 8400, serverInstance: 'srv-benin-1' },
  { id: 'er-3', name: 'Route des Esclaves', theme: 'Histoire & Mémoire', activePlayers: 6, liveSessions: 1, avgSolveTimeMin: 38, successRatePercent: 81, todayRevenue: 3200, serverInstance: 'srv-benin-2' },
  { id: 'er-4', name: 'Tata Somba', theme: 'Architecture ancestrale', activePlayers: 4, liveSessions: 1, avgSolveTimeMin: 55, successRatePercent: 58, todayRevenue: 2600, serverInstance: 'srv-benin-2' },
  { id: 'er-5', name: 'Porte du Non-Retour', theme: 'Traite négrière', activePlayers: 10, liveSessions: 2, avgSolveTimeMin: 42, successRatePercent: 69, todayRevenue: 7200, serverInstance: 'srv-edge-paris' },
  { id: 'er-6', name: 'Masques Royaux', theme: 'Art & Culture', activePlayers: 5, liveSessions: 1, avgSolveTimeMin: 35, successRatePercent: 85, todayRevenue: 3800, serverInstance: 'srv-edge-paris' },
];

export const INITIAL_SYSTEM_NODES: SystemNode[] = [
  { id: 'node-1', name: 'Bénin Primary', region: 'Cotonou, Bénin', status: 'healthy', cpu: 38, ram: 52, disk: 41, uptime: '42j 14h 32m', qps: 145, threads: 128 },
  { id: 'node-2', name: 'Edge Paris', region: 'Paris, France', status: 'healthy', cpu: 28, ram: 44, disk: 35, uptime: '18j 7h 15m', qps: 89, threads: 64 },
  { id: 'node-3', name: 'Edge Francfort', region: 'Francfort, Allemagne', status: 'warning', cpu: 72, ram: 68, disk: 55, uptime: '5j 22h 8m', qps: 67, threads: 96 },
  { id: 'node-4', name: 'DB Replica', region: 'Cotonou, Bénin', status: 'healthy', cpu: 45, ram: 61, disk: 72, uptime: '42j 14h 32m', qps: 210, threads: 32 },
];

export const INITIAL_ENDPOINTS: EndpointStat[] = [
  { path: '/api/spots', method: 'GET', avgLatencyMs: 28, p99LatencyMs: 85, requestsPerSec: 45, errorCount: 0, status: 'nominal' },
  { path: '/api/bookings', method: 'POST', avgLatencyMs: 65, p99LatencyMs: 210, requestsPerSec: 12, errorCount: 1, status: 'nominal' },
  { path: '/api/auth/login', method: 'POST', avgLatencyMs: 120, p99LatencyMs: 450, requestsPerSec: 8, errorCount: 3, status: 'degraded' },
  { path: '/api/payments/momo', method: 'POST', avgLatencyMs: 350, p99LatencyMs: 1200, requestsPerSec: 5, errorCount: 0, status: 'nominal' },
  { path: '/api/game/hint', method: 'GET', avgLatencyMs: 15, p99LatencyMs: 45, requestsPerSec: 22, errorCount: 0, status: 'nominal' },
  { path: '/api/search', method: 'GET', avgLatencyMs: 42, p99LatencyMs: 180, requestsPerSec: 35, errorCount: 0, status: 'nominal' },
  { path: '/api/favorites', method: 'PUT', avgLatencyMs: 32, p99LatencyMs: 95, requestsPerSec: 18, errorCount: 0, status: 'nominal' },
];

export const INITIAL_ALERTS: SecurityAlert[] = [
  { id: 'alert-1', title: 'Brute-Force détecté', description: '20 tentatives de login en 60s depuis IP 185.220.101.x', severity: 'high', timestamp: now(), sourceIp: '185.220.101.4', mitigation: 'IP bannie 30 min', status: 'mitigated', category: 'bruteforce' },
  { id: 'alert-2', title: 'Pattern SQL Injection', description: 'Paramètre "q" contient pattern suspect sur /api/search', severity: 'critical', timestamp: now(), sourceIp: '91.121.79.x', mitigation: 'Requête bloquée, WAF rule activée', status: 'active', category: 'sqli' },
  { id: 'alert-3', title: 'Anomalie trafic', description: 'Pic soudain de 800+ req/s depuis un seul client', severity: 'medium', timestamp: now(), sourceIp: '41.82.240.x', mitigation: 'Rate limit appliqué', status: 'investigating', category: 'anomaly' },
];
