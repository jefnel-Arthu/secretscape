import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HiddenSpot } from '../types';
import { Camera, X, Upload, User, ImagePlus, Loader2, CheckCircle2 } from 'lucide-react';
import { compressImage } from '../lib/image';

interface AddVisitorPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  spots: HiddenSpot[];
  initialSpotId?: string | null;
  onSubmitted?: () => void;
}

export const AddVisitorPhotoModal: React.FC<AddVisitorPhotoModalProps> = ({
  isOpen,
  onClose,
  spots,
  initialSpotId,
  onSubmitted,
}) => {
  const sortedSpots = useMemo(
    () => [...spots].sort((a, b) => a.title.localeCompare(b.title)),
    [spots]
  );

  const [spotId, setSpotId] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSpotId(initialSpotId && sortedSpots.some(s => s.id === initialSpotId) ? initialSpotId : (sortedSpots[0]?.id || ''));
    setVisitorName('');
    setMessage('');
    setPreview(null);
    setCompressing(false);
    setUploading(false);
    setDone(false);
    setError('');
  }, [isOpen, initialSpotId, sortedSpots]);

  if (!isOpen) return null;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Veuillez choisir une image (JPG, PNG...)');
      return;
    }
    setError('');
    setCompressing(true);
    try {
      const dataUrl = await compressImage(file);
      setPreview(dataUrl);
    } catch {
      setError('Impossible de lire cette image');
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotId || !visitorName.trim() || !preview) {
      setError('Veuillez remplir votre nom, choisir un lieu et ajouter une photo');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const spot = sortedSpots.find(s => s.id === spotId);
      const res = await fetch('/api/visitor-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spotId,
          spotTitle: spot?.title || '',
          visitorName: visitorName.trim(),
          message: message.trim(),
          imageData: preview,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'envoi");
        return;
      }
      fetch('/api/track/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'visitor_photo_submit', detail: `Photo partagée — ${spot?.title || spotId}`, spotId }),
      }).catch(() => {});
      setDone(true);
      onSubmitted?.();
    } catch {
      setError('Erreur réseau. Réessayez.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-stone-900 p-6 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Partager un Souvenir
              </h3>
              <p className="text-stone-400 text-xs">
                Ajoutez votre photo après votre visite d'un de ces lieux cachés
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success screen */}
        {done ? (
          <div className="p-10 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
            <h4 className="font-display font-bold text-xl text-stone-900">Photo envoyée !</h4>
            <p className="text-sm text-stone-500 max-w-sm mx-auto">
              Merci pour votre contribution. Votre souvenir sera publié après validation par notre équipe.
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">

            {/* Photo upload */}
            <div className="space-y-1">
              <label className="font-bold text-stone-700 uppercase">Votre photo *</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {!preview ? (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-center transition-colors"
                >
                  {compressing ? (
                    <>
                      <Loader2 className="w-9 h-9 text-amber-500 animate-spin" />
                      <span className="text-stone-500">Compression de l'image...</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-9 h-9 text-stone-400" />
                      <span className="text-stone-600 font-semibold text-sm">Cliquez pour choisir une photo</span>
                      <span className="text-stone-400 text-[11px]">Elle sera automatiquement optimisée avant envoi</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-stone-200">
                  <img src={preview} alt="Aperçu" className="w-full h-56 object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center justify-between">
                    <span className="text-white text-[11px] font-semibold">Aperçu de votre souvenir</span>
                    <button
                      type="button"
                      onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                      className="text-[11px] font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full backdrop-blur transition-colors"
                    >
                      Changer
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 uppercase">Lieu visité *</label>
              <select
                value={spotId}
                onChange={(e) => setSpotId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 text-xs focus:outline-none focus:border-amber-500"
              >
                {sortedSpots.map(s => (
                  <option key={s.id} value={s.id}>{s.title} — {s.city}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 uppercase">Votre nom *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="ex: Awa, Jean-Marc..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-stone-900 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 uppercase">Votre message (Optionnel)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                maxLength={300}
                placeholder="Un souvenir à partager auprès des futurs explorateurs..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 text-xs focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={uploading || compressing}
              className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{uploading ? "Envoi en cours..." : "Envoyer ma photo"}</span>
            </button>

            <p className="text-[10px] text-stone-400 text-center">
              Les photos sont validées par notre équipe avant publication.
            </p>

          </form>
        )}

      </div>
    </div>
  );
};
