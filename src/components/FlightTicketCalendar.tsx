import React, { useState } from 'react';
import { 
  Plane, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Scissors, 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  Printer, 
  Download 
} from 'lucide-react';
import { FlightTicketData } from './FlightTicketTypes';

const BarcodePattern: React.FC<{ code: string }> = ({ code }) => (
  <div className="flex flex-col items-center select-none">
    <div className="flex items-stretch h-10 gap-0.5 overflow-hidden">
      {code.split('').map((char, i) => {
        const w = (char.charCodeAt(0) % 3) + 1;
        const isSpace = (i * 3) % 4 === 0;
        return (
          <div
            key={i}
            style={{ width: `${w * 2}px` }}
            className={`h-full ${isSpace ? 'bg-transparent' : 'bg-current'}`}
          />
        );
      })}
    </div>
    <span className="font-mono text-[9px] tracking-widest uppercase mt-1 opacity-60">
      {code}
    </span>
  </div>
);

export const FlightTicketCalendar: React.FC<{ initialData: FlightTicketData }> = ({ initialData }) => {
  const [data, setData] = useState<FlightTicketData>(initialData);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isTorn, setIsTorn] = useState<boolean>(false);
  const [isStamped, setIsStamped] = useState<boolean>(true);

  const currentDay = data.days[selectedDayIndex] || data.days[0];

  const toggleItem = (itemId: string) => {
    setData((prev) => {
      const newDays = prev.days.map((day) => ({
        ...day,
        items: day.items.map((item) =>
          item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
        ),
      }));
      return { ...prev, days: newDays };
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      
      {/* Barre d'actions & Sélecteur de jour */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 text-stone-100 p-4 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          {data.days.map((day, idx) => (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDayIndex === idx
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Jour {day.dayNumber} ({day.items.length} étapes)
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStamped(!isStamped)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
              isStamped
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isStamped ? 'Pass Validé' : 'Valider'}</span>
          </button>

          <button
            onClick={() => setIsTorn(!isTorn)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700 flex items-center gap-1.5"
          >
            <Scissors className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTorn ? 'Reconnecter' : 'Détacher Talon'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 flex items-center gap-1.5 hover:bg-amber-400"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* BILLET D'AVION & CALENDRIER */}
      <div className="flex flex-col lg:flex-row items-stretch shadow-2xl rounded-3xl overflow-visible">
        
        {/* CORPS PRINCIPAL DU BILLET */}
        <div className="flex-1 rounded-3xl lg:rounded-r-none border border-stone-200 bg-white text-stone-900 relative overflow-hidden flex flex-col justify-between">
          
          <div className="hidden lg:block absolute -right-3 top-[-12px] w-6 h-6 rounded-full bg-white border-b border-stone-200 z-20" />
          <div className="hidden lg:block absolute -right-3 bottom-[-12px] w-6 h-6 rounded-full bg-white border-t border-stone-200 z-20" />

          {isStamped && (
            <div className="absolute top-12 right-12 z-30 pointer-events-none transform -rotate-12 border-2 border-emerald-500/80 rounded-xl px-3 py-1.5 bg-emerald-50/80 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 font-mono font-black text-xs uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>EMBARQUÉ • PASS CONFIRMÉ</span>
              </div>
            </div>
          )}

          <div className="bg-stone-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Plane className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-black tracking-widest block opacity-70">
                  {data.airlineName} • BOARDING PASS
                </span>
                <span className="font-serif font-bold text-base leading-tight block">
                  {currentDay.title}
                </span>
              </div>
            </div>

            <div className="font-mono font-bold text-xs bg-white/10 px-3 py-1 rounded-lg">
              VOL: {data.flightNumber} • {data.flightClass}
            </div>
          </div>

          <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">ROUTE</span>
              <span className="font-mono font-black text-lg text-amber-600">
                {data.originCode} ➔ {data.destCode}
              </span>
              <span className="text-[10px] text-stone-500 block">{data.destName}</span>
            </div>

            <div>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">PASSAGER</span>
              <span className="font-bold text-stone-800 block truncate mt-0.5">{data.passengerName}</span>
            </div>

            <div>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">PORTE / SIÈGE</span>
              <span className="font-mono font-bold text-amber-600 block mt-0.5">{data.gate} • {data.seat}</span>
            </div>

            <div>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">CONVOCATION</span>
              <span className="font-mono font-bold text-emerald-600 block mt-0.5">
                {currentDay.items[0]?.timeString || '09:00'}
              </span>
            </div>
          </div>

          <div className="p-6 flex-1 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wide">
                <CalendarIcon className="w-4 h-4" />
                <span>Horaires & Planning Établi</span>
              </span>
              <span className="text-[11px] text-stone-400">
                {currentDay.items.length} étapes prévues
              </span>
            </div>

            <div className="space-y-3">
              {currentDay.items.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.isCompleted
                      ? 'bg-emerald-50 border-emerald-200 opacity-70'
                      : 'bg-stone-50 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="mt-0.5 text-stone-400 hover:text-amber-600 transition-colors"
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          {item.timeString}
                        </span>
                        {item.slotLabel && (
                          <span className="text-[10px] uppercase font-bold text-stone-400">
                            {item.slotLabel}
                          </span>
                        )}
                        {item.durationMinutes && (
                          <span className="text-[10px] text-stone-400">
                            (~{item.durationMinutes} min)
                          </span>
                        )}
                      </div>

                      <h4 className={`font-bold text-sm mt-1 ${item.isCompleted ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                        {item.title}
                      </h4>

                      <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        {item.location}
                      </p>

                      {item.accessHint && (
                        <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                          <strong>Accès :</strong> {item.accessHint}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-2.5 bg-stone-100 border-t border-stone-200 text-[10px] font-mono text-stone-400 flex justify-between">
            <span>OFFICIAL ITINERARY PASS • IATA FORMAT</span>
            <span>JOUR {currentDay.dayNumber} / {data.days.length}</span>
          </div>
        </div>

        {/* SOUCHE DÉTACHABLE */}
        <div
          className={`w-full lg:w-72 rounded-3xl lg:rounded-l-none border border-stone-200 bg-stone-50 text-stone-900 p-5 flex flex-col justify-between relative transition-all duration-300 ${
            isTorn
              ? 'lg:translate-x-4 lg:rotate-1 border-dashed border-amber-400 shadow-xl opacity-90'
              : 'border-dashed border-t-0 lg:border-t lg:border-l-0'
          }`}
        >
          <div className="hidden lg:block absolute -left-3 top-[-12px] w-6 h-6 rounded-full bg-white border-b border-stone-200 z-20" />
          <div className="hidden lg:block absolute -left-3 bottom-[-12px] w-6 h-6 rounded-full bg-white border-t border-stone-200 z-20" />

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 text-[10px] text-stone-400 font-mono">
              <span className="flex items-center gap-1">
                <Scissors className="w-3 h-3 text-amber-500" />
                SOUCHE DÉTACHABLE
              </span>
              <span className="text-amber-600 font-bold">{data.flightNumber}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[9px] text-stone-400 uppercase font-bold block">PASSAGER</span>
                <span className="font-bold text-stone-900 block truncate">{data.passengerName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-stone-400 uppercase font-bold block">SIÈGE</span>
                  <span className="font-mono font-bold text-amber-600">{data.seat}</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 uppercase font-bold block">PORTE</span>
                  <span className="font-mono font-bold text-stone-700">{data.gate}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                PROGRAMME DU JOUR
              </span>
              {currentDay.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-[10px]">
                  <span className="text-stone-600 truncate max-w-[120px]">{item.title}</span>
                  <span className="font-mono text-amber-600 font-bold">{item.timeString}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center text-stone-900">
            <BarcodePattern code={`ETKT-${data.flightNumber}-${currentDay.dayNumber}`} />
          </div>
        </div>

      </div>

    </div>
  );
};
