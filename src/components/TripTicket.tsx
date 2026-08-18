import React from 'react';
import { UserTripCalendar } from '../types';
import { CATEGORY_LABELS } from '../data/hiddenSpots';
import { X, Download, MapPin, Clock, Compass } from 'lucide-react';

interface TripTicketProps {
  calendar: UserTripCalendar;
  onClose: () => void;
}

export const TripTicket: React.FC<TripTicketProps> = ({ calendar, onClose }) => {
  const totalSpots = calendar.days.reduce((acc, d) => acc + d.items.length, 0);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=1200');
    if (!printWindow) return;

    const ticketHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Billet SecretScape - ${calendar.title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #1c1917; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .ticket { background: #fff; border-radius: 24px; overflow: hidden; width: 700px; box-shadow: 0 25px 50px rgba(0,0,0,0.3); }
  .ticket-header { background: linear-gradient(135deg, #1c1917 0%, #292524 100%); color: #fff; padding: 28px 32px; position: relative; overflow: hidden; }
  .ticket-header::after { content: ''; position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: rgba(245,158,11,0.15); border-radius: 50%; }
  .brand { font-size: 11px; font-weight: 700; color: #fbbf24; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
  .ticket-title { font-size: 22px; font-weight: 900; line-height: 1.2; }
  .ticket-dest { font-size: 13px; color: #a8a29e; margin-top: 6px; }
  .ticket-stats { display: flex; gap: 24px; margin-top: 16px; padding-top: 14px; border-top: 1px solid #44403c; }
  .stat-item { }
  .stat-label { font-size: 9px; color: #78716c; text-transform: uppercase; letter-spacing: 1px; }
  .stat-value { font-size: 18px; font-weight: 900; color: #fbbf24; }

  .perforation { border-top: 2px dashed #d6d3d1; margin: 0 16px; position: relative; }
  .perforation::before, .perforation::after { content: ''; position: absolute; top: -12px; width: 24px; height: 24px; background: #1c1917; border-radius: 50%; }
  .perforation::before { left: -12px; }
  .perforation::after { right: -12px; }

  .days-container { padding: 24px 32px; }
  .day-section { margin-bottom: 24px; }
  .day-section:last-child { margin-bottom: 0; }
  .day-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .day-badge { background: #fbbf24; color: #1c1917; font-size: 11px; font-weight: 900; padding: 4px 12px; border-radius: 8px; }
  .day-title { font-size: 14px; font-weight: 700; color: #292524; }
  .day-date { font-size: 11px; color: #78716c; margin-left: auto; }

  .spot-row { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f5f5f4; }
  .spot-row:last-child { border-bottom: none; }
  .spot-time { min-width: 52px; font-size: 12px; font-weight: 700; color: #92400e; background: #fef3c7; padding: 3px 8px; border-radius: 6px; text-align: center; }
  .spot-info { flex: 1; }
  .spot-name { font-size: 13px; font-weight: 700; color: #1c1917; }
  .spot-meta { font-size: 11px; color: #78716c; margin-top: 2px; }
  .spot-category { font-size: 9px; font-weight: 700; color: #92400e; background: #fef3c7; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .spot-hint { font-size: 10px; color: #a16207; margin-top: 3px; font-style: italic; }

  .ticket-footer { background: #1c1917; color: #a8a29e; padding: 20px 32px; display: flex; justify-content: space-between; align-items: center; }
  .footer-brand { font-size: 10px; font-weight: 700; color: #fbbf24; letter-spacing: 2px; }
  .footer-url { font-size: 10px; color: #78716c; }
  .barcode { display: flex; gap: 2px; align-items: end; height: 30px; }
  .barcode span { display: block; background: #57534e; width: 2px; }
  .barcode span:nth-child(odd) { height: 25px; }
  .barcode span:nth-child(even) { height: 18px; }
  .barcode span:nth-child(3n) { height: 30px; width: 3px; }

  @media print {
    body { background: white; padding: 0; }
    .ticket { box-shadow: none; border: 1px solid #e5e5e5; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
  <div class="ticket">
    <div class="ticket-header">
      <div class="brand">SecretScape — Bénin</div>
      <div class="ticket-title">${calendar.title}</div>
      <div class="ticket-dest">${calendar.destinationCity}</div>
      <div class="ticket-stats">
        <div class="stat-item">
          <div class="stat-label">Jours</div>
          <div class="stat-value">${calendar.days.length}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Lieux</div>
          <div class="stat-value">${totalSpots}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Destination</div>
          <div class="stat-value" style="font-size:14px">${calendar.destinationCity}</div>
        </div>
      </div>
    </div>

    <div class="perforation"></div>

    <div class="days-container">
      ${calendar.days.map(day => `
        <div class="day-section">
          <div class="day-header">
            <span class="day-badge">JOUR ${day.dayNumber}</span>
            <span class="day-title">${day.title || 'Jour ' + day.dayNumber}</span>
            ${day.dateString ? `<span class="day-date">${new Date(day.dateString).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>` : ''}
          </div>
          ${day.items.length === 0 ? '<div style="font-size:11px;color:#a8a29e;padding:8px 0;">Aucune étape planifiée</div>' : ''}
          ${day.items.map(item => {
            const slotLabels: Record<string, string> = { morning: 'Matin', noon: 'Midi', afternoon: 'Après-midi', sunset: 'Coucher', evening: 'Soirée' };
            return `
            <div class="spot-row">
              <div class="spot-time">${item.arrivalTime || item.timeString || slotLabels[item.timeSlot] || '?'}</div>
              <div class="spot-info">
                <div class="spot-name">${item.spot.title}</div>
                <div class="spot-meta">
                  <span class="spot-category">${CATEGORY_LABELS[item.spot.category]?.name || item.spot.category}</span>
                  &nbsp;· ${item.spot.city} · ${item.spot.address}
                  ${item.transportMode ? ` · 🚗 ${item.transportMode}` : ''}
                </div>
                <div class="spot-hint">💡 ${item.spot.secretAccessHint}</div>
              </div>
            </div>`;
          }).join('')}
        </div>
      `).join('')}
    </div>

    <div class="perforation"></div>

    <div class="ticket-footer">
      <div>
        <div class="footer-brand">SECRETSCAPE</div>
        <div class="footer-url">secretscape.onrender.com</div>
      </div>
      <div class="barcode">
        ${Array.from({length: 30}, () => `<span></span>`).join('')}
      </div>
    </div>
  </div>
</body>
</html>`;

    printWindow.document.write(ticketHTML);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="fixed inset-0 z-[700] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ticket Header */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-stone-100 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-amber-400 tracking-[3px] uppercase mb-2">SecretScape — Bénin</div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight">{calendar.title}</h2>
            <p className="text-stone-400 text-xs mt-1">{calendar.destinationCity}</p>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-stone-700">
              <div>
                <span className="text-[9px] text-stone-500 uppercase tracking-wider block">Jours</span>
                <span className="text-xl font-black text-amber-400">{calendar.days.length}</span>
              </div>
              <div>
                <span className="text-[9px] text-stone-500 uppercase tracking-wider block">Lieux</span>
                <span className="text-xl font-black text-amber-400">{totalSpots}</span>
              </div>
              <div>
                <span className="text-[9px] text-stone-500 uppercase tracking-wider block">Destination</span>
                <span className="text-sm font-bold text-stone-200">{calendar.destinationCity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Perforation */}
        <div className="border-t-2 border-dashed border-stone-200 mx-4 relative">
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-stone-100 rounded-full border-2 border-stone-200" />
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-stone-100 rounded-full border-2 border-stone-200" />
        </div>

        {/* Days Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {calendar.days.map(day => (
            <div key={day.dayNumber}>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-400 text-stone-900 text-[10px] font-black px-2.5 py-1 rounded-lg">JOUR {day.dayNumber}</span>
                <span className="text-sm font-bold text-stone-800">{day.title || `Jour ${day.dayNumber}`}</span>
                {day.dateString && (
                  <span className="ml-auto text-[11px] text-stone-400">
                    {new Date(day.dateString).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
              {day.items.length === 0 ? (
                <p className="text-[11px] text-stone-400 py-2">Aucune étape planifiée</p>
              ) : (
                <div className="space-y-0">
                  {day.items.map(item => {
                    const slotLabels: Record<string, string> = { morning: 'Matin', noon: 'Midi', afternoon: 'Après-midi', sunset: 'Coucher', evening: 'Soirée' };
                    return (
                      <div key={item.id} className="flex items-start gap-3 py-2.5 border-b border-stone-100 last:border-b-0">
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md text-center min-w-[48px] shrink-0">
                          {item.arrivalTime || item.timeString || slotLabels[item.timeSlot]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-stone-900">{item.spot.title}</span>
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded uppercase">
                              {CATEGORY_LABELS[item.spot.category]?.name || item.spot.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-[10px] text-stone-400">
                            <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{item.spot.city}</span>
                            <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{item.spot.bestTimeToVisit}</span>
                            {item.transportMode && <span>🚗 {item.transportMode}</span>}
                          </div>
                          <p className="text-[10px] text-amber-700 mt-1 italic">💡 {item.spot.secretAccessHint}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Perforation */}
        <div className="border-t-2 border-dashed border-stone-200 mx-4 relative">
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-stone-100 rounded-full border-2 border-stone-200" />
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-stone-100 rounded-full border-2 border-stone-200" />
        </div>

        {/* Footer */}
        <div className="bg-stone-900 text-stone-400 px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-400 tracking-[2px]">SECRETSCAPE</span>
            <span className="text-[10px] text-stone-600 ml-2">secretscape.onrender.com</span>
          </div>
          <div className="flex items-end gap-0.5 h-6">
            {Array.from({ length: 25 }, (_, i) => (
              <span key={i} className="block bg-stone-600 rounded-sm" style={{ width: i % 3 === 0 ? '3px' : '2px', height: i % 2 === 0 ? '20px' : '14px' }} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-4 border-t border-stone-200">
          <button
            onClick={handlePrint}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Télécharger en PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 text-stone-400 hover:text-stone-600 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
