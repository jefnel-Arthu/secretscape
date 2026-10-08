import React, { useState } from 'react';
import { SecretCategory, UserTripCalendar } from '../types';
import { Sparkles, MapPin, Calendar, Compass, X, Check, Loader2, ArrowRight } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPlan: (newCalendar: UserTripCalendar) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onImportPlan,
}) => {
  const [destination, setDestination] = useState<string>('Cotonou');
  const [durationDays, setDurationDays] = useState<number>(2);
  const [pace, setPace] = useState<'tranquille' | 'equilibre' | 'intense'>('equilibre');
  const [selectedVibes, setSelectedVibes] = useState<SecretCategory[]>([
    'sites',
    'plages',
    'restaurants',
  ]);
  const [extraNotes, setExtraNotes] = useState<string>('Je cherche des spots calmes et peu fréquentés');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleVibe = (vibe: SecretCategory) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setGeneratedPlan(null);

    try {
      const res = await fetch('/api/gemini/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          durationDays,
          pace,
          vibes: selectedVibes,
          extraNotes,
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la génération par l\'IA.');
      }

      const data = await res.json();
      if (data.plan) {
        setGeneratedPlan(data.plan);
        fetch('/api/track/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'ai_itinerary', detail: `Itinéraire IA généré: ${destination} (${durationDays} jours, ${selectedVibes.join(', ')})` }),
        }).catch(() => {});
      } else {
        throw new Error('Données incomplètes reçues.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de la génération.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToCalendar = () => {
    if (!generatedPlan) return;

    // Convert raw plan items to UserTripCalendar format
    const formattedDays = (generatedPlan.days || []).map((day: any) => ({
      dayNumber: day.dayNumber,
      title: day.title || `Jour ${day.dayNumber}`,
      items: (day.items || []).map((item: any, idx: number) => ({
        id: `ai-item-${day.dayNumber}-${idx}-${Date.now()}`,
        spotId: `ai-spot-${idx}`,
        timeSlot: item.timeSlot || 'morning',
        timeString: item.timeString || '10:00',
        notes: item.notes || '',
        spot: {
          id: `ai-spot-${day.dayNumber}-${idx}`,
          title: item.spotTitle || 'Etape Mystère',
          subtitle: item.subtitle || 'Lieu secret suggéré par l\'IA',
          category: item.category || 'sites',
          city: generatedPlan.destinationCity || destination,
          region: 'Bénin',
          coordinates: {
            lat: Number(item.lat) || 6.3703,
            lng: Number(item.lng) || 2.3912,
          },
          address: item.address || destination,
          secretLevel: 'moyen',
          description: item.description || 'Une adresse confidentielle à découvrir.',
          secretAccessHint: item.secretAccessHint || 'Accès discret.',
          bestTimeToVisit: item.bestTimeToVisit || 'Matinée',
          estimatedDurationMinutes: item.durationMinutes || 45,
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Ganvi%C3%A9_fishing_village_on_stilts_in_Benin_%2810282059623%29_%282%29.jpg/1280px-Ganvi%C3%A9_fishing_village_on_stilts_in_Benin_%2810282059623%29_%282%29.jpg',
          tags: ['AI Suggéré', 'Secret'],
          rating: 4.9,
          reviewCount: 24,
          crowdLevel: 'faible',
        },
      })),
    }));

    const newCalendar: UserTripCalendar = {
      title: generatedPlan.title || `Itinéraire Secret à ${destination}`,
      destinationCity: generatedPlan.destinationCity || destination,
      startDate: new Date().toISOString().split('T')[0],
      days: formattedDays,
    };

    onImportPlan(newCalendar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 p-6 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Générateur d'Itinéraire IA
              </h3>
              <p className="text-stone-400 text-xs">
                Créateur de calendrier sur-mesure d'étapes secrètes et cachées
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800/60 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {!generatedPlan ? (
            <div className="space-y-5">
              
              {/* Destination Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Destination ou Ville
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="ex: Cotonou, Ouidah, Porto-Novo, Abomey, Ganvié..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* Duration & Pace */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Durée du séjour
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value={1}>1 jour d'immersion</option>
                    <option value={2}>2 jours (Week-end secret)</option>
                    <option value={3}>3 jours (Grand circuit)</option>
                    <option value={4}>4 jours (Séjour complet)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Rythme de visite
                  </label>
                  <select
                    value={pace}
                    onChange={(e) => setPace(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="tranquille">Tranquille (2-3 étapes/jour)</option>
                    <option value="equilibre">Équilibré (3-4 étapes/jour)</option>
                    <option value="intense">Intense (Exploration maximale)</option>
                  </select>
                </div>
              </div>

              {/* Vibe Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Préférences de Lieux Cachés
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'sites', label: 'Sites touristiques' },
                    { id: 'plages', label: 'Plages' },
                    { id: 'restaurants', label: 'Restaurants' },
                    { id: 'boites', label: 'Boîtes de nuit' },
                    { id: 'transports', label: 'Moyens de transport' },
                    { id: 'hotels', label: 'Hôtels' },
                  ].map((v) => {
                    const isSelected = selectedVibes.includes(v.id as any);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => toggleVibe(v.id as any)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-sm'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Extra Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Remarques ou souhaits particuliers
                </label>
                <textarea
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  rows={2}
                  placeholder="ex: envie de photographie d'architecture, spots romantiques au coucher du soleil..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isLoading || !destination.trim()}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-stone-950" />
                    <span>L'IA conçoit votre calendrier secret...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Générer mon calendrier secret par IA</span>
                  </>
                )}
              </button>

            </div>
          ) : (
            /* AI Result Preview */
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Proposition d'Itinéraire IA
                </span>
                <h4 className="font-display text-lg font-bold text-amber-950">
                  {generatedPlan.title}
                </h4>
                <p className="text-amber-800 text-xs">
                  {generatedPlan.days?.length} jours programmés pour {generatedPlan.destinationCity}
                </p>
              </div>

              {/* Days List Preview */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {(generatedPlan.days || []).map((day: any) => (
                  <div key={day.dayNumber} className="border border-stone-200 rounded-2xl p-4 bg-stone-50 space-y-2">
                    <h5 className="font-display font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
                      Jour {day.dayNumber}: {day.title}
                    </h5>
                    <div className="space-y-2 pt-1">
                      {(day.items || []).map((it: any, i: number) => (
                        <div key={i} className="bg-white p-2.5 rounded-xl border border-stone-200/80 text-xs flex items-start gap-2">
                          <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded-md shrink-0 mt-0.5">
                            {it.timeString || 'Etape'}
                          </span>
                          <div>
                            <span className="font-bold text-stone-900 block">{it.spotTitle}</span>
                            <span className="text-stone-500 text-[11px] block">{it.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setGeneratedPlan(null)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 rounded-2xl text-xs transition-colors"
                >
                  Régénérer
                </button>
                <button
                  onClick={handleApplyToCalendar}
                  className="flex-[2] bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Importer dans mon calendrier</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
